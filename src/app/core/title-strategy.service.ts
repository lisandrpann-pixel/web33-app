import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

/**
 * Обновляет <title> и <meta name="description"> данными активного маршрута.
 * description берётся из route.data или resolve (см. app.routes.ts) на самом
 * глубоком уровне, где он задан. Заменяет ручную подписку на NavigationEnd.
 */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title !== undefined) {
      this.title.setTitle(title);
    }

    const description = this.deepestData(snapshot, 'description');
    if (typeof description === 'string') {
      this.meta.updateTag({ name: 'description', content: description });
    }
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
