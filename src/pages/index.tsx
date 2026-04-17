import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

type WorkflowStep = {
  step: string;
  title: string;
  description: string;
  links: Array<{
    href: string;
    label: string;
  }>;
};

type QuickEntry = {
  href: string;
  label: string;
};

const readinessSignals = [
  {value: '13', label: 'ключевых разделов'},
  {value: '3', label: 'основных сценария работы'},
  {value: '2026', label: 'актуальная версия документации'},
];

const workflowSteps: WorkflowStep[] = [
  {
    step: '01',
    title: 'Вход и доступы',
    description:
      'Проверьте авторизацию, роли и базовые административные права перед первым запуском.',
    links: [
      {href: '/generated/08-3-начало-работы', label: 'Начало работы'},
      {href: '/admin/пользователи-и-роли', label: 'Роли и доступы'},
    ],
  },
  {
    step: '02',
    title: 'Устройства и контур',
    description:
      'Добавьте устройства, соберите тестовую группу и убедитесь, что мониторинг видит систему.',
    links: [
      {
        href: '/generated/09-4-разделы-мониторинга-и-устройств',
        label: 'Мониторинг и устройства',
      },
      {
        href: '/operations/регламент-запуска-и-приемки',
        label: 'Регламент запуска',
      },
    ],
  },
  {
    step: '03',
    title: 'Контент и трансляция',
    description:
      'Загрузите материалы, соберите сценарий показа и проверьте зоны перед публикацией.',
    links: [
      {href: '/generated/10-5-работа-с-контентом', label: 'Контент'},
      {href: '/generated/10-6-работа-с-трансляциями', label: 'Трансляции'},
    ],
  },
  {
    step: '04',
    title: 'Расписание и пилот',
    description:
      'Назначьте расписание, прогоните пилотную группу и перед массовым запуском сверяйтесь с чек-листом приемки.',
    links: [
      {href: '/generated/11-7-расписания', label: 'Расписания'},
      {href: '/checklist/', label: 'Чек-лист перед запуском'},
    ],
  },
  {
    step: '05',
    title: 'Контроль после старта',
    description:
      'Сверяйте историю действий, типовые ошибки и операционные регламенты после запуска.',
    links: [
      {href: '/admin/история-и-аудит-действий', label: 'История и аудит'},
      {href: '/generated/16-12-типовые-ошибки-и-решения', label: 'Типовые ошибки'},
    ],
  },
];

const frequentEntries: QuickEntry[] = [
  {href: '/generated/11-7-расписания', label: 'Расписания'},
  {href: '/generated/10-6-работа-с-трансляциями', label: 'Трансляции'},
  {href: '/generated/09-4-разделы-мониторинга-и-устройств', label: 'Мониторинг'},
  {href: '/admin/пользователи-и-роли', label: 'Роли и права'},
  {href: '/admin/история-и-аудит-действий', label: 'Аудит'},
  {href: '/generated/16-12-типовые-ошибки-и-решения', label: 'Типовые ошибки'},
];

