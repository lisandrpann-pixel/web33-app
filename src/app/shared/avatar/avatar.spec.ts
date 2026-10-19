import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { Avatar } from './avatar';

describe('Avatar', () => {
  let fixture: ComponentFixture<Avatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
    })
      .overrideComponent(Avatar, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Avatar);
  });

  it('рендерит <img> если есть imgSrc (декоративный, alt пустой)', () => {
    fixture.componentRef.setInput('name', 'Иван');
    fixture.componentRef.setInput('imgSrc', '/img/test.jpg');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('alt')).toBe('');
    expect(img?.getAttribute('role')).toBe('presentation');
    expect(img?.getAttribute('aria-hidden')).toBe('true');
  });

  it('фолбэк на первую букву имени (большая)', () => {
    fixture.componentRef.setInput('name', 'алексей');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent?.trim()).toBe('А');
  });

  it('пустой name → пустая заглавная заглушка', () => {
    fixture.componentRef.setInput('name', '');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent?.trim()).toBe('');
  });

  it('аватар скрыт от скринридеров (aria-hidden)', () => {
    fixture.componentRef.setInput('name', 'Мария');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-hidden')).toBe('true');
  });
});
