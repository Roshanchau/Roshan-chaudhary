import { calculateTimeAgo } from "@/app/lib/calculate-time-ago";
import { cn } from "@/app/lib/utils";
import { Blog } from "@/app/types/blog.types";
import Image from "next/image";
import Link from "next/link";

type Props = Omit<Blog, "content"> & {
  className?: string;
};

const SecondaryBlogCard = (props: Props) => {
  return (
    <div
      className={cn(
        "bg-card flex w-full flex-col gap-6 rounded-xl p-2.5 shadow-md sm:flex-row sm:items-center",
        props.className
      )}
    >
      <div className="flex w-full items-center justify-center overflow-hidden rounded-md lg:max-h-[238px] lg:max-w-[238px]">
        <Link href={`/Blogs/${props.slug}`} className="h-full w-full">
          <Image
            className="h-full max-h-40 w-full rounded-md object-cover object-center"
            src={props.coverImage ?? ""}
            alt="hero"
            height={600}
            width={600}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="w-full lg:max-w-[272px]">
        <div className="flex gap-2">
          {props.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/Blogs/tags/${tag}`}
              className="mb-4 inline-flex rounded-full bg-purple-400/[0.08] px-3 py-1 text-xs font-medium text-purple-500 opacity-70"
            >
              {tag}
            </Link>
          ))}
        </div>
        <Link href={`/Blogs/${props.slug}`} className="hover:underline">
          <h2 className="mb-3 text-base font-semibold">{props.title}</h2>
        </Link>
        <div className="flex items-center gap-2.5">
          <p className="text-sm">
            <div>By Tilak Thapa</div>
          </p>
          <span className="flex h-[3px] w-[3px] rounded-full bg-gray-300" />
          <p className="text-sm">{calculateTimeAgo(props.publishedAt ?? "")}</p>
        </div>
      </div>
    </div>
  );
};

export default SecondaryBlogCard;