import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Breadcrumb } from './breadcrumbs.model';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink],
})
export class Breadcrumbs {
  readonly items = input.required<Breadcrumb[]>();
}
