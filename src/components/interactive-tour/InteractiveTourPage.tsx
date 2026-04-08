import {startTransition, useEffect, useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';
import {buildTourSteps, type TourScreen} from './tourSteps';
import {useDriverTour} from './useDriverTour';

type StageConfig = {
  id: TourScreen;
  label: string;
  heading: string;
  description: string;
  chips: string[];
};

type ScreenTab = {
  id: TourScreen;
  label: string;
  note: string;
};

type DeviceStatus = {
  name: string;
  state: string;
  sync: string;
};

type TimelineSlot = {
  name: string;
  duration: string;
  type: string;
};

type ScheduleSlot = {
  day: string;
  slot: string;
  target: string;
};

type ScreenPanelProps = {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  imageAlt: string;
  children: ReactNode;
  footer: string;
};

type ModalProps = {
  onClose: () => void;
  closeDisabled: boolean;
};

const screens: StageConfig[] = [
  {
    id: 'content',
    label: 'Контент',
    heading: 'Контент и быстрая отправка',
    description:
      'Шаги повторяют Quick Start: проверка медиатеки, загрузка файла и подготовка контента перед созданием трансляции.',
    chips: ['Раздел «Контент»', 'Загрузка файлов', 'Готово к отправке'],
  },
  {
    id: 'device',
    label: 'Устройства',
    heading: 'Добавление устройства и карточка устройства',
    description: 'Проверяем подключение, статус устройства и параметры карточки перед назначением трансляции.',
    chips: ['Раздел «Устройства»', 'Карточка устройства', 'Состояние подключения'],
  },
  {
    id: 'editor',
    label: 'Редактор',
    heading: 'Трансляции и редактирование',
    description: 'Переходим к разделу «Трансляции», проверяем состав контента, таймлайн и параметры текущего показа.',
    chips: ['Раздел «Трансляции»', 'Редактирование', 'Timeline'],
  },
  {
    id: 'schedule',
    label: 'Публикация',
    heading: 'Расписание и назначение на устройства',
    description: 'Назначаем окно показа, выбираем устройства и подтверждаем публикацию согласно сценарию Quick Start.',
    chips: ['Расписание', 'Назначение на устройства', 'Публикация'],
  },
];

const navTabs: ScreenTab[] = [
  {id: 'content', label: 'Контент', note: 'Медиатека'},
  {id: 'device', label: 'Устройства', note: 'Карточка'},
  {id: 'editor', label: 'Редактор', note: 'Трансляции'},
  {id: 'schedule', label: 'Публикация', note: 'Назначение'},
];

const contentQueue = [
  {name: 'Контент: фильтры и превью файлов', count: 'Проверить состав', state: 'Готово'},
  {name: 'Загрузка контента', count: 'Добавить файл', state: 'Выполнено'},
  {name: 'Контент на устройства (быстрая отправка)', count: 'Шаг 1', state: 'Подготовка'},
];

const deviceStatuses: DeviceStatus[] = [
  {name: 'LED Lobby 01', state: 'Подключено', sync: 'карточка обновлена 2 мин назад'},
  {name: 'Kiosk East', state: 'Проверка', sync: 'параметры устройства обновлены'},
  {name: 'Video Wall West', state: 'Готово', sync: 'скриншот устройства актуален'},
];

const timelineSlots: TimelineSlot[] = [
  {name: 'Трансляции: общий вид', duration: 'Шаг 1', type: 'Создать'},
  {name: 'Добавление контента в Timeline', duration: 'Шаг 2', type: 'Контент'},
  {name: 'Редактирование созданных трансляций', duration: 'Шаг 3', type: 'Редактирование'},
  {name: 'Проверка перед публикацией', duration: 'Шаг 4', type: 'Контроль'},
];

const scheduleSlots: ScheduleSlot[] = [
  {day: 'Пн', slot: '08:00-12:00', target: 'LED Lobby 01'},
  {day: 'Ср', slot: '12:00-16:00', target: 'Kiosk East'},
  {day: 'Пт', slot: '16:00-20:00', target: 'Video Wall West'},
];

function scrollToTarget(selector: string, block: ScrollLogicalPosition = 'center') {
  const element = document.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block,
    inline: 'nearest',
  });
}

function ScreenPanel({title, subtitle, badge, image, imageAlt, children, footer}: ScreenPanelProps) {
  return (
    <article className={styles.screenPanel}>
      <header className={styles.screenPanelHeader}>
        <div>
          <span className={styles.surfaceEyebrow}>{badge}</span>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </header>
      <div className={styles.screenPanelCanvas}>
        <img alt={imageAlt} className={styles.panelBackdrop} src={image} />
        <div className={styles.panelOverlay} />
        <div className={styles.panelContent}>{children}</div>
      </div>
      <footer className={styles.screenPanelFooter}>{footer}</footer>
    </article>
  );
}

