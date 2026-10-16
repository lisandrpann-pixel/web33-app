import { Component, input } from '@angular/core';

export interface StackChip {
  abbr: string;
  name: string;
  bg: string;
  color?: string;
}

export interface StackGroup {
  title: string;
  items: StackChip[];
}

@Component({
  selector: 'app-stack',
  templateUrl: './stack.html',
  styles: [':host { display: contents; }'],
})
export class Stack {
  readonly groups = input.required<StackGroup[]>();
}
