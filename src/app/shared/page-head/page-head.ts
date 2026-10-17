import { Component, input } from '@angular/core';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { Breadcrumb } from '../breadcrumbs/breadcrumbs.model';

@Component({
  selector: 'app-page-head',
  templateUrl: './page-head.html',
  styles: [':host { display: contents; }'],
  imports: [Breadcrumbs],
})
export class PageHead {
  readonly breadcrumbs = input.required<Breadcrumb[]>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>();
}
