"use client";
import { Badge } from "@/app/base/badge";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
type Props = {
  data: {
    label: string;
    href: string;
  }[];
};

const AllTags = ({ data }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const { tag: tagFromParam } = useParams() as { tag: string };
  return (
    <>
      <h3 className="text-xl font-bold">Tags</h3>
      <div className="hidden max-h-72 flex-wrap gap-2 overflow-y-auto lg:flex">
        {data.map((tag) => (
          <Link key={tag.href} href={tag.href} className="w-fit">
            <Badge variant={tagFromParam === tag.label ? "default" : "outline"}>{tag.label}</Badge>
          </Link>
        ))}
      </div>
      <div className="flex max-h-72 flex-wrap gap-2 overflow-y-auto lg:hidden">
        {data.map((tag, i) => {
          if (!showAll && i > 3) return null;
          return (
            <Link key={tag.href} href={tag.href} className="w-fit">
              <Badge variant={"outline"}>{tag.label}</Badge>
            </Link>
          );
        })}
        {data.length > 4 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm font-medium text-purple-500"
          >
            {showAll ? "Show less" : `Show all `}
          </button>
        )}
      </div>
    </>
  );
};

export default AllTags;