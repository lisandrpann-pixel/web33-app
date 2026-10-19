import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Theme } from './theme.model';

const THEME_KEY = 'web33-theme';

/** Тема по умолчанию, пока пользователь не выбрал свою. */
const DEFAULT_THEME: Theme = 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly themeState = signal<Theme>(this.readInitialTheme());

  readonly theme = this.themeState.asReadonly();
  readonly isDark = computed(() => this.themeState() === 'dark');

  constructor() {
    this.apply(this.themeState(), false);
  }

  toggle(): void {
    this.apply(this.themeState() === 'dark' ? 'light' : 'dark', true);
  }

  /** Приватный режим может бросать и на чтении, и на записи — не роняем приложение. */
  private readSavedTheme(): string | null {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  private readInitialTheme(): Theme {
    if (!this.isBrowser) {
      return DEFAULT_THEME;
    }

    const saved = this.readSavedTheme();
    return saved === 'light' || saved === 'dark' ? saved : DEFAULT_THEME;
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
