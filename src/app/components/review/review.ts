import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Avatar } from '../avatar/avatar';
import { Testimonial } from './review.model';

@Component({
  selector: 'app-review',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './review.html',
  styleUrl: './review.scss',
  imports: [Avatar],
})
export class Review {
  readonly review = input.required<Testimonial>();
}
