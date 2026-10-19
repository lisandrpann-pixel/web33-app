import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SITE_URL } from '../data/site.data';

/**
 * Обновляет <title>, <meta name="description">, Open Graph/Twitter-теги и
 * <link rel="canonical"> данными активного маршрута. description берётся из
 * route.data или resolve (см. app.routes.ts) на самом глубоком уровне, где он задан.
 * Заменяет ручную подписку на NavigationEnd. Работает и при пререндере, и в браузере.
 */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title !== undefined) {
      this.title.setTitle(title);
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ name: 'twitter:title', content: title });
    }

    const description = this.deepestData(snapshot, 'description');
    if (typeof description === 'string') {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:description', content: description });
    }

    const url = SITE_URL + snapshot.url.split('?')[0];
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ rel: 'canonical', href: url });
  }

  private deepestData(snapshot: RouterStateSnapshot, key: string): unknown {
    let value: unknown;
    let route: ActivatedRouteSnapshot | null = snapshot.root;

    while (route) {
      if (route.data[key] !== undefined) {
        value = route.data[key];
      }
      route = route.firstChild;
    }

    return value;
  }
}
