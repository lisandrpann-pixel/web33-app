import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-head',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-head.html',
  styleUrl: './section-head.scss',
})
export class SectionHead {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly centered = input(false, { transform: booleanAttribute });
}
