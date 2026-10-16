import { ContactCtaData } from '../shared/contact-cta/contact-cta';
import { FaqItem } from '../shared/faq/faq';
import { FeatureItem } from '../shared/feature/feature';
import { HeroData } from '../shared/hero/hero';
import { InfoCardData } from '../shared/info-card/info-card';
import { ServiceCta, ServicePkg } from '../shared/service-card/service-card';

export const TRAINING_HERO: HeroData = {
  eyebrow: 'Обучение · дети и взрослые',
  titleParts: [
    { text: 'Учу программировать ' },
    { text: 'через практику', accent: true },
    { text: ', а не через скучную теорию' },
  ],
  lead:
    'Индивидуальные и групповые занятия по веб-программированию и Game Dev. ' +
    'На каждом уроке пишем код по реальным задачам, а каждый модуль заканчивается проектом, который можно показать.',
  actions: [
    {
      label: 'Записаться на занятие',
      route: '/obuchenie',
      fragment: 'contact',
      variant: 'primary',
    },
    { label: 'Программы и цены', route: '/obuchenie', fragment: 'programs', variant: 'ghost' },
  ],
  trust: ['10+ лет в разработке', 'Дети от 8 лет и взрослые', 'Пробное занятие'],
  card: {
    title: 'Стоимость занятий',
    note: 'Индивидуально и в мини-группах.',
    rows: [
      { label: 'Индивидуально', value: 'от 1 500 ₽/ч', badge: true },
      { label: 'Мини-группа (2–4 чел.)', value: 'от 800 ₽/ч', badge: true },
      { label: 'Мастер-класс', value: 'по запросу', badge: true },
    ],
    button: { label: 'Записаться', route: '/obuchenie', fragment: 'contact' },
    hint: 'Онлайн или очно · подберём удобное время',
  },
};

export const TRAINING_FOR_WHOM: InfoCardData[] = [
  {
    icon: 'graduation',
    title: 'Дети 8–14 лет',
    text: 'Scratch, GameMaker, Roblox и основы веба. Игровой формат, первые проекты уже через месяц.',
  },
  {
    icon: 'code',
    title: 'Подростки и студенты',
    text: 'JavaScript, HTML/CSS, React, Git. Готовим портфолио и проекты для GitHub, помогаем с первым опытом.',
  },
  {
    icon: 'bulb',
    title: 'Взрослые с нуля',
    text: 'Смена профессии, повышение квалификации или запуск своего проекта. Программа под ваши цели и темп.',
  },
];

export const PROGRAM_CTA: ServiceCta = {
  label: 'Хочу учиться',
  route: '/obuchenie',
  fragment: 'contact',
};

export const TRAINING_PROGRAMS: ServicePkg[] = [
  {
    title: 'Основы веб-разработки',
    price: 'от 1 500 ₽/ч',
    meta: 'HTML, CSS, JavaScript, Git',
    items: [
      'Устройство сайтов и интернета',
      'Вёрстка адаптивных страниц',
      'JavaScript и первые скрипты',
      'Проект: личная страница-визитка',
    ],
  },
  {
    title: 'Frontend и React',
    price: 'от 1 500 ₽/ч',
    meta: 'React, TypeScript, API',
    featured: true,
    tag: 'Для будущих профи',
    items: [
      'Компоненты, состояние, роутинг',
      'Работа с API и формами',
      'Сборка и деплой проекта',
      'Проект: приложение для портфолио',
    ],
  },
  {
    title: 'Game Dev',
    price: 'от 1 500 ₽/ч',
    meta: 'Scratch, GameMaker, Unity, Roblox',
    items: [
      'Логика игр и уровни',
      'Спрайты, анимация, звук',
      'Публикация и показ игры',
      'Проект: собственная игра',
    ],
  },
];

export const TRAINING_PRINCIPLES: FeatureItem[] = [
  {
    icon: 'play',
    title: 'Больше практики',
    text: 'По ходу дела пишем код по реальным задачам — теория появляется там, где она нужна.',
  },
  {
    icon: 'window',
    title: 'Проект в каждом модуле',
    text: 'Каждый блок заканчивается мини-проектом, который можно выложить на GitHub или показать.',
  },
  {
    icon: 'bulb',
    title: 'Учим думать как разработчик',
    text: 'Не даю готовые решения, а учу искать ошибки, читать документацию и выбирать инструменты.',
  },
  {
    icon: 'chat',
    title: 'Понятная обратная связь',
    text: 'Разбираем решения, подсказываю, что улучшить, и отмечаю прогресс на каждом шаге.',
  },
];

export const TRAINING_FAQ: FaqItem[] = [
  {
    q: 'С какого возраста можно заниматься?',
    a: 'С 8 лет — в игровом формате (Scratch, Roblox, GameMaker). Для подростков и взрослых программа сложнее: вёрстка, JavaScript, React и работа с API.',
  },
  {
    q: 'Нужен ли свой компьютер?',
    a: 'Да, для занятий нужен компьютер с интернетом. Помогу настроить рабочее окружение на первом занятии.',
  },
  {
    q: 'Сколько длится одно занятие?',
    a: 'Обычно 60 минут. Для младших учеников возможны занятия по 45 минут, для взрослых — по 90 минут.',
  },
  {
    q: 'Можно попробовать перед покупкой курса?',
    a: 'Да, есть пробное занятие: познакомимся, определим уровень и цель, покажу формат работы.',
  },
  {
    q: 'Онлайн или очно?',
    a: 'Занятия проходят онлайн (видеозвонок с демонстрацией экрана). Очный формат возможен по договорённости.',
  },
];

export const TRAINING_CONTACT: ContactCtaData = {
  eyebrow: 'Запись',
  title: 'Запишитесь на занятие',
  lead: 'Оставьте заявку — подберём программу, формат и удобное время. Пробное занятие поможет определиться.',
  form: {
    idPrefix: 'o',
    namePlaceholder: 'Имя',
    taskLabel: 'Направление',
    taskOptions: [
      'Основы веб-разработки',
      'Frontend и React',
      'Game Dev',
      'Индивидуальный маршрут',
      'Не определились — подскажите',
    ],
    messageLabel: 'Кто будет учиться',
    messagePlaceholder: 'Возраст, уровень, цель',
    submitLabel: 'Записаться на занятие',
  },
};
