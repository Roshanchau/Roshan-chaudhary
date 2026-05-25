import "server-only";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { VOICE_AGENT_CONFIG } from "../../config/voiceAgent";
import { getAllPages } from "../../services/notion";

/**
 * Lightweight blog knowledge for the voice agent.
 *
 * The blog pages fetch full content + images per post; the agent only needs to
 * know which posts exist and what each is about. So this reads just the list
 * metadata (title, description, tags, date) from Notion and caches it, instead
 * of importing services/blog.ts (which downloads content and throws at import
 * time when NOTION_BLOG_DATABASE_ID is unset). Missing config or fetch errors
 * degrade gracefully to an empty list — the agent simply won't mention blogs.
 */
export interface BlogSummary {
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
}

const DB_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let cache: { fetchedAt: number; summaries: BlogSummary[] } | null = null;

const extractSummary = (page: PageObjectResponse): BlogSummary | null => {
  const props = page.properties;

  const titleProp = props["title"];
  const title =
    titleProp?.type === "title" ? (titleProp.title[0]?.plain_text ?? "") : "";
  if (!title) return null;

  const descProp = props["description"];
  const description =
    descProp?.type === "rich_text"
      ? (descProp.rich_text[0]?.plain_text ?? "")
      : "";

  const dateProp = props["published_date"];
  const publishedAt =
    dateProp?.type === "date" ? (dateProp.date?.start ?? "") : "";

  const tagsProp = props["tags"];
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t) => t.name)
      : [];

  return { title, description, tags, publishedAt };
};

const fetchBlogSummaries = async (): Promise<BlogSummary[]> => {
  const dbId = process.env.NOTION_BLOG_DATABASE_ID;
  if (!dbId || !DB_ID_RE.test(dbId)) return [];

  const pages = await getAllPages({
    database_id: dbId,
    filter: { property: "draft", checkbox: { equals: false } },
    sorts: [{ property: "published_date", direction: "descending" }],
  });
  if (!pages || pages.length === 0) return [];

  return pages
    .map(extractSummary)
    .filter((b): b is BlogSummary => b !== null);
};

export const getBlogSummaries = async (): Promise<BlogSummary[]> => {
  const ttl = VOICE_AGENT_CONFIG.knowledge.blogCacheTtlMs;
  if (cache && Date.now() - cache.fetchedAt < ttl) return cache.summaries;

  try {
    const summaries = await fetchBlogSummaries();
    cache = { fetchedAt: Date.now(), summaries };
    return summaries;
  } catch (err) {
    console.error("[voice:blogKnowledge]", err);
    return cache?.summaries ?? [];
  }
};

export const buildBlogKnowledge = (summaries: BlogSummary[]): string => {
  if (summaries.length === 0) return "";

  const lines = summaries.map((b) => {
    const date = b.publishedAt ? ` [${b.publishedAt}]` : "";
    const tags = b.tags.length ? ` (tags: ${b.tags.join(", ")})` : "";
    const desc = b.description ? ` — ${b.description}` : "";
    return `- "${b.title}"${date}${tags}${desc}`;
  });

  return `Published blog posts (${summaries.length}):\n${lines.join("\n")}`;
};
