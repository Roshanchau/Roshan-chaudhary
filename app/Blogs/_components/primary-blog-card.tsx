import { IMAGES } from "@/app/constants/images";
import { calculateTimeAgo } from "@/app/lib/calculate-time-ago";
import { cn } from "@/app/lib/utils";
import { Blog } from "@/app/types/blog.types";
import Image from "next-export-optimize-images/image";
import RemoteImage from 'next-export-optimize-images/remote-image'
import Link from "next/link";

type Props = Omit<Blog, "content"> & {
  className?: string;
  style?: React.CSSProperties;
};

const PrimaryBlogCard = (props: Props) => {
  return (
    <div
      className={cn(
        "bg-card flex w-full flex-col gap-7.5 rounded-xl p-4 shadow-lg lg:flex-row lg:items-center lg:gap-11 lg:p-2.5 lg:py-4",
        props.className
      )}
      style={props.style}
    >
      <div className="flex w-full items-center justify-center overflow-hidden rounded-md lg:max-h-[320px] lg:max-w-[536px]">
        <Link href={`/blogs/${props.slug}`} className="h-full w-full">
          <RemoteImage
            className="h-full max-h-72 w-full rounded-md object-cover object-center"
            src={props.coverImage ?? ""}
            alt="hero"
            height={600}
            width={600}
          />
        </Link>
      </div>
      <div className="w-full lg:max-w-[540px]">
        <div className="mt-3 flex flex-wrap gap-2">
          {props.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/blogs/tags/${tag}`}
              className="inline-flex rounded-full bg-purple-400/[0.08] px-3 py-1 text-sm font-medium text-purple-500 opacity-70"
            >
              {tag}
            </Link>
          ))}
        </div>
        <Link href={`/blogs/${props.slug}`} className="hover:underline">
          <h1 className="mb-4 text-lg font-bold sm:text-xl md:text-2xl xl:text-3xl">
            {props.title}
          </h1>
        </Link>
        <p className="max-w-[524px] text-sm xl:text-base">
          {props.description?.substring(0, 130)}
          {(props.description?.length ?? 0 > 130) ? "..." : ""}
        </p>
        <div className="mt-5 flex items-center gap-2.5">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 overflow-hidden rounded-full">
              <Image
                src={IMAGES.avatar}
                alt="user"
                className="h-full w-full object-cover object-center"
                height={80}
                width={80}
              />
            </div>
            <p className="text-sm">Tilak Thapa</p>
          </div>
          <span className="flex h-[3px] w-[3px] rounded-full bg-gray-300" />
          <p className="text-sm">{calculateTimeAgo(props.publishedAt ?? "")}</p>
        </div>
      </div>
    </div>
  );
};

export default PrimaryBlogCard;