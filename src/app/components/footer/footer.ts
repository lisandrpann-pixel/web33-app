import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACTS, FOOTER_ABOUT, SITE_NAV } from '../../data/site.data';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  imports: [RouterLink],
})
export class Footer {
  readonly links = SITE_NAV;
  readonly contacts = CONTACTS;
  readonly about = input(FOOTER_ABOUT);
  readonly year = new Date().getFullYear();
}
