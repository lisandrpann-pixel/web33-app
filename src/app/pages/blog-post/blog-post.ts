import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS } from '../../data/blog.data';
import { Breadcrumbs } from '../../components/breadcrumbs/breadcrumbs';
import { Breadcrumb } from '../../components/breadcrumbs/breadcrumbs.model';
import { Blockquote } from '../../components/blockquote/blockquote';

@Component({
  selector: 'app-blog-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-post.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink, Breadcrumbs, Blockquote],
})
export class BlogPostPage {
  readonly slug = input.required<string>();

  protected readonly post = computed(() => BLOG_POSTS.find((p) => p.slug === this.slug()));

  protected readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Главная', route: '/' },
    { label: 'Блог' },
    { label: 'Статья' },
  ];
}
