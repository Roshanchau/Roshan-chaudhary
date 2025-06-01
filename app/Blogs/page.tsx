import React from "react";
import PrimaryBlogCard from "./_components/primary-blog-card";
import SecondaryBlogCard from "./_components/secondary-blog-card";
import AllTags from "./_components/all-tags";
import BlogCard from "./_components/blog-card";
import unique from "../lib/unique";
import Error404 from "../components/screens/404";
import { Metadata } from "next";
import { getAllBlogs } from "@/app/services/blog";

const Page = async () => {
  const blogs = await getAllBlogs();
  const tags = unique(
    blogs
      ?.map((blog) => {
        return blog.tags;
      })
      ?.flat()
  );
  return (
    <section className="container m-auto flex max-w-7xl flex-col gap-6 md:gap-12 xl:gap-24">
      {blogs.length === 0 && (
        <Error404
          title="No blogs found"
          subtitle="Please check back later, or try a different page."
        />
      )}
      <div className="flex flex-col gap-y-4 md:gap-y-7 xl:gap-y-9">
        {/* first blog */}
        {blogs.length > 0 && <PrimaryBlogCard {...blogs[0]} className="animate-in-from-bottom" />}
        {/* second and third blogs */}
        <div className="grid grid-cols-1 gap-x-7 gap-y-9 lg:grid-cols-2">
          {blogs.length > 1 && (
            <SecondaryBlogCard {...blogs[1]} className="animate-in-from-bottom delay-75" />
          )}
          {blogs.length > 2 && (
            <SecondaryBlogCard {...blogs[2]} className="animate-in-from-bottom delay-150" />
          )}
        </div>
      </div>
      {blogs.length > 3 && (
        <div className="flex flex-col gap-5 md:gap-7 lg:flex-row xl:gap-24">
          {/* sidebar */}
          <div className="bg-card animate-in-from-left flex h-fit w-full flex-col gap-3 rounded-md px-6 py-7 shadow-md delay-200 lg:w-72">
            <AllTags
              data={
                tags
                  ?.filter((t): t is string => t !== undefined && t !== "")
                  .map((t) => ({
                    label: t,
                    href: `/blogs/tags/${t}`,
                  })) || []
              }
            />
          </div>

          {/* all remaining blogs */}
          <div className="flex w-full flex-col gap-6">
            {blogs.map((blog, i) => {
              if (i < 3) return null;
              return (
                <BlogCard
                  className="animate-in-from-right"
                  style={{
                    animationDelay: `${i * 50 + 200}ms`,
                  }}
                  key={blog.slug}
                  {...blog}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;

export const metadata: Metadata = {
  title: `Blogs`,
};