function ContentStage({image, onCreateGroup}: {image: string; onCreateGroup: () => void}) {
  return (
    <section className={styles.stageSection} data-tour="content-screen">
      <header className={styles.stageHeader}>
        <div>
          <span className={styles.surfaceEyebrow}>Контент</span>
          <h2>Медиатека и подготовка к быстрой отправке</h2>
          <p>
            Сверьте файлы в разделе «Контент», проверьте превью и подготовьте трансляцию для отправки на выбранные
            устройства.
          </p>
        </div>
        <button className={styles.primaryButton} data-tour="create-group" onClick={onCreateGroup} type="button">
          Создать трансляцию
        </button>
      </header>

      <div className={styles.stageGrid}>
        <article className={styles.queueCard}>
          <h3>Контрольный список раздела «Контент»</h3>
          <div className={styles.queueList}>
            {contentQueue.map((item) => (
              <article className={styles.queueItem} key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.count}</span>
                </div>
                <em>{item.state}</em>
              </article>
            ))}
          </div>
        </article>

        <ScreenPanel
          badge="Quick Start: Контент"
          footer="Контент • Подготовка перед назначением на устройства"
          image={image}
          imageAlt="Экран раздела «Контент» SmartPlayer"
          subtitle="Реальный экран медиатеки из Quick Start: фильтры, список файлов и превью."
          title="Контент: медиатека проекта">
          <div className={styles.previewLayout}>
            <article className={styles.featureCard}>
              <strong>Проверка структуры файлов</strong>
              <span>Убедитесь, что нужные материалы доступны перед запуском трансляции.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Загрузка нового контента</strong>
              <span>Добавьте файл и дождитесь статуса успешной загрузки.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Переход к отправке</strong>
              <span>После проверки переходите к созданию и назначению трансляции.</span>
            </article>
          </div>
        </ScreenPanel>
      </div>
    </section>
  );
}

function DeviceStage({image}: {image: string}) {
  return (
    <section className={styles.stageSection} data-tour="device-screen">
      <header className={styles.stageHeader}>
        <div>
          <span className={styles.surfaceEyebrow}>Устройства</span>
          <h2>Карточка устройства и параметры</h2>
          <p>
            Этап из Quick Start «Добавление устройства»: проверяем карточку, параметры устройства и доступность экрана
            перед публикацией.
          </p>
        </div>
      </header>

      <div className={styles.stageGrid}>
        <article className={styles.queueCard}>
          <h3>Статус устройств</h3>
          <div className={styles.queueList}>
            {deviceStatuses.map((item) => (
              <article className={styles.queueItem} key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.sync}</span>
                </div>
                <em>{item.state}</em>
              </article>
            ))}
          </div>
        </article>

        <ScreenPanel
          badge="Quick Start: Добавление устройства"
          footer="Устройства • Карточка устройства и параметры"
          image={image}
          imageAlt="Экран карточки устройства SmartPlayer"
          subtitle="Реальный экран карточки устройства из Quick Start."
          title="Параметры устройства">
          <div className={styles.previewLayout}>
            <article className={styles.featureCard}>
              <strong>Карточка устройства</strong>
              <span>Проверьте идентификатор, статус и параметры подключенного экрана.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Диагностика</strong>
              <span>Убедитесь, что устройство на связи и готово принять трансляцию.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Проверка перед запуском</strong>
              <span>После подтверждения параметров переходите к редактированию трансляции.</span>
            </article>
          </div>
        </ScreenPanel>
      </div>
    </section>
  );
}

function EditorStage({image}: {image: string}) {
  return (
    <section className={styles.stageSection} data-tour="editor-screen">
      <header className={styles.stageHeader}>
        <div>
          <span className={styles.surfaceEyebrow}>Трансляции</span>
          <h2>Редактирование созданных трансляций</h2>
          <p>
            Шаг соответствует разделам Quick Start «Трансляции» и «Редактирование созданных трансляций»: правим состав,
            порядок и параметры показа.
          </p>
        </div>
      </header>

      <div className={styles.stageGrid}>
        <article className={styles.queueCard}>
          <h3>Этапы редактирования</h3>
          <div className={styles.timelineList}>
            {timelineSlots.map((item) => (
              <article className={styles.timelineItem} key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.type}</span>
                <em>{item.duration}</em>
              </article>
            ))}
          </div>
        </article>

        <ScreenPanel
          badge="Quick Start: Редактирование трансляции"
          footer="Трансляции • Изменение параметров и контента"
          image={image}
          imageAlt="Экран редактирования созданных трансляций SmartPlayer"
          subtitle="Реальный экран из раздела «Редактирование созданных трансляций»."
          title="Редактирование созданных трансляций">
          <div className={styles.previewLayout}>
            <article className={styles.featureCard}>
              <strong>Проверка текущей трансляции</strong>
              <span>Уточните параметры и состав контента перед публикацией.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Обновление расписания</strong>
              <span>При необходимости внесите изменения в окно показа.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Подготовка к назначению</strong>
              <span>После правок переходите к шагу «Расписание — назначение на устройства».</span>
            </article>
          </div>
        </ScreenPanel>
      </div>
    </section>
  );
}

