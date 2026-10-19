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
    expect(component.menuOpen()).toBeTruthy();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Закрыть меню');
    btn.click();
    fixture.detectChanges();
    expect(component.menuOpen()).toBeFalsy();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Открыть меню');
  });

  it('закрытое меню не держит ссылки в фокусируемом таб-порядке', () => {
    const links = fixture.nativeElement.querySelectorAll('.mobile-nav__link');
    links.forEach((el: HTMLElement) => {
      const tabIndex = el.getAttribute('tabindex');
      expect(tabIndex === '-1' || tabIndex === null || tabIndex === undefined).toBeTruthy();
    });
  });

  it('открытое меню делает ссылки доступными', () => {
    const btn = fixture.nativeElement.querySelector('.burger') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('.mobile-nav__link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((el: HTMLElement) => {
      expect(el.getAttribute('tabindex')).toBeNull();
    });
  });

  it('клик по ссылке закрывает меню', () => {
    const btn = fixture.nativeElement.querySelector('.burger') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    expect(component.menuOpen()).toBeTruthy();
    const link = fixture.nativeElement.querySelector('.mobile-nav__link') as HTMLAnchorElement;
    link.click();
    fixture.detectChanges();
    expect(component.menuOpen()).toBeFalsy();
  });
});
