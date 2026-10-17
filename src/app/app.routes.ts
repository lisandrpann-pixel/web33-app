import { ResolveFn, Routes } from '@angular/router';
import { BLOG_POSTS } from './data/blog.data';

const blogDescription: ResolveFn<string> = (route) => {
  const post = BLOG_POSTS.find((p) => p.slug === route.paramMap.get('slug'));
  return post?.excerpt ?? 'Блог о веб-разработке — статьи и разборы | web33';
};

export const routes: Routes = [
  {
    path: '',
    title: 'Разработка сайтов, магазинов и веб-приложений под ключ — web33',
    data: {
      description:
        'Разработаю сайт, интернет-магазин или веб-приложение под ключ: от брифа до запуска. Лендинги от 3 дней и от 3 000 ₽, поддержка от 1 000 ₽. 10+ лет в веб-разработке. Отвечаю в течение 2 часов.',
    },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'cases',
    title: 'Кейсы — портфолио веб-разработчика | web33',
    data: {
      description:
        'Кейсы разработки сайтов, интернет-магазинов и веб-приложений: задача, решение и измеримый результат. Магазины на OpenCart, SPA на React, лендинги на WordPress.',
    },
    loadComponent: () => import('./pages/cases/cases').then((m) => m.Cases),
  },
  {
    path: 'about',
    title: 'Обо мне — Александр, веб-разработчик | web33',
    data: {
      description:
        'Александр — веб-разработчик с опытом более 10 лет. Разработка полного цикла: frontend и backend, сайты, магазины, SPA/PWA, мобильные приложения и 2D-игры.',
    },
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'school',
    title: 'Обучение веб-программированию и Game Dev для детей и взрослых | web33',
    data: {
      description:
        'Индивидуальные и групповые занятия по веб-программированию и Game Dev. Больше практики: на каждом уроке пишем код, каждый модуль заканчивается мини-проектом. От 1 500 ₽/час.',
    },
    loadComponent: () => import('./pages/school/school').then((m) => m.School),
  },
  // TODO: реализуем позже
  // {
  //   path: 'blog',
  //   title: 'Блог о веб-разработке — статьи и разборы | web33',
  //   data: {
  //     description:
  //       'Практичные статьи о разработке сайтов, выборе CMS, скорости загрузки, поддержке проектов и обучении программированию. Без воды и маркетингового шума.',
  //   },
  //   loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog),
  // },
  {
    path: 'blog/:slug',
    canMatch: [(_route, segments) => BLOG_POSTS.some((post) => post.slug === segments[1]?.path)],
    title: (route) => {
      const post = BLOG_POSTS.find((p) => p.slug === route.paramMap.get('slug'));
      return post ? `${post.title} | web33` : 'Блог о веб-разработке — статьи и разборы | web33';
    },
    resolve: { description: blogDescription },
    loadComponent: () => import('./pages/blog-post/blog-post').then((m) => m.BlogPostPage),
  },
  {
    path: 'privacy',
    title: 'Политика конфиденциальности | web33',
    data: {
      description:
        'Политика обработки персональных данных сайта web33.ru: какие данные собираются, зачем, как хранятся и как их удалить.',
    },
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: '**',
    title: 'Страница не найдена — web33',
    data: {
      description:
        'Такой страницы нет: возможно, ссылка устарела или в адресе опечатка. Перейдите к услугам, кейсам, обучению или напишите напрямую.',
    },
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
