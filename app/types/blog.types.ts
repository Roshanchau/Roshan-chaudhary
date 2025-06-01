export type BlogMetaData = Partial<{
  title: string;
  publishedAt: string;
  description: string;
  tags: string[];
  coverImage: string;
  series: string[];
}>;

export interface Blog extends BlogMetaData {
  raw: string;
  slug: string;
  readingTime: string;
}