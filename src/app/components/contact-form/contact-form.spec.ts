import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { ContactForm } from './contact-form';
import { ContactFormConfig } from './contact-form.model';

const CONFIG: ContactFormConfig = {
  idPrefix: 'f',
  namePlaceholder: 'Иван',
  taskLabel: 'Задача',
  taskOptions: ['Разработка сайта'],
  messageLabel: 'Сообщение',
  messagePlaceholder: 'Опишите задачу',
  submitLabel: 'Отправить заявку',
};

function fillValidForm(component: ContactForm): void {
  component.form.patchValue({ name: 'Иван', contact: 'ivan@example.com', consent: true });
}

describe('ContactForm', () => {
  let fixture: ComponentFixture<ContactForm>;
  let component: ContactForm;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
      .overrideComponent(ContactForm, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    fixture.componentRef.setInput('config', CONFIG);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('required-валидация полей name, contact, consent', () => {
    expect(component.form.valid).toBe(false);
    component.submit();
    fixture.detectChanges();
    expect(component.form.controls.name.invalid).toBe(true);
    expect(component.form.controls.contact.invalid).toBe(true);
    expect(component.form.controls.consent.invalid).toBe(true);
  });

  it('task предзаполнен первой опцией из конфига', () => {
    expect(component.form.controls.task.value).toBe('Разработка сайта');
  });

  it('при первой ошибке фокус ставится на первое невалидное поле', () => {
    const nameInput = fixture.nativeElement.querySelector('#f-name') as HTMLInputElement;
    const spy = vi.spyOn(nameInput, 'focus');
    component.submit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('sending блокирует кнопку и меняет текст', () => {
    fillValidForm(component);
    component.submit();
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.textContent).toContain('Отправляю');
    http.expectOne('/api/send.php').flush({ ok: true });
  });

  it('успешный POST: success, форма сбрасывается', () => {
    fillValidForm(component);
    component.submit();
    const req = http.expectOne('/api/send.php');
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
    fixture.detectChanges();
    expect(component.state()).toBe('success');
    expect(component.form.controls.name.value).toBe('');
    expect(component.form.controls.contact.value).toBe('');
    expect(component.form.controls.consent.value).toBe(false);
  });

  it('при ошибке сервера показывает error и не переводит в success', () => {
    fillValidForm(component);
    component.submit();
    const req = http.expectOne('/api/send.php');
    req.flush({ error: 'fail' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(component.state()).toBe('error');
  });

  it('ответ 200 с ok:false считается ошибкой', () => {
    fillValidForm(component);
    component.submit();
    http.expectOne('/api/send.php').flush({ ok: false });
    fixture.detectChanges();
    expect(component.state()).toBe('error');
  });

  it('при редактировании после успеха success сбрасывается', () => {
    fillValidForm(component);
    component.submit();
    http.expectOne('/api/send.php').flush({ ok: true });
    fixture.detectChanges();
    expect(component.state()).toBe('success');
    component.form.controls.name.setValue('Пётр');
    fixture.detectChanges();
    expect(component.state()).toBe('idle');
  });

  it('aria-invalid/aria-describedby корректны при ошибке', () => {
    component.submit();
    fixture.detectChanges();
    const nameInput = fixture.nativeElement.querySelector('#f-name') as HTMLInputElement;
    expect(nameInput.getAttribute('aria-invalid')).toBe('true');
    expect(nameInput.getAttribute('aria-describedby')).toContain('f-name-error');
    const agree = fixture.nativeElement.querySelector('#f-agree') as HTMLInputElement;
    expect(agree.getAttribute('aria-invalid')).toBe('true');
    expect(agree.getAttribute('aria-describedby')).toContain('f-agree-error');
  });

  it('autocomplete проставлены', () => {
    const nameInput = fixture.nativeElement.querySelector('#f-name') as HTMLInputElement;
    const contactInput = fixture.nativeElement.querySelector('#f-contact') as HTMLInputElement;
    expect(nameInput.getAttribute('autocomplete')).toBe('name');
    expect(contactInput.getAttribute('autocomplete')).toBe('email');
  });
});