const deploymentModes = [
  {
    title: 'Облачный SmartPlayer',
    description:
      'Подходит для быстрого старта и распределенных команд: доступы, роли, контент и стабильная публикация на устройства.',
  },
  {
    title: 'Локальный сервер',
    description:
      'Сценарий для заказчиков с собственным контуром: лицензирование, дистрибутив, подключение устройств и работа в локальной инфраструктуре.',
  },
  {
    title: 'Эксплуатация и поддержка',
    description:
      'Маршрут для ежедневного сопровождения: мониторинг, отчеты, расписания, обслуживание устройств и разбор типовых ошибок.',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>SmartPlayer Docs 2026</span>
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link className={styles.primaryButton} to="/generated/smartplayer-руководство">
                Открыть полное руководство
              </Link>
              <Link className={styles.secondaryButton} to="/quickstart/">
                Quick Start со скриншотами
              </Link>
            </div>
            <p className={styles.formatNote}>
              Нужен короткий reference-раздел внутри полного руководства? Откройте{' '}
              <Link to="/generated/быстрый-старт">краткую версию быстрого старта</Link>. Для
              пошагового сценария со скриншотами используйте <Link to="/quickstart/">standalone Quick Start</Link>.
            </p>
            <div className={styles.signalGrid}>
              {readinessSignals.map((signal) => (
                <div key={signal.label} className={styles.signalCard}>
                  <strong>{signal.value}</strong>
                  <span>{signal.label}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className={styles.heroPanel}>
            <span className={styles.panelLabel}>Быстрые точки входа</span>
            <Heading as="h2">Что можно найти в документации SmartPlayer</Heading>
            <ul className={styles.panelList}>
              <li>Пошаговый запуск платформы и чек-лист приемки перед стартом.</li>
              <li>Роли, доступы, аудит действий и регламенты для администраторов.</li>
              <li>Контент, трансляции, мониторинг устройств и типовые ошибки эксплуатации.</li>
            </ul>
            <div className={styles.panelActions}>
              <Link className={styles.ghostLink} to="/quickstart/">
                Quick Start
              </Link>
              <Link className={styles.ghostLink} to="/interactive-tour/">
                Интерактивный тур
              </Link>
              <Link className={styles.ghostLink} to="/checklist/">
                Чек-лист запуска
              </Link>
            </div>
            <div className={styles.searchCluster}>
              <p className={styles.searchCaption}>
                Часто ищут по задачам: роли, расписания, эфир, аудит и диагностика.
              </p>
              <div className={styles.searchChips}>
                {frequentEntries.map((entry) => (
                  <Link key={entry.href} className={styles.searchChip} to={entry.href}>
                    {entry.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
}

function WorkflowSection() {
  return (
    <section className={styles.workflowSection}>
      <div className="container">
        <div className={styles.workflowLead}>
          <span className={styles.sectionKicker}>Последовательность действий</span>
          <Heading as="h2">Запуск удобнее вести по шагам, а не по разрозненным разделам</Heading>
          <p>
            Если команда внедряет SmartPlayer с нуля, удобнее проходить документацию по
            рабочей цепочке: от доступа и устройств до пилота, расписания и контроля
            после запуска.
          </p>
        </div>

        <div className={styles.workflowGrid}>
          {workflowSteps.map((item) => (
            <article key={item.step} className={styles.workflowCard}>
              <span className={styles.workflowStep}>Шаг {item.step}</span>
              <Heading as="h3" className={styles.workflowTitle}>
                {item.title}
              </Heading>
              <p className={styles.workflowDescription}>{item.description}</p>
              <div className={styles.workflowLinks}>
                {item.links.map((link) => (
                  <Link key={link.href} className={styles.workflowLink} to={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className={styles.workflowHint}>
          На мобильных экранах карточки можно листать по горизонтали, как маршрут запуска.
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Документация SmartPlayer: запуск, контент, трансляции, эксплуатация и сопровождение платформы.">
      <div className={styles.homeShell}>
        <HomepageHeader />
        <main className={styles.homeMain}>
          <WorkflowSection />
          <HomepageFeatures />
          <section className={styles.modeSection}>
            <div className="container">
              <div className={styles.sectionLead}>
                <span className={styles.sectionKicker}>Рабочие сценарии</span>
                <Heading as="h2">Находите нужную инструкцию без долгого поиска по разделам</Heading>
                <p>
                  Документация собрана так, чтобы команда могла заходить либо с общего
                  руководства, либо сразу с конкретной задачи: запуск, работа с
                  контентом, трансляции, мониторинг или администрирование.
                </p>
              </div>

              <div className={styles.modeGrid}>
                {deploymentModes.map((mode) => (
                  <article key={mode.title} className={styles.modeCard}>
                    <Heading as="h3">{mode.title}</Heading>
                    <p>{mode.description}</p>
                  </article>
                ))}
              </div>

              <div className={styles.supportStrip}>
                <div>
                  <span className={styles.sectionKicker}>Частые задачи</span>
                  <Heading as="h3">
                    Нужна конкретная инструкция? Начните с раздела по вашей задаче
                  </Heading>
                </div>
                <div className={styles.supportLinks}>
                  <Link className={styles.inlineLink} to="/generated/09-4-разделы-мониторинга-и-устройств">
                    Мониторинг и устройства
                  </Link>
                  <Link className={styles.inlineLink} to="/generated/10-6-работа-с-трансляциями">
                    Трансляции
                  </Link>
                  <Link
                    className={styles.inlineLink}
                    href="https://smartplayer.atlassian.net/servicedesk/customer/portals">
                    Техподдержка
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
