import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ContactFormConfig,
  ContactFormPayload,
  ContactFormResponse,
  ContactFormState,
} from './contact-form.model';

/** PHP-обработчик из public/api/send.php (см. файл — отправка через mail()). */
const ENDPOINT = '/api/send.php';

@Component({
  selector: 'app-contact-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  imports: [ReactiveFormsModule, RouterLink],
})
export class ContactForm {
  private readonly doc = inject(DOCUMENT);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly config = input.required<ContactFormConfig>();

  readonly form = this.fb.group({
    name: ['', Validators.required],
    contact: ['', Validators.required],
    task: [''],
    message: [''],
    consent: [false, Validators.requiredTrue],
    website: [''],
  });

  readonly state = signal<ContactFormState>('idle');

  protected nameInvalid(): boolean {
    const control = this.form.controls.name;
    return control.touched && control.invalid;
  }

  protected contactInvalid(): boolean {
    const control = this.form.controls.contact;
    return control.touched && control.invalid;
  }

  protected agreeInvalid(): boolean {
    const control = this.form.controls.consent;
    return control.touched && control.invalid;
  }

  constructor() {
    effect(() => {
      const [firstOption] = this.config().taskOptions;
      if (firstOption && !this.form.controls.task.value) {
        this.form.controls.task.setValue(firstOption, { emitEvent: false });
      }
    });

    /* Любое редактирование после отправки скрывает прошлый результат. */
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.state() !== 'sending') {
        this.state.set('idle');
      }
    });
  }

  protected id(field: string): string {
    return `${this.config().idPrefix}-${field}`;
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.state() === 'sending') {
      return;
    }

    if (this.form.invalid) {
      this.state.set('idle');
      this.focusFirstError();
      return;
    }

    const payload: ContactFormPayload = {
      ...this.form.getRawValue(),
      page: this.doc.defaultView?.location?.pathname ?? '/',
    };

    this.state.set('sending');
    this.http
      .post<ContactFormResponse>(ENDPOINT, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (!res.ok) {
            this.state.set('error');
            return;
          }
          this.state.set('success');
          this.form.reset(
            {
              name: '',
              contact: '',
              task: this.config().taskOptions[0] ?? '',
              message: '',
              consent: false,
              website: '',
            },
            { emitEvent: false },
          );
        },
        error: () => this.state.set('error'),
      });
  }

  private focusFirstError(): void {
    const { name, contact } = this.form.controls;
    const target = name.invalid ? 'name' : contact.invalid ? 'contact' : null;
    if (target) {
      this.doc.getElementById(this.id(target))?.focus();
    }
  }
}
