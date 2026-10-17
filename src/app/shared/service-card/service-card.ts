import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCta, ServicePkg } from './service-card.model';

export const DEFAULT_SERVICE_CTA: ServiceCta = {
  label: 'Заказать',
  route: '/',
  fragment: 'contact',
};

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.html',
  styleUrl: './service-card.scss',
  imports: [RouterLink],
})
export class ServiceCard {
  readonly pkg = input.required<ServicePkg>();
  readonly cta = input<ServiceCta>(DEFAULT_SERVICE_CTA);
}
