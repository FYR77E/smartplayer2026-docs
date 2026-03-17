import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

const readinessSignals = [
  {value: '13', label: 'основных разделов'},
  {value: '26', label: 'иллюстраций из Word'},
  {value: '2026', label: 'актуальный источник контента'},
];

const deploymentModes = [
  {
    title: 'Облачный SmartPlayer',
    description:
      'Подходит для быстрого старта и распределенных команд. Основной акцент на доступах, ролях, контенте и стабильной публикации на устройства.',
  },
  {
    title: 'Локальный сервер',
    description:
      'Сценарий для заказчиков с собственным контуром. В документации уже выделены лицензирование, дистрибутив и подключение устройств к локальной инфраструктуре.',
  },
  {
    title: 'Эксплуатационный контур',
    description:
      'Мониторинг, отчеты, расписания, обслуживание устройств и типовые ошибки вынесены в отдельный маршрут сопровождения, а не спрятаны в линейный мануал.',
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
            <span className={styles.panelLabel}>Что уже усилено</span>
            <Heading as="h2">Новый контентный контур для SmartPlayer</Heading>
            <ul className={styles.panelList}>
              <li>Word-документ от 12.03.2026 стал основой для импортируемой документации.</li>
              <li>Разделы по контенту, трансляциям и запуску выделены в отдельные маршруты чтения.</li>
              <li>Quickstart приведен в рабочее состояние и опубликован синхронно с продом.</li>
            </ul>
            <div className={styles.panelActions}>
              <Link className={styles.ghostLink} to="/generated/17-13-чек-лист-запуска">
                Чек-лист запуска
              </Link>
              <Link className={styles.ghostLink} to="/generated/16-12-типовые-ошибки-и-решения">
                Типовые ошибки
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
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.modeSection}>
          <div className="container">
            <div className={styles.sectionLead}>
              <span className={styles.sectionKicker}>Современная структура</span>
              <Heading as="h2">Документация теперь говорит языком сценариев, а не просто разделов</Heading>
              <p>
                Мы начали переводить мануал из грубого линейного PDF-формата в
                современный Docusaurus-контур: с нормальной навигацией, отдельными
                посадочными точками и читаемыми маршрутами для разных ролей команды.
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
                <span className={styles.sectionKicker}>Следующий слой</span>
                <Heading as="h3">
                  Дальше усиливаем поисковость, контентные компоненты и
                  операционную автоматизацию
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
    </Layout>
  );
}
