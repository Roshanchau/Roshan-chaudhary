
import { Client, APIErrorCode, isNotionClientError } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";


const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});


export const getAllPages = async (
  query: Parameters<typeof notion.databases.query>[0]
): Promise<PageObjectResponse[] | undefined> => {
  try {
    const pages = await notion.databases.query(query);

    const allPages = pages.results.filter(
      (page): page is PageObjectResponse => page.object === "page"
    );

    return allPages.filter((page) => page?.id);
  } catch (err) {
    if (isNotionClientError(err) && err.code === APIErrorCode.ObjectNotFound) {
      console.error("Database not found");
    } else {
      console.error("Error fetching posts:", err);
    }
    return [];
  }
};

export const getSinglePage = async (
  slug: string,
  dbId: string
): Promise<{ post: PageObjectResponse; markdown: string } | undefined> => {
  try {
    const response = await notion.databases.query({
      database_id: dbId,
      filter: {
        url: {
          equals: slug,
        },
        property: "slug",
      },
    });

    const singlePost = response.results.find(
      (post): post is PageObjectResponse => post.object === "page"
    );

    if (!singlePost) {
      return undefined;
    }

    if (singlePost.properties.draft.type === "checkbox" && singlePost.properties.draft.checkbox) {
      return undefined;
    }

    // Convert to markdown
    const markdown = await notionToMD(singlePost.id);

    return {
      post: singlePost,
      markdown: markdown || "",
    };
  } catch (error) {
    if (isNotionClientError(error)) {
      if (error.code === APIErrorCode.ObjectNotFound) {
        console.error("Database not found");
      } else {
        console.error(`Notion API error: ${error.message}`);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    return undefined;
  }
};

export const notionToMD = async (pageId: string): Promise<string> => {
  try {
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const markdownBlocks = await n2m.pageToMarkdown(pageId);
    const mdStringObj = n2m.toMarkdownString(markdownBlocks);
    return mdStringObj.parent;
  } catch (error) {
    console.error("Markdown conversion failed:", error);
    return "";
  }
};
