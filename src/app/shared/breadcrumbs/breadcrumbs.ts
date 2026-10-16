import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Breadcrumb {
  label: string;
  route?: string;
  fragment?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink],
})
export class Breadcrumbs {
  readonly items = input.required<Breadcrumb[]>();
}
