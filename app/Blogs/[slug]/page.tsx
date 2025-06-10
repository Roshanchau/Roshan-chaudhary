
import Error404 from "@/app/components/screens/404";
import { Badge } from "@/app/base/badge";
import { Separator } from "@/app/base/separator";
import { cn } from "@/app/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import MDX from "@/app/components/mdx/mdx";
import { getMdxContent } from "@/app/lib/get-mdx-content";
import { getAllBlogs, getBlogBySlug } from "@/app/services/blog";
import { IMAGES } from "@/app/constants/images";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>; 
};


const Page = async ({ params }: Props) => {
  const { slug } = await params; 
  const blog = await getBlogBySlug(decodeURI(slug));

  if (!blog) return <Error404 />;

  const {
    mdxSource: { content },
  } = await getMdxContent(blog.raw);

  return (
    <div className="mt-12 mb-12">
      <section className="container mx-auto flex max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl flex-col items-center justify-center">
        <div className="flex max-w-5xl flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-3">
            {blog.tags &&
              blog.tags.map((tag) => (
                <Link key={tag} href={`/Blogs/tags/${tag}`} className="w-fit">
                  <Badge variant={"outline"}>{tag}</Badge>
                </Link>
              ))}
          </div>
          <h1 className="mt-1 text-xl font-bold  sm:text-2xl md:text-3xl xl:text-4xl flex flex-col items-center justify-center">
            {blog.title}
          </h1>
          {blog.description && (
            <p className="max-w-3xl text-sm md:text-base" id="summary">
              {blog.description}
            </p>
          )}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={IMAGES.placeholders.avatar}
                alt="user"
                className="h-auto w-auto rounded-full object-cover object-center"
                height={80}
                width={80}
                loading="lazy"
              />
            </div>
            <div className="text-left">
              <div className="text-base font-medium">Roshan Chaudhary</div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <p>
                  {new Date(blog.publishedAt ?? "").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    weekday: "short",
                  })}
                </p>
                <span className="flex h-[3px] w-[3px] rounded-full" />
                <p>{blog.readingTime}</p>
              </div>
            </div>
          </div>
        </div>
        <Image
          src={blog.coverImage || ""}
          alt="thumbnail"
          className={cn(
            "mt-6 h-auto max-h-[500px] w-full max-w-5xl rounded-xl border border-gray-300  shadow-md"
          )}
          height={800}
          width={800}
        />
        <Separator className="mt-6 max-w-5xl" />
        <div className="mx-auto mt-12 flex w-full gap-16">
          <MDX id="blog" className="mx-auto max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
            {content}
          </MDX>
        </div>
        <div className="sr-only">{blog.tags?.map((tag) => `${tag} , `)}</div>
      </section>
    </div>
  );
};

export default Page;

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const blog = await getBlogBySlug(decodeURI(slug));
  return {
    title: blog?.title,
    description: blog?.description,
    authors: {    
      name: "Rosahn Cahduahry",
      url: process.env.NEXT_PUBLIC_SELF_URL,
    },
    keywords: [...(blog?.tags || []), "blog", "Roshan Chaudhary", "web development"],
    openGraph: {
      title: blog?.title,
      description: blog?.description,
      url: `${process.env.NEXT_PUBLIC_SELF_URL}/Blogs/${slug}`,
      type: "article",
      images: [
        {
          url: blog?.coverImage ?? "",
        },
      ],
    },
  };
};

export async function generateStaticParams() {
  const posts = await getAllBlogs();

  return posts.map((post) => ({
    slug: post.slug.trim(), 
  }));
}

