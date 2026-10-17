import { booleanAttribute, Component, input } from '@angular/core';
import { CONTACTS } from '../../data/site.data';
import { ContactForm } from '../contact-form/contact-form';
import { Icon } from '../icon/icon';
import { ContactCtaData } from './contact-cta.model';

@Component({
  selector: 'app-contact-cta',
  templateUrl: './contact-cta.html',
  styles: [':host { display: contents; }'],
  imports: [Icon, ContactForm],
})
export class ContactCta {
  readonly data = input.required<ContactCtaData>();
  readonly reply = input<string>();
  readonly soft = input(false, { transform: booleanAttribute });

  protected readonly contacts = CONTACTS;
  protected readonly defaultReply = CONTACTS.reply;
}
