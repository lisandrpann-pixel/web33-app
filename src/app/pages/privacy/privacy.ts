import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';
import { Breadcrumb } from '../../shared/breadcrumbs/breadcrumbs.model';

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './privacy.html',
  styles: [':host { display: contents; }'],
  imports: [Breadcrumbs],
})
export class Privacy {
  protected readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Главная', route: '/' },
    { label: 'Политика конфиденциальности' },
  ];
}
