import { Component, input } from '@angular/core';
import { StackGroup } from './stack.model';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.html',
  styles: [':host { display: contents; }'],
})
export class Stack {
  readonly groups = input.required<StackGroup[]>();
}
