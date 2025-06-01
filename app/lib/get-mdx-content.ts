import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import MDXComponents from "../components/mdx/mdx-components";

export async function getMdxContent<T extends Record<string, unknown>>(source: string) {
  const mdxSource = await compileMDX<T>({
    source: source,
    components: MDXComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          rehypeAutolinkHeadings,
          [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
        ],
      },
    },
  });

  return { mdxSource, raw: source };
}