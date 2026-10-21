import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCallToAction } from '../service-card/service-card.model';

@Component({
  selector: 'app-outro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './outro.html',
  styleUrl: './outro.scss',
  imports: [RouterLink],
})
export class Outro {
  readonly title = input.required<string>();
  readonly lead = input.required<string>();
  readonly callToAction = input.required<ServiceCallToAction>();
}
