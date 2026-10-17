import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCta } from '../service-card/service-card.model';

@Component({
  selector: 'app-outro',
  templateUrl: './outro.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink],
})
export class Outro {
  readonly title = input.required<string>();
  readonly lead = input.required<string>();
  readonly cta = input.required<ServiceCta>();
}
