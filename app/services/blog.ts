import { Blog } from "@/app/types/blog.types";
import readingTime from "reading-time";
import { getAllPages , getSinglePage } from "./notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { extractImageUrlFromMd } from "../lib/extract-image-url-from-md";
import addRemoteImage from "../lib/add-remote-image";

const db_id= process.env.NOTION_BLOG_DATABASE_ID  as string;

if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(db_id)) {
  throw new Error("Invalid Notion Database ID format");
}

export const getAllBlogs = async (): Promise<Array<Blog>> => {
  try {
    const blogs = await getAllPages({
      database_id: db_id,
      filter: {
        property: "draft",
        checkbox: {
          equals: false,
        },
      },
      sorts: [  
        {
          property: "published_date",
          direction: "descending",
        },
      ],
    });

    if (!blogs || blogs?.length === 0) {
      return [];
    }

    const files = await Promise.all(
      blogs.map(async (blog) => {
        if (!blog) return null;
        const properties = extractBlogProperties(blog);
        if (!properties) return null;

        const b = await getBlogBySlug(properties.slug);
        if (!b) return null;

        return b;
      })
    );

    if (!files || files?.length === 0) {
      return [];
    }

    const result = await Promise.all(files);

    return result.filter((blog) => blog !== null) as Blog[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  try {
    const blog = await getSinglePage(slug, db_id);
    // console.log("hello from single page" , blog)

    if (!blog) return null;

    const properties = extractBlogProperties(blog.post);

    if (!properties) return null;

    const raw = blog.markdown;

    const imagesFromMd = extractImageUrlFromMd(raw);

    await addRemoteImage([...imagesFromMd, properties.coverImage]);

    return {
      readingTime: readingTime(raw).text,
      ...properties,
      raw,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const extractBlogProperties = (data: PageObjectResponse) => {
  const title =
    data.properties["title"] && data.properties["title"].type === "title"
      ? (data.properties["title"].title[0]?.plain_text ?? "")
      : "";
  if (!title) return null;

  const description =
    data.properties["description"] && data.properties["description"].type === "rich_text"
      ? (data.properties["description"].rich_text[0]?.plain_text ?? "")
      : "";
  if (!description) return null;

  const publishedAt =
    data.properties["published_date"] && data.properties["published_date"].type === "date"
      ? (data.properties["published_date"].date?.start ?? "")
      : "";
  if (!publishedAt) return null;

  const tags =
    data.properties["tags"] && data.properties["tags"].type === "multi_select"
      ? data.properties["tags"].multi_select.map((tag) => tag.name)
      : [];

  const coverImage =
    data.properties["cover_image"] && data.properties["cover_image"].type === "files"
      ? data.properties["cover_image"].files[0]?.type === "file"
        ? data.properties["cover_image"].files[0].file.url
        : ""
      : "";

  const slug =
    data.properties["slug"] && data.properties["slug"].type === "rich_text"
      ? (data.properties["slug"].rich_text[0]?.plain_text ?? "")
      : "";
  const series =
    data.properties["series"] && data.properties["series"].type === "multi_select"
      ? data.properties["series"].multi_select.map((tag) => tag.name)
      : [];

  if (!slug) return null;

  if (!coverImage) return null;

  const obj = {
    title,
    description,
    publishedAt,
    tags,
    coverImage,
    slug,
    series,
  };

  return obj;
};