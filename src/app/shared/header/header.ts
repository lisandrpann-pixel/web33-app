import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeService } from '../../core/theme.service';
import { CONTACTS, SITE_NAV, TRAINING_NAV } from '../../data/site.data';
import { NavItem } from '../../data/site.model';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [RouterLink, Icon],
})
export class Header {
  private readonly theme = inject(ThemeService);
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);

  readonly contacts = CONTACTS;

  readonly menuOpen = signal(false);
  readonly isDark = this.theme.isDark;

  private readonly trainingMode = signal(this.router.url.startsWith('/school'));

  readonly nav = computed<NavItem[]>(() => (this.trainingMode() ? TRAINING_NAV : SITE_NAV));

  readonly cta = computed<NavItem>(() =>
    this.trainingMode()
      ? { label: 'Записаться на занятие', route: '/school', fragment: 'contact' }
      : { label: 'Обсудить проект', route: '/', fragment: 'contact' },
  );

  readonly mobileContact = computed<NavItem>(() =>
    this.trainingMode()
      ? { label: 'Контакты', route: '/school', fragment: 'contact' }
      : { label: 'Контакты', route: '/', fragment: 'contact' },
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.trainingMode.set(event.urlAfterRedirects.startsWith('/school'));
        this.closeMenu();
      });
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.doc.body.classList.toggle('page--no-scroll', this.menuOpen());
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.doc.body.classList.remove('page--no-scroll');
  }
}
