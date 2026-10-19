import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let component: Header;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    })
      .overrideComponent(Header, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('бургер переключает menuOpen, aria-expanded, aria-label', () => {
    const btn = fixture.nativeElement.querySelector('.burger') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    expect(component.menuOpen()).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Закрыть меню');
    btn.click();
    fixture.detectChanges();
    expect(component.menuOpen()).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Открыть меню');
  });

  /* В юнит-тестах (jsdom) проверяем состояние классов; реальная видимость
     и tab-порядок закрытого меню (CSS visibility) проверяются e2e в e2e/mobile-menu.spec.ts. */
  it('закрытое меню не имеет класса mobile-nav--open', () => {
    const nav = fixture.nativeElement.querySelector('.mobile-nav');
    expect(nav.classList.contains('mobile-nav--open')).toBe(false);
  });

  it('открытое меню получает класс mobile-nav--open', () => {
    const btn = fixture.nativeElement.querySelector('.burger') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('.mobile-nav');
    expect(nav.classList.contains('mobile-nav--open')).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.mobile-nav__link').length).toBeGreaterThan(0);
  });

  it('клик по ссылке закрывает меню', () => {
    const btn = fixture.nativeElement.querySelector('.burger') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    expect(component.menuOpen()).toBe(true);
    const link = fixture.nativeElement.querySelector('.mobile-nav__link') as HTMLAnchorElement;
    link.click();
    fixture.detectChanges();
    expect(component.menuOpen()).toBe(false);
  });
});
