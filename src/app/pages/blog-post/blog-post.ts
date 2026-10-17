import { Component, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BLOG_POSTS } from '../../data/blog.data';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';
import { Breadcrumb } from '../../shared/breadcrumbs/breadcrumbs.model';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink, Breadcrumbs],
})
export class BlogPostPage {
  private readonly router = inject(Router);

  readonly slug = input.required<string>();

  protected readonly post = computed(() => BLOG_POSTS.find((p) => p.slug === this.slug()));

  protected readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Главная', route: '/' },
    { label: 'Блог', route: '/blog' },
    { label: 'Статья' },
  ];

  constructor() {
    effect(() => {
      if (!this.post()) {
        void this.router.navigateByUrl('/blog');
      }
    });
  }
}
