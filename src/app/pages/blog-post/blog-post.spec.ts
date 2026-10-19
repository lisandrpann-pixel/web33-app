import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { BlogPostPage } from './blog-post';
import { canMatchKnownBlogSlug } from '../../app.routes';
import { BLOG_POSTS } from '../../data/blog.data';

describe('BlogPostPage', () => {
  const routes: Routes = [
    { path: 'blog/:slug', component: BlogPostPage, canMatch: [canMatchKnownBlogSlug] },
    { path: '**', loadComponent: () => import('../not-found/not-found').then((m) => m.NotFound) },
  ];

  async function navigate(url: string): Promise<Router> {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    }).compileComponents();
    const router = TestBed.inject(Router);
    await router.navigateByUrl(url);
    return router;
  }

  it('с известным slug матчится роутом blog/:slug', async () => {
    const router = await navigate(`/blog/${BLOG_POSTS[0].slug}`);
    expect(router.url).toBe(`/blog/${BLOG_POSTS[0].slug}`);
  });

  it('с неизвестным slug не матчится роутом (canMatch блокирует) → уходит на **', async () => {
    const router = await navigate('/blog/unknown-slug-xyz');
    /* canMatch не пропускает неизвестный slug, маршрут blog/:slug не выбирается,
       навигация уходит на ** (страница 404). */
    expect(router.url).toBe('/blog/unknown-slug-xyz');
    expect(router.routerState.snapshot.root.firstChild?.routeConfig?.path).toBe('**');
  });
});
