import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Breadcrumb } from './breadcrumbs.model';

@Component({
  selector: 'app-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  imports: [RouterLink],
})
export class Breadcrumbs {
  readonly items = input.required<Breadcrumb[]>();
}
