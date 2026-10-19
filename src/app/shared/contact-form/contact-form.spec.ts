import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  let fixture: ComponentFixture<ContactForm>;
  let component: ContactForm;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(ContactForm, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('required-валидация полей name, contact, agree', () => {
    component.submit();
    fixture.detectChanges();
    expect(component.errors().name).toBeTruthy();
    expect(component.errors().contact).toBeTruthy();
    expect(component.errors().agree).toBeTruthy();
  });

  it('при первой ошибке фокус ставится на первое невалидное поле', () => {
    const nameInput = fixture.nativeElement.querySelector('#f-name') as HTMLInputElement;
    const spy = spyOn(nameInput, 'focus');
    component.submit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('sending блокирует кнопку и меняет текст', () => {
    component.name.set('Тест');
    component.contact.set('test@example.com');
    component.agree.set(true);
    component.submit();
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(btn.disabled).toBeTruthy();
  });

  it('успешный POST: success=true, форма сбрасывается', () => {
    component.name.set('Иван');
    component.contact.set('ivan@example.com');
    component.agree.set(true);
    component.submit();
    const req = http.expectOne('/api/send.php');
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
    fixture.detectChanges();
    expect(component.status()).toBe('success');
    expect(component.name()).toBe('');
    expect(component.contact()).toBe('');
    expect(component.agree()).toBe(false);
  });

  it('при ошибке показывает error и не переводит в success', () => {
    component.name.set('Иван');
    component.contact.set('ivan@example.com');
    component.agree.set(true);
    component.submit();
    const req = http.expectOne('/api/send.php');
    req.flush({ error: 'fail' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(component.status()).toBe('error');
  });

  it('при редактировании после успеха success сбрасывается', () => {
    component.name.set('Иван');
    component.contact.set('ivan@example.com');
    component.agree.set(true);
    component.submit();
    http.expectOne('/api/send.php').flush({ ok: true });
    fixture.detectChanges();
    expect(component.status()).toBe('success');
    component.name.set('Пётр');
    fixture.detectChanges();
    expect(component.status()).toBe('idle');
  });

  it('aria-invalid/aria-describedby корректны при ошибке', () => {
    component.submit();
    fixture.detectChanges();
    const nameInput = fixture.nativeElement.querySelector('#f-name') as HTMLInputElement;
    expect(nameInput.getAttribute('aria-invalid')).toBe('true');
    expect(nameInput.getAttribute('aria-describedby')).toContain('f-name-error');
  });

  it('autocomplete проставлены', () => {
    const nameInput = fixture.nativeElement.querySelector('#f-name') as HTMLInputElement;
    const contactInput = fixture.nativeElement.querySelector('#f-contact') as HTMLInputElement;
    expect(nameInput.getAttribute('autocomplete')).toBe('name');
    expect(contactInput.getAttribute('autocomplete')).toBe('email');
  });
});
