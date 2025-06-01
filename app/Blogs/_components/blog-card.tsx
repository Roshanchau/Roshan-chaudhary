import { cn } from "@/app/lib/utils";
import { Blog } from "@/app/types/blog.types";
import RemoteImage from 'next-export-optimize-images/remote-image'
import Link from "next/link";
import React from "react";

type Props = Omit<Blog, "content"> & {
  lessDescription?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const BlogCard = (props: Props) => {
  const descriptionLength = props.lessDescription ? 80 : 150;
  return (
    console.log("BlogCard Props:", props),
    <div
      className={cn(
        "bg-card flex h-full w-full flex-col gap-6 rounded-xl px-3.5 py-3 shadow-md sm:flex-row sm:items-center sm:px-5 sm:py-5",
        props.className
      )}
      style={props.style}
    >
      <div className="flex w-full items-center justify-center overflow-hidden lg:max-h-[160px] lg:max-w-[238px]">
        <Link href={`/blogs/${props.slug}`} className="h-full w-full">
          <RemoteImage
            className="h-full max-h-40 w-full rounded-md object-cover object-center"
            src={props.coverImage ?? ""}
            alt="hero"
            height={600}
            width={600}
          />
        </Link>
      </div>
      <div className="w-full">
        <div className="flex gap-2">
          {props.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/blogs/tags/${tag}`}
              className="mb-4 inline-flex rounded-full bg-purple-400/[0.08] px-3 py-1 text-xs font-medium text-purple-500 opacity-70"
            >
              {tag}
            </Link>
          ))}
        </div>
        <Link href={`/blogs/${props.slug}`} className="hover:underline">
          <h2 className="mb-3 text-base font-semibold">{props.title}</h2>
        </Link>
        <p className="text-sm text-gray-600">
          {props.description?.substring(0, descriptionLength)}
          {(props.description?.length ?? 0 > descriptionLength) ? "..." : ""}
        </p>
        <div className="mt-2 flex items-center gap-2.5">
          <p className="text-sm">
            <div>By Tilak Thapa</div>
          </p>
          <span className="flex h-[3px] w-[3px] rounded-full bg-gray-300" />
          <p className="text-sm">
            {new Date(props.publishedAt ?? "").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;