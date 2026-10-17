import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BLOG_FOOTNOTE, BLOG_PAGE, BLOG_POSTS } from '../../data/blog.data';
import { BlogPost } from '../../data/blog.model';
import { CONTACTS } from '../../data/site.data';
import { Breadcrumb } from '../../shared/breadcrumbs/breadcrumbs.model';
import { CaseCard } from '../../shared/case-card/case-card';
import { CaseCardData } from '../../shared/case-card/case-card.model';
import { PageHead } from '../../shared/page-head/page-head';

@Component({
  selector: 'app-blog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog.html',
  styles: [':host { display: contents; }'],
  imports: [PageHead, CaseCard],
})
export class Blog {
  protected readonly page = BLOG_PAGE;
  protected readonly footnote = BLOG_FOOTNOTE;
  protected readonly contacts = CONTACTS;
  protected readonly posts = BLOG_POSTS;
  protected readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Главная', route: '/' },
    { label: 'Блог' },
  ];

  protected toCard(post: BlogPost): CaseCardData {
    return {
      title: post.title,
      titleRoute: `/blog/${post.slug}`,
      tags: [post.category, post.readTime],
      tagsFirst: true,
      media: post.media,
      text: post.excerpt,
      link: { label: 'Читать статью', route: `/blog/${post.slug}` },
    };
  }
}
