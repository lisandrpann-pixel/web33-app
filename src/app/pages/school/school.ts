import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  PROGRAM_CTA,
  TRAINING_CONTACT,
  TRAINING_FAQ,
  TRAINING_FOR_WHOM,
  TRAINING_HERO,
  TRAINING_NOTE,
  TRAINING_PRINCIPLES,
  TRAINING_PROGRAMS,
} from '../../data/training.data';
import { CONTACTS } from '../../data/site.data';
import { ContactCta } from '../../shared/contact-cta/contact-cta';
import { Faq } from '../../shared/faq/faq';
import { Feature } from '../../shared/feature/feature';
import { Hero } from '../../shared/hero/hero';
import { InfoCard } from '../../shared/info-card/info-card';
import { SectionHead } from '../../shared/section-head/section-head';
import { ServiceCard } from '../../shared/service-card/service-card';

@Component({
  selector: 'app-school',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './school.html',
  styleUrl: './school.scss',
  imports: [Hero, SectionHead, InfoCard, ServiceCard, Feature, Faq, ContactCta],
})
export class School {
  protected readonly hero = TRAINING_HERO;
  protected readonly forWhom = TRAINING_FOR_WHOM;
  protected readonly note = TRAINING_NOTE;
  protected readonly programs = TRAINING_PROGRAMS;
  protected readonly programCta = PROGRAM_CTA;
  protected readonly principles = TRAINING_PRINCIPLES;
  protected readonly faq = TRAINING_FAQ;
  protected readonly contact = TRAINING_CONTACT;
  protected readonly shortReply = CONTACTS.replyShort;
}
