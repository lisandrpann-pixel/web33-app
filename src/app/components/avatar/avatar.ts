import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  /* Аватар чисто декоративный: скрыт от скринридеров (host + <img role="presentation">),
     а файлы лежат в /img/avatars/ и закрыты от индексации (robots.txt + X-Robots-Tag). */
  host: {
    class: 'avatar',
    '[class.avatar--lg]': "size() === 'lg'",
    '[attr.aria-hidden]': 'true',
  },
})
export class Avatar {
  readonly name = input.required<string>();
  readonly imgSrc = input<string>();
  readonly size = input<'md' | 'lg'>('md');

  protected readonly initial = computed(() => this.name().trim().charAt(0).toUpperCase());
}