function ScheduleStage({image}: {image: string}) {
  return (
    <section className={styles.stageSection} data-tour="schedule-screen">
      <header className={styles.stageHeader}>
        <div>
          <span className={styles.surfaceEyebrow}>Расписание</span>
          <h2>Назначение трансляции на устройства</h2>
          <p>
            Финальный этап Quick Start: задайте расписание показа, выберите целевые устройства и подтвердите публикацию
            трансляции.
          </p>
        </div>
      </header>

      <div className={styles.stageGrid}>
        <article className={styles.queueCard}>
          <h3>Окна показа</h3>
          <div className={styles.scheduleList}>
            {scheduleSlots.map((item) => (
              <article className={styles.scheduleItem} key={`${item.day}-${item.slot}`}>
                <strong>{item.day}</strong>
                <span>{item.slot}</span>
                <em>{item.target}</em>
              </article>
            ))}
          </div>
        </article>

        <ScreenPanel
          badge="Quick Start: Назначение трансляции"
          footer="Расписание • Назначение на устройства • Публикация"
          image={image}
          imageAlt="Экран назначения трансляции на устройства SmartPlayer"
          subtitle="Реальный экран из шага «Расписание — назначение на устройства»."
          title="Расписание и назначение">
          <div className={styles.previewLayout}>
            <article className={styles.featureCardStrong}>
              <strong>Дата и окно показа</strong>
              <span>Выберите период трансляции и частоту показа контента.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Целевые устройства</strong>
              <span>Отметьте устройства, на которые будет назначена трансляция.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Подтверждение публикации</strong>
              <span>Сохраните назначение и проверьте итоговый статус публикации.</span>
            </article>
          </div>
        </ScreenPanel>
      </div>
    </section>
  );
}

