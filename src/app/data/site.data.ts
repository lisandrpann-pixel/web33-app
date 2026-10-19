import { NavItem } from './site.model';

/** Канонический домен сайта — для canonical/og-тегов и sitemap. */
export const SITE_URL = 'https://web33.ru';

export const SITE_NAV: NavItem[] = [
  { label: 'Услуги и цены', route: '/', fragment: 'services' },
  { label: 'Кейсы', route: '/cases' },
  { label: 'Технологии', route: '/', fragment: 'stack' },
  { label: 'Обучение', route: '/school' },
  { label: 'Обо мне', route: '/about' },
  // TODO: сделаем позже
  // { label: 'Блог', route: '/blog' },
];

export const TRAINING_NAV: NavItem[] = [
  { label: 'Разработка', route: '/', fragment: 'services' },
  { label: 'Кейсы', route: '/cases' },
  { label: 'Обучение', route: '/school' },
  { label: 'Обо мне', route: '/about' },
  // TODO: сделаем позже
  // { label: 'Блог', route: '/blog' },
];

export const CONTACTS = {
  email: 'web33.dev@yandex.ru',
  telegramHandle: '@aleksandrp_to',
  telegramUrl: 'https://t.me/aleksandrp_to',
  reply: 'Отвечаю в течение 2 часов · Пн–Сб, 10:00–20:00',
  replyShort: 'Отвечаю в течение 2 часов · Пн–Сб',
} as const;

export const FOOTER_ABOUT =
  'Разработка и поддержка сайтов, магазинов и веб-приложений полного цикла. ' +
  'Frontend и backend в одних руках.';
