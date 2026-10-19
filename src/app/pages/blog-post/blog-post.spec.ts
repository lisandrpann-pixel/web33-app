import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { BlogPostPage } from './blog-post';
import { canMatchKnownBlogSlug } from '../../app.routes';

describe('BlogPostPage', () => {
  it('с известным slug создаёт компонент', async () => {
    const routes: Routes = [
      { path: 'blog/:slug', component: BlogPostPage, canMatch: [canMatchKnownBlogSlug] },
      { path: '**', loadComponent: () => import('../not-found/not-found').then((m) => m.NotFound) },
    ];
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    }).compileComponents();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/blog/avtopilot-3s');
    expect(router.url).toContain('/blog/avtopilot-3s');
  });

  it('с неизвестным slug не матчится роутом (canMatch блокирует) → уходит на **', async () => {
    const routes: Routes = [
      { path: 'blog/:slug', component: BlogPostPage, canMatch: [canMatchKnownBlogSlug] },
      { path: '**', loadComponent: () => import('../not-found/not-found').then((m) => m.NotFound) },
    ];
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    }).compileComponents();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/blog/unknown-slug-xyz');
    expect(router.url).toBe('/unknown-slug-xyz');
  });
});
