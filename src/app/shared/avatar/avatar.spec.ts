import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { Avatar } from './avatar';

describe('Avatar', () => {
  let fixture: ComponentFixture<Avatar>;
  let component: Avatar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
    })
      .overrideComponent(Avatar, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Avatar);
    component = fixture.componentInstance;
  });

  it('рендерит <img> если есть imgSrc', () => {
    fixture.componentRef.setInput('name', 'Иван');
    fixture.componentRef.setInput('imgSrc', '/img/test.jpg');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).not.toBeNull();
  });

  it('фолбэк на первую букву имени (большая)', () => {
    fixture.componentRef.setInput('name', 'алексей');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.avatar__fallback');
    expect(span?.textContent).toBe('А');
  });

  it('пустой name → пустая заглавная заглушка', () => {
    fixture.componentRef.setInput('name', '');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.avatar__fallback');
    expect(span?.textContent).toBe('');
  });

  it('применяет alt из name', () => {
    fixture.componentRef.setInput('name', 'Мария');
    fixture.componentRef.setInput('imgSrc', '/img/m.jpg');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('Мария');
  });
});
