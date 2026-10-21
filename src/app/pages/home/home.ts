import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  HOME_CASES,
  HOME_CONTACT,
  HOME_FAQ,
  HOME_FEATURES,
  HOME_HERO,
  HOME_SERVICES,
  HOME_STACK,
  HOME_STEPS,
  HOME_TESTIMONIALS,
} from '../../data/home.data';
import { CaseCard } from '../../components/case-card/case-card';
import { ContactCallToAction } from '../../components/contact-call-to-action/contact-call-to-action';
import { Faq } from '../../components/faq/faq';
import { Feature } from '../../components/feature/feature';
import { Hero } from '../../components/hero/hero';
import { Review } from '../../components/review/review';
import { SectionHead } from '../../components/section-head/section-head';
import { ServiceCard } from '../../components/service-card/service-card';
import { Stack } from '../../components/stack/stack';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [
    RouterLink,
    Hero,
    SectionHead,
    ServiceCard,
    CaseCard,
    Stack,
    Feature,
    Review,
    Faq,
    ContactCallToAction,
  ],
})
export class Home {
  protected readonly hero = HOME_HERO;
  protected readonly services = HOME_SERVICES;
  protected readonly steps = HOME_STEPS;
  protected readonly cases = HOME_CASES;
  protected readonly stack = HOME_STACK;
  protected readonly features = HOME_FEATURES;
  protected readonly testimonials = HOME_TESTIMONIALS;
  protected readonly faq = HOME_FAQ;
  protected readonly contact = HOME_CONTACT;
}
