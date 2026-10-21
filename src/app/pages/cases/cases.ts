import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CASES, CASES_OUTRO, CASES_PAGE } from '../../data/cases.data';
import { Breadcrumb } from '../../components/breadcrumbs/breadcrumbs.model';
import { CaseCard } from '../../components/case-card/case-card';
import { Outro } from '../../components/outro/outro';
import { PageHead } from '../../components/page-head/page-head';

@Component({
  selector: 'app-cases',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cases.html',
  styleUrl: './cases.scss',
  imports: [PageHead, CaseCard, Outro],
})
export class Cases {
  protected readonly page = CASES_PAGE;
  protected readonly cases = CASES;
  protected readonly outro = CASES_OUTRO;
  protected readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Главная', route: '/' },
    { label: 'Кейсы' },
  ];
}
