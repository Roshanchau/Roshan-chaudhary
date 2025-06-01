import AllTags from "../../_components/all-tags";
import unique from "@/app/lib/unique";
import BlogCard from "../../_components/blog-card";
import Error404 from "@/app/components/screens/404";
import { getAllBlogs } from "@/app/services/blog";

type Props = {
  params: Promise<{
    tag: string;
  }>;
};

const BlogByTag = async ({ params }: Props) => {
  const { tag } = await params;

  const allBlogs = await getAllBlogs();
  const tags = unique(
    allBlogs
      ?.map((blog) => {
        return blog.tags;
      })
      ?.flat()
  );

  const blogs = allBlogs?.filter((blog) => blog.tags?.includes(decodeURI(tag)));

  return (
    <section className="container mx-auto">
      <div className="mt-7 sm:mt-12">
        <div className="flex flex-col gap-5 md:gap-7 lg:flex-row xl:gap-24">
          {/* sidebar */}
          <div className="bg-card flex h-fit w-full flex-col gap-3 rounded-md px-6 py-7 shadow-md lg:w-72">
            <AllTags
              data={
                tags?.map((t) => ({
                  label: t ?? "",
                  href: `/blogs/tags/${t}`,
                })) || []
              }
            />
          </div>

          {/* all remaining blogs */}
          <div className="flex w-full flex-col gap-6">
            {blogs.length === 0 ? (
              <Error404
                title="No blogs found for this tag"
                subtitle="Please check back later, or try a different page."
              />
            ) : (
              blogs.map((blog) => {
                return <BlogCard key={blog.slug} {...blog} />;
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogByTag;

export async function generateStaticParams() {
  const posts = await getAllBlogs();
  const tags = unique(
    posts
      ?.map((blog) => {
        return blog.tags;
      })
      ?.flat()
  );
  return tags.map((tag) => ({
    tag: tag,
  }));
}