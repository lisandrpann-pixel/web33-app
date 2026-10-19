import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

const THEME_KEY = 'web33-theme';

function configureBrowser(): void {
  TestBed.configureTestingModule({
    providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
  });
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('берёт сохранённую тему из localStorage', () => {
    localStorage.setItem(THEME_KEY, 'light');
    configureBrowser();
    const service = TestBed.inject(ThemeService);
    const doc = TestBed.inject(DOCUMENT);
    expect(service.theme()).toBe('light');
    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('по умолчанию открывает тёмную тему', () => {
    configureBrowser();
    const service = TestBed.inject(ThemeService);
    const doc = TestBed.inject(DOCUMENT);
    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);
    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('игнорирует невалидное значение в localStorage', () => {
    localStorage.setItem(THEME_KEY, 'blue');
    configureBrowser();
    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
  });

  it('не падает при ошибке чтения localStorage (приватный режим)', () => {
    const originalGet = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error('blocked');
    };
    configureBrowser();
    let service: ThemeService | undefined;
    expect(() => (service = TestBed.inject(ThemeService))).not.toThrow();
    expect(service?.theme()).toBe('dark');
    localStorage.getItem = originalGet;
  });

  it('не падает при ошибке записи в localStorage (приватный режим)', () => {
    const originalSet = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('blocked');
    };
    configureBrowser();
    const service = TestBed.inject(ThemeService);
    expect(() => service.toggle()).not.toThrow();
    expect(service.theme()).toBe('light');
    localStorage.setItem = originalSet;
  });

  it('toggle сохраняет выбранную тему под ожидаемым ключом', () => {
    configureBrowser();
    const service = TestBed.inject(ThemeService);
    service.toggle();
    expect(service.theme()).toBe('light');
    expect(localStorage.getItem(THEME_KEY)).toBe('light');
  });

  it('применяет data-theme и theme-color', () => {
    configureBrowser();
    const doc = TestBed.inject(DOCUMENT);
    const meta = doc.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    doc.head.appendChild(meta);
    const service = TestBed.inject(ThemeService);

    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(meta.getAttribute('content')).toBe('#0a0f1c');

    service.toggle();
    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
    expect(meta.getAttribute('content')).toBe('#ffffff');

    meta.remove();
  });
});
