import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Breadcrumbs } from '../../components/breadcrumbs/breadcrumbs';
import { Breadcrumb } from '../../components/breadcrumbs/breadcrumbs.model';
import { HeroCard } from '../../components/hero-card/hero-card';
import { HeroCardData } from '../../components/hero-card/hero-card.model';
import { Blockquote } from '../../components/blockquote/blockquote';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink, Breadcrumbs, HeroCard, Blockquote],
})
export class About {
  protected readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Главная', route: '/' },
    { label: 'Обо мне' },
  ];

  protected readonly profile: HeroCardData = {
    title: 'Обо мне',
    person: { name: 'Александр', role: 'Веб-разработчик, full-stack' },
    rows: [
      { label: 'Опыт в вебе', value: '10+ лет' },
      { label: 'Специализация', value: 'Full-stack' },
      { label: 'Статус', value: 'Самозанятый' },
      { label: 'Договор', value: 'Да' },
    ],
    button: { label: 'Написать мне', route: '/', fragment: 'contact' },
    hint: 'Отвечаю в течение 2 часов',
  };
}
