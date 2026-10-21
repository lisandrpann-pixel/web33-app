import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCallToAction, ServicePkg } from './service-card.model';

export const DEFAULT_SERVICE_CALL_TO_ACTION: ServiceCallToAction = {
  label: 'Заказать',
  route: '/',
  fragment: 'contact',
};

@Component({
  selector: 'app-service-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-card.html',
  styleUrl: './service-card.scss',
  imports: [RouterLink],
})
export class ServiceCard {
  readonly pkg = input.required<ServicePkg>();
  readonly callToAction = input<ServiceCallToAction>(DEFAULT_SERVICE_CALL_TO_ACTION);
}
