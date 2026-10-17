import { Component } from '@angular/core';
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
import { CaseCard } from '../../shared/case-card/case-card';
import { ContactCta } from '../../shared/contact-cta/contact-cta';
import { Faq } from '../../shared/faq/faq';
import { Feature } from '../../shared/feature/feature';
import { Hero } from '../../shared/hero/hero';
import { Quote } from '../../shared/quote/quote';
import { SectionHead } from '../../shared/section-head/section-head';
import { ServiceCard } from '../../shared/service-card/service-card';
import { Stack } from '../../shared/stack/stack';

@Component({
  selector: 'app-home',
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
    Quote,
    Faq,
    ContactCta,
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
