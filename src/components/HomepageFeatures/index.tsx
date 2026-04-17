import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type TrackItem = {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  links: Array<{
    href: string;
    label: string;
  }>;
};

const tracks: TrackItem[] = [
  {
    badge: 'Старт',
    title: 'Запуск и подключение',
    description:
      'Быстрый путь для команды, которая поднимает SmartPlayer, выдает доступы и подключает первые устройства.',
    bullets: [
      'пошаговый быстрый старт со скриншотами',
      'краткая версия в полном руководстве',
      'launch gate перед пилотом и rollout',
    ],
    links: [
      {href: '/quickstart/', label: 'Пошаговый быстрый старт'},
      {href: '/generated/быстрый-старт', label: 'Краткая версия в руководстве'},
      {href: '/interactive-tour/', label: 'Интерактивный тур'},
      {href: '/checklist/', label: 'Чек-лист запуска'},
    ],
  },
  {
    badge: 'Операции',
    title: 'Контент и эфир',
    description:
      'Документация для редакторов и операторов: библиотека контента, пошаговые публикации, трансляции и расписания.',
    bullets: ['библиотека контента', 'интерактивные трансляции', 'расписания и отчеты'],
    links: [
      {href: '/generated/10-5-работа-с-контентом', label: 'Работа с контентом'},
      {href: '/generated/10-6-работа-с-трансляциями', label: 'Работа с трансляциями'},
      {href: '/generated/11-7-расписания', label: 'Раздел расписаний'},
    ],
  },
  {
    badge: 'Поддержка',
    title: 'Мониторинг и администрирование',
    description:
      'Контур сопровождения для тех, кто отвечает за эксплуатацию: мониторинг устройств, настройки, рекомендации и разбор ошибок.',
    bullets: ['обзор и устройства', 'администрирование', 'типовые ошибки и решения'],
    links: [
      {href: '/generated/09-4-разделы-мониторинга-и-устройств', label: 'Мониторинг и устройства'},
      {href: '/generated/14-10-администрирование', label: 'Администрирование'},
      {href: '/generated/16-12-типовые-ошибки-и-решения', label: 'Типовые ошибки'},
    ],
  },
];

function TrackCard({badge, title, description, bullets, links}: TrackItem) {
  return (
    <article className={styles.card}>
      <span className={styles.badge}>{badge}</span>
      <div className={styles.cardHeader}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
      <ul className={styles.list}>
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <div className={styles.linkRow}>
        {links.map((link) => (
          <Link key={link.href} className={styles.docLink} to={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </article>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>Рабочие контуры</span>
          <Heading as="h2">Документация собрана по реальным сценариям работы</Heading>
          <p>
            Выбирайте старт, операционную работу с контентом или сопровождение
            платформы и переходите сразу в нужный раздел без лишнего поиска.
          </p>
        </div>
        <div className={styles.cards}>
          {tracks.map((track) => (
            <TrackCard key={track.title} {...track} />
          ))}
        </div>
      </div>
    </section>
  );
}
