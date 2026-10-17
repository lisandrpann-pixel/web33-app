import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseCardData } from './case-card.model';

@Component({
  selector: 'app-case-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './case-card.html',
  styleUrl: './case-card.scss',
  imports: [RouterLink, NgTemplateOutlet],
})
export class CaseCard {
  readonly data = input.required<CaseCardData>();
}
