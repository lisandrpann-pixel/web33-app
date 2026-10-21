import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, take } from 'rxjs';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Footer],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);

  constructor() {
    /* Признак готовности клиентского приложения (используется e2e-тестами).
       Ставим его после гидратации и завершения первичной навигации: страницы
       грузятся лениво через loadComponent(), поэтому одного рендера мало —
       до активации маршрута обработчики формы ещё не навешены и клик
       Playwright может уйти «в пустоту». */
    afterNextRender(() => {
      if (this.router.navigated) {
        this.markReady();
        return;
      }
      this.router.events
        .pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd),
          take(1),
        )
        .subscribe(() => this.markReady());
    });
  }

  private markReady(): void {
    this.doc.documentElement.setAttribute('data-app-hydrated', 'true');
  }
}
