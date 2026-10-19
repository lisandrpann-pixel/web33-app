import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { NotFound } from './not-found';

describe('NotFound', () => {
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
    })
      .overrideComponent(NotFound, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
    fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
  });

  it('рендерит заголовок и описание', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('Страница не найдена');
  });

  it('есть ссылка на главную', () => {
    const link = fixture.nativeElement.querySelector('a[href="/"]');
    expect(link).not.toBeNull();
  });
});
