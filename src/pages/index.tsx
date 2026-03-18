import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

const readinessSignals = [
  {value: '13', label: 'ключевых разделов'},
  {value: '3', label: 'основных сценария работы'},
  {value: '2026', label: 'актуальная версия документации'},
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
                Перейти в быстрый старт
              </Link>
            </div>
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
                Быстрый старт
              </Link>
              <Link className={styles.ghostLink} to="/generated/17-13-чек-лист-запуска">
                Чек-лист запуска
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </header>
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
