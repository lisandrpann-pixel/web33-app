import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-head',
  templateUrl: './section-head.html',
  styles: [':host { display: contents; }'],
})
export class SectionHead {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly centered = input(false, { transform: booleanAttribute });
}
