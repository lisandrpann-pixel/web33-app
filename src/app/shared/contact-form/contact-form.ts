import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContactFormConfig } from './contact-form.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.html',
  styles: [':host { display: contents; }'],
  imports: [ReactiveFormsModule, RouterLink],
})
export class ContactForm {
  private readonly doc = inject(DOCUMENT);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly config = input.required<ContactFormConfig>();

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    contact: ['', Validators.required],
    task: [''],
    message: [''],
    consent: [false, Validators.requiredTrue],
  });

  protected readonly success = signal(false);

  protected nameInvalid(): boolean {
    const control = this.form.controls.name;
    return control.touched && control.invalid;
  }

  protected contactInvalid(): boolean {
    const control = this.form.controls.contact;
    return control.touched && control.invalid;
  }

  constructor() {
    effect(() => {
      const [firstOption] = this.config().taskOptions;
      if (firstOption && !this.form.controls.task.value) {
        this.form.controls.task.setValue(firstOption);
      }
    });
  }

  protected id(field: string): string {
    return `${this.config().idPrefix}-${field}`;
  }

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.focusFirstError();
      return;
    }

    this.success.set(true);
    this.form.reset({
      name: '',
      contact: '',
      task: this.config().taskOptions[0] ?? '',
      message: '',
      consent: false,
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
