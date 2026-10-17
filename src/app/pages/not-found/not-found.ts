import { ChangeDetectionStrategy, Component, inject, RESPONSE_INIT } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACTS, SITE_NAV } from '../../data/site.data';
import { NavItem } from '../../data/site.model';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';
import { Breadcrumb } from '../../shared/breadcrumbs/breadcrumbs.model';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  imports: [RouterLink, Breadcrumbs],
})
export class NotFound {
  protected readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Главная', route: '/' },
    { label: 'Страница не найдена' },
  ];

  protected readonly links: NavItem[] = SITE_NAV;
  protected readonly contacts = CONTACTS;

  constructor() {
    /* Настоящий статус 404 — только при серверном рендере (RenderMode.Server).
       При пререндере и в браузере токен равен null. */
    const responseInit = inject(RESPONSE_INIT, { optional: true });
    if (responseInit) {
      responseInit.status = 404;
    }
  }
}
