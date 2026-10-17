import { Component } from '@angular/core';
import { CASES, CASES_OUTRO, CASES_PAGE } from '../../data/cases.data';
import { Breadcrumb } from '../../shared/breadcrumbs/breadcrumbs.model';
import { CaseCard } from '../../shared/case-card/case-card';
import { Outro } from '../../shared/outro/outro';
import { PageHead } from '../../shared/page-head/page-head';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.html',
  styles: [':host { display: contents; }'],
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