function CreateGroupModal({onClose, closeDisabled}: ModalProps) {
  return (
    <div className={styles.modalLayer}>
      <div className={styles.modalCard} data-tour="create-group-modal">
        <header className={styles.modalHeader}>
          <div>
            <span className={styles.surfaceEyebrow}>Создание трансляции</span>
            <h3>Параметры запуска трансляции</h3>
          </div>
          <button
            aria-label="Закрыть модальное окно"
            className={styles.iconButton}
            disabled={closeDisabled}
            onClick={onClose}
            type="button">
            ×
          </button>
        </header>
        <div className={styles.modalBody}>
          <label className={styles.modalField}>
            <span>Название трансляции</span>
            <div>Весенний запуск / Лобби</div>
          </label>
          <label className={styles.modalField}>
            <span>Устройства</span>
            <div>LED Lobby 01, Kiosk East</div>
          </label>
          <label className={styles.modalField}>
            <span>Расписание</span>
            <div>Пн-Пт, 08:00-20:00</div>
          </label>
        </div>
        <footer className={styles.modalFooter}>
          <button className={styles.secondaryButton} disabled={closeDisabled} onClick={onClose} type="button">
            Отменить
          </button>
          <button className={styles.primaryButton} type="button">
            Сохранить черновик
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function InteractiveTourPage() {
  const [activeScreen, setActiveScreen] = useState<TourScreen>('content');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const contentScreenSrc = useBaseUrl(encodeURI('/quickstart-site/image/png/Контент.webp'));
  const deviceScreenSrc = useBaseUrl(encodeURI('/quickstart-site/image/png/Параметры устройства-20260226.webp'));
  const editorScreenSrc = useBaseUrl(encodeURI('/quickstart-site/image/png/Редактирование созданных трансляций.webp'));
  const scheduleScreenSrc = useBaseUrl(encodeURI('/quickstart-site/image/png/Расписание - назначение на устройства.webp'));

  const steps = useMemo(
    () =>
      buildTourSteps({
        setActiveScreen,
        setShowCreateGroupModal,
      }),
    [setActiveScreen, setShowCreateGroupModal],
  );

  const {startTour, isTourActive} = useDriverTour(steps, {
    onDestroyed: () => {
      setShowCreateGroupModal(false);
    },
  });

  useEffect(() => {
    if (!isTourActive) {
      return;
    }

    const selector = `[data-tour="${activeScreen}-screen"]`;
    const timer = window.setTimeout(() => {
      scrollToTarget(selector, 'start');
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeScreen, isTourActive]);

  useEffect(() => {
    if (!isTourActive || !showCreateGroupModal) {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToTarget('[data-tour="create-group-modal"]');
    }, 80);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showCreateGroupModal, isTourActive]);

  const activeStage = screens.find((screen) => screen.id === activeScreen) ?? screens[0];
  const activeStageIndex = screens.findIndex((screen) => screen.id === activeScreen);

  const launchTour = () => {
    startTransition(() => {
      setActiveScreen('content');
      setShowCreateGroupModal(false);
    });

    window.setTimeout(() => {
      startTour();
    }, 120);
  };

  const handleScreenSwitch = (screen: TourScreen) => {
    if (isTourActive) {
      return;
    }

    setShowCreateGroupModal(false);
    startTransition(() => {
      setActiveScreen(screen);
    });
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>SmartPlayer onboarding</span>
          <h1>Интерактивный продуктовый тур</h1>
          <p>
            Пошаговый маршрут по реальному сценарию Quick Start: Контент, Устройства, Трансляции и Расписание. Все шаги
            проходят в одном рабочем стенде без перехода в отдельные страницы.
          </p>
        </div>
        <div className={styles.heroActions}>
          <button className={styles.primaryButton} data-tour="launch-guide" disabled={isTourActive} onClick={launchTour} type="button">
            Запустить интерактивный гид
          </button>
          <Link className={styles.secondaryButton} to="/quickstart/">
            Открыть текущий Quick Start
          </Link>
        </div>
      </section>

      <section className={clsx(styles.stageShell, showCreateGroupModal && styles.stageShellModalOpen)}>
        <aside className={styles.sidebar} data-tour="sidebar">
          <div className={styles.sidebarBrand}>
            <span className={styles.sidebarLogo}>SP</span>
            <div>
              <strong>SmartPlayer CMS</strong>
              <span>Interactive training workspace</span>
            </div>
          </div>
          <div className={styles.sidebarProject}>
            <span className={styles.surfaceEyebrow}>Учебный контур</span>
            <strong>Быстрый старт / Практический маршрут</strong>
            <p>Сценарий повторяет ключевые шаги Quick Start и не влияет на production-данные.</p>
          </div>
          <nav aria-label="Навигация по учебным экранам" className={styles.sidebarNav}>
            {navTabs.map((tab) => (
              <button
                className={clsx(
                  tab.id === activeScreen ? styles.navButtonActive : styles.navButton,
                  isTourActive && styles.navButtonDisabled,
                )}
                disabled={isTourActive}
                key={tab.id}
                onClick={() => handleScreenSwitch(tab.id)}
                type="button">
                <span>{tab.label}</span>
                <small>{tab.id === activeScreen ? 'Текущий экран' : tab.note}</small>
              </button>
            ))}
          </nav>
          <div className={styles.sidebarHint}>
            <strong>9 шагов тура</strong>
            <p>Контент → Устройства → Трансляции → Расписание</p>
          </div>
        </aside>

        <main className={styles.stageMain}>
          <header className={styles.topbar}>
            <div className={styles.topbarCopy}>
              <span className={styles.surfaceEyebrow}>SmartPlayer / Quick Start walkthrough</span>
              <h2>{activeStage.heading}</h2>
              <p>{activeStage.description}</p>
            </div>
            <div className={styles.topbarControls}>
              <span>{`Экран ${activeStageIndex + 1} / ${screens.length}`}</span>
              <button className={styles.ghostButton} disabled={isTourActive} onClick={launchTour} type="button">
                Перезапустить гид
              </button>
            </div>
          </header>

          <div className={styles.chipRow}>
            {activeStage.chips.map((chip) => (
              <span className={styles.infoChip} key={chip}>
                {chip}
              </span>
            ))}
          </div>

          {activeScreen === 'content' ? (
            <ContentStage
              image={contentScreenSrc}
              onCreateGroup={() => {
                if (isTourActive) {
                  return;
                }

                setShowCreateGroupModal(true);
              }}
            />
          ) : null}
          {activeScreen === 'device' ? <DeviceStage image={deviceScreenSrc} /> : null}
          {activeScreen === 'editor' ? <EditorStage image={editorScreenSrc} /> : null}
          {activeScreen === 'schedule' ? <ScheduleStage image={scheduleScreenSrc} /> : null}
        </main>

        {showCreateGroupModal ? (
          <CreateGroupModal
            closeDisabled={isTourActive}
            onClose={() => {
              if (isTourActive) {
                return;
              }

              setShowCreateGroupModal(false);
            }}
          />
        ) : null}
      </section>
    </div>
  );
}
