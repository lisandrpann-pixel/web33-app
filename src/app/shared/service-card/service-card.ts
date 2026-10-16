import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ServicePkg {
  title: string;
  price: string;
  priceNote?: string;
  meta: string;
  items: string[];
  featured?: boolean;
  tag?: string;
}

export interface ServiceCta {
  label: string;
  route: string;
  fragment?: string;
}

export const DEFAULT_SERVICE_CTA: ServiceCta = {
  label: 'Заказать',
  route: '/',
  fragment: 'contact',
};

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink],
})
export class ServiceCard {
  readonly pkg = input.required<ServicePkg>();
  readonly cta = input<ServiceCta>(DEFAULT_SERVICE_CTA);
}
