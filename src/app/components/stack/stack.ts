import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StackGroup } from './stack.model';

@Component({
  selector: 'app-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stack.html',
  styleUrl: './stack.scss',
})
export class Stack {
  readonly groups = input.required<StackGroup[]>();
}
