import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

function setMatchMedia(matches: boolean) {
  (globalThis as any).matchMedia = (query: string) => ({
    matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }) as any;
}

function clearMatchMedia() {
  if ('matchMedia' in globalThis) {
    delete (globalThis as any).matchMedia;
  }
}

describe('ThemeService', () => {
  beforeEach(() => {
    clearMatchMedia();
    localStorage.clear();
  });

  it('берёт из localStorage при наличии валидного значения', () => {
    localStorage.setItem('theme', 'dark');
    setMatchMedia(false);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    const doc = TestBed.inject(DOCUMENT);
    expect(service.theme()).toBe('dark');
    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('fallback на prefers-color-scheme: dark', () => {
    localStorage.removeItem('theme');
    setMatchMedia(true);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('fallback на prefers-color-scheme: light', () => {
    localStorage.removeItem('theme');
    setMatchMedia(false);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
  });

  it('игнорирует невалидное значение в localStorage', () => {
    localStorage.setItem('theme', 'blue');
    setMatchMedia(true);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('не падает при ошибке записи в localStorage (приватный режим)', () => {
    localStorage.setItem('theme', 'dark');
    setMatchMedia(false);
    const origSet = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('blocked');
    };
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    expect(() => TestBed.inject(ThemeService)).not.toThrow();
    localStorage.setItem = origSet;
  });

  it('применяет data-theme и theme-color', () => {
    localStorage.setItem('theme', 'light');
    setMatchMedia(false);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const doc = TestBed.inject(DOCUMENT);
    const meta = doc.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
    expect(meta?.getAttribute('content')).toBe('var(--bg)');
  });
});
