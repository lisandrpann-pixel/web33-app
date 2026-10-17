export interface CaseCardResult {
  value: string;
  label: string;
}

export interface CaseCardMedia {
  text: string;
  variant?: 'b' | 'c';
  tall?: boolean;
}

export interface CaseCardBlock {
  label: string;
  text: string;
}

export interface CaseCardLink {
  label: string;
  route: string;
  fragment?: string;
}

export interface CaseCardData {
  title: string;
  titleRoute?: string;
  eyebrow?: string;
  tags: string[];
  tagsFirst?: boolean;
  media?: CaseCardMedia;
  mediaAfter?: boolean;
  text?: string;
  blocks?: CaseCardBlock[];
  results?: CaseCardResult[];
  link?: CaseCardLink;
  wide?: boolean;
}
