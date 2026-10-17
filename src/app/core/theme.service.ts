import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Theme } from './theme.model';

const THEME_KEY = 'web33-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly themeState = signal<Theme>(this.readInitialTheme());

  readonly theme = this.themeState.asReadonly();
  readonly isDark = computed(() => this.themeState() === 'dark');

  constructor() {
    this.apply(this.themeState(), false);

    if (this.isBrowser && typeof window.matchMedia === 'function') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener?.('change', (event) => {
        if (!localStorage.getItem(THEME_KEY)) {
          this.apply(event.matches ? 'dark' : 'light', false);
        }
      });
    }
  }

  toggle(): void {
    this.apply(this.themeState() === 'dark' ? 'light' : 'dark', true);
  }

  private readInitialTheme(): Theme {
    if (!this.isBrowser) {
      return 'light';
    }

    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    if (typeof window.matchMedia !== 'function') {
      return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(theme: Theme, persist: boolean): void {
    this.themeState.set(theme);
    this.doc.documentElement.setAttribute('data-theme', theme);
    this.doc
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0a0f1c' : '#ffffff');

    if (persist && this.isBrowser) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        /* приватный режим — тема просто не сохранится */
      }
    }
  }
}
