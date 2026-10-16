import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

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

@Component({
  selector: 'app-case-card',
  templateUrl: './case-card.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink, NgTemplateOutlet],
})
export class CaseCard {
  readonly data = input.required<CaseCardData>();
}
