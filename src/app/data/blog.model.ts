export interface BlogListItem {
  b?: string;
  text: string;
}

export interface BlogBlock {
  h2?: string;
  p?: string;
  ul?: BlogListItem[];
  quote?: string;
}

export interface BlogPost {
  slug: string;
  category: string;
  readTime: string;
  media: { photo: string };
  title: string;
  excerpt: string;
  eyebrow: string;
  lead: string;
  blocks: BlogBlock[];
}
