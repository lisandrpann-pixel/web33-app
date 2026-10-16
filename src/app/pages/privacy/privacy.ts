import { Component } from '@angular/core';
import { Breadcrumb, Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-privacy',
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
