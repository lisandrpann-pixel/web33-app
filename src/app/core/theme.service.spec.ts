import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

const THEME_KEY = 'web33-theme';

interface MediaQueryListStub {
  matches: boolean;
  media: string;
  addEventListener: (type: string, listener: (event: { matches: boolean }) => void) => void;
  removeEventListener: () => void;
}

function stubMatchMedia(matches: boolean): void {
  const stub = (query: string): MediaQueryListStub => ({
    matches,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  });
  Object.defineProperty(globalThis, 'matchMedia', { configurable: true, value: stub });
}

function removeMatchMedia(): void {
  Reflect.deleteProperty(globalThis, 'matchMedia');
}

describe('ThemeService', () => {
  beforeEach(() => {
    removeMatchMedia();
    localStorage.clear();
  });

  it('берёт из localStorage при наличии валидного значения', () => {
    localStorage.setItem(THEME_KEY, 'dark');
    stubMatchMedia(false);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    const doc = TestBed.inject(DOCUMENT);
    expect(service.theme()).toBe('dark');
    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('fallback на prefers-color-scheme: dark', () => {
    stubMatchMedia(true);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('fallback на prefers-color-scheme: light', () => {
    stubMatchMedia(false);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
  });

  it('игнорирует невалидное значение в localStorage', () => {
    localStorage.setItem(THEME_KEY, 'blue');
    stubMatchMedia(true);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('не падает при ошибке чтения localStorage (приватный режим)', () => {
    stubMatchMedia(false);
    const originalGet = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error('blocked');
    };
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    let service: ThemeService | undefined;
    expect(() => (service = TestBed.inject(ThemeService))).not.toThrow();
    expect(service?.theme()).toBe('light');
    localStorage.getItem = originalGet;
  });

  it('не падает при ошибке записи в localStorage (приватный режим)', () => {
    stubMatchMedia(false);
    const originalSet = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('blocked');
    };
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    expect(() => service.toggle()).not.toThrow();
    expect(service.theme()).toBe('dark');
    localStorage.setItem = originalSet;
  });

  it('toggle сохраняет тему под ожидаемым ключом', () => {
    stubMatchMedia(false);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(ThemeService);
    service.toggle();
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
  });

  it('применяет data-theme и theme-color', () => {
    stubMatchMedia(false);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const doc = TestBed.inject(DOCUMENT);
    const meta = doc.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    doc.head.appendChild(meta);
    const service = TestBed.inject(ThemeService);

    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
    expect(meta.getAttribute('content')).toBe('#ffffff');

    service.toggle();
    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(meta.getAttribute('content')).toBe('#0a0f1c');

    meta.remove();
  });
});
