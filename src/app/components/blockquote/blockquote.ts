import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-blockquote',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blockquote.html',
  styleUrl: './blockquote.scss',
})
export class Blockquote {}
