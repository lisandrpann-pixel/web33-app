import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  PROGRAM_CALL_TO_ACTION,
  TRAINING_CONTACT,
  TRAINING_FAQ,
  TRAINING_FOR_WHOM,
  TRAINING_HERO,
  TRAINING_NOTE,
  TRAINING_PRINCIPLES,
  TRAINING_PROGRAMS,
} from '../../data/training.data';
import { CONTACTS } from '../../data/site.data';
import { ContactCallToAction } from '../../components/contact-call-to-action/contact-call-to-action';
import { Faq } from '../../components/faq/faq';
import { Feature } from '../../components/feature/feature';
import { Hero } from '../../components/hero/hero';
import { InfoCard } from '../../components/info-card/info-card';
import { SectionHead } from '../../components/section-head/section-head';
import { ServiceCard } from '../../components/service-card/service-card';
import { Blockquote } from '../../components/blockquote/blockquote';

@Component({
  selector: 'app-school',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './school.html',
  styleUrl: './school.scss',
  imports: [
    Hero,
    SectionHead,
    InfoCard,
    ServiceCard,
    Feature,
    Faq,
    ContactCallToAction,
    Blockquote,
  ],
})
export class School {
  protected readonly hero = TRAINING_HERO;
  protected readonly forWhom = TRAINING_FOR_WHOM;
  protected readonly note = TRAINING_NOTE;
  protected readonly programs = TRAINING_PROGRAMS;
  protected readonly programCallToAction = PROGRAM_CALL_TO_ACTION;
  protected readonly principles = TRAINING_PRINCIPLES;
  protected readonly faq = TRAINING_FAQ;
  protected readonly contact = TRAINING_CONTACT;
  protected readonly shortReply = CONTACTS.replyShort;
}
