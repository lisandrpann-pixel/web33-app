import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CONTACTS } from '../../data/site.data';
import { ContactForm } from '../contact-form/contact-form';
import { Icon } from '../icon/icon';
import { ContactCallToActionData } from './contact-call-to-action.model';

@Component({
  selector: 'app-contact-call-to-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-call-to-action.html',
  styleUrl: './contact-call-to-action.scss',
  imports: [Icon, ContactForm],
})
export class ContactCallToAction {
  readonly data = input.required<ContactCallToActionData>();
  readonly reply = input<string>();
  readonly soft = input(false, { transform: booleanAttribute });

  protected readonly contacts = CONTACTS;
  protected readonly defaultReply = CONTACTS.reply;
}
