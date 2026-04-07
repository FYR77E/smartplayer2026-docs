import {startTransition, useMemo, useState} from 'react';
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
  children: React.ReactNode;
  footer: string;
};

type ModalProps = {
  onClose: () => void;
};

const screens: StageConfig[] = [
  {
    id: 'content',
    label: 'Контент',
    heading: 'Стартовый набор материалов',
    description: 'Соберите релиз, проверьте статусы и подготовьте группу к публикации на целевые экраны.',
    chips: ['12 материалов', '3 активные группы', 'Готовность 98%'],
  },
  {
    id: 'device',
    label: 'Устройства',
    heading: 'Контроль подключения',
    description: 'Проверьте heartbeat, версии пакетов и доступность экранов перед пилотом.',
    chips: ['Online 96%', 'Пакет 4.2', '2 экрана в проверке'],
  },
  {
    id: 'editor',
    label: 'Редактор',
    heading: 'Сборка сценария показа',
    description: 'Настройте таймлайн, длительности блоков и слои, которые пойдут в финальный слот.',
    chips: ['Длина 04:20', '4 блока', '2 зоны показа'],
  },
  {
    id: 'schedule',
    label: 'Публикация',
    heading: 'Расписание и go-live',
    description: 'Назначьте окна трансляции, целевые площадки и подтвердите отправку в production.',
    chips: ['3 окна запуска', '12 устройств', 'Ближайший слот 16:00'],
  },
];

const navTabs: ScreenTab[] = [
  {id: 'content', label: 'Контент', note: 'Медиатека'},
  {id: 'device', label: 'Устройства', note: 'Мониторинг'},
  {id: 'editor', label: 'Редактор', note: 'Таймлайн'},
  {id: 'schedule', label: 'Публикация', note: 'Go-live'},
];

const contentQueue = [
  {name: 'Весенний запуск / Лобби', count: '12 блоков', state: 'Готов к публикации'},
  {name: 'Промо витрина East', count: '4 блока', state: 'Черновик'},
  {name: 'HQ signage / Main wall', count: '8 блоков', state: 'Согласование'},
];

const deviceStatuses: DeviceStatus[] = [
  {name: 'LED Lobby 01', state: 'На связи', sync: '2 минуты назад'},
  {name: 'Kiosk East', state: 'Проверка', sync: '5 минут назад'},
  {name: 'Video Wall West', state: 'Готов', sync: 'только что'},
];

const timelineSlots: TimelineSlot[] = [
  {name: 'Вступительный ролик', duration: '00:15', type: 'Основной'},
  {name: 'Промо-сетка', duration: '00:45', type: 'Контент'},
  {name: 'Инфо-плашка', duration: '00:10', type: 'Системный слой'},
  {name: 'Финальный CTA', duration: '00:12', type: 'Финальный'},
];

const scheduleSlots: ScheduleSlot[] = [
  {day: 'Пн', slot: '08:00-12:00', target: 'Лобби и ресепшен'},
  {day: 'Ср', slot: '12:00-16:00', target: 'Торговый зал'},
  {day: 'Пт', slot: '16:00-20:00', target: 'Все экраны проекта'},
];

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
          <h2>Стартовый набор медиаматериалов</h2>
          <p>Подготовьте группу, проверьте очередность блоков и подтвердите целевой экран для первой публикации.</p>
        </div>
        <button className={styles.primaryButton} data-tour="create-group" onClick={onCreateGroup} type="button">
          Создать группу
        </button>
      </header>

      <div className={styles.stageGrid}>
        <article className={styles.queueCard}>
          <h3>Очередь контента</h3>
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
          badge="Превью сценария"
          footer="Основной плейлист • Длительность 04:20"
          image={image}
          imageAlt="Экран контента SmartPlayer"
          subtitle="Сцена, слои и ключевые блоки перед переходом к устройствам."
          title="Весенний запуск / Лобби">
          <div className={styles.previewLayout}>
            <article className={styles.featureCard}>
              <strong>Релиз готов</strong>
              <span>Контент прошел предварительную проверку и ожидает публикации.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Промо-ролик</strong>
              <span>00:45 • HQ signage</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Локальные объявления</strong>
              <span>00:30 • Утренний слот</span>
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
          <h2>Мониторинг подключения</h2>
          <p>Проверьте состояние экранов и синхронизацию пакетов перед запуском пилотной трансляции.</p>
        </div>
      </header>

      <div className={styles.stageGrid}>
        <article className={styles.queueCard}>
          <h3>Последний heartbeat</h3>
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
          badge="Карта проекта"
          footer="Пакет 4.2 синхронизирован • Следующий пинг 00:54"
          image={image}
          imageAlt="Экран устройств SmartPlayer"
          subtitle="Критичные зоны и готовность к пилоту."
          title="Контур устройств">
          <div className={styles.previewLayout}>
            <article className={styles.featureCard}>
              <strong>Зона лобби</strong>
              <span>3 экрана online</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Торговый зал</strong>
              <span>1 экран в проверке</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Видеостена</strong>
              <span>Готова к запуску</span>
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
          <span className={styles.surfaceEyebrow}>Редактор</span>
          <h2>Таймлайн и слои сценария</h2>
          <p>Выстройте последовательность блоков и закрепите финальный вид сценария перед публикацией.</p>
        </div>
      </header>

      <div className={styles.stageGrid}>
        <article className={styles.queueCard}>
          <h3>Таймлайн релиза</h3>
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
          badge="Редактор сцены"
          footer="2 зоны показа • Автоцикл включен"
          image={image}
          imageAlt="Экран редактора SmartPlayer"
          subtitle="Сцена с рабочими слоями и финальным слотом публикации."
          title="Основной поток / Утро">
          <div className={styles.previewLayout}>
            <article className={styles.featureCard}>
              <strong>Canvas Hero</strong>
              <span>Промо + навигационная плашка</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Info Layer</strong>
              <span>Ticker и локальные уведомления</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Final CTA</strong>
              <span>Завершающий слот сценария</span>
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
          <span className={styles.surfaceEyebrow}>Публикация</span>
          <h2>Расписание и подтверждение go-live</h2>
          <p>Назначьте слоты, выберите площадки и подтвердите отправку сценария на целевые устройства.</p>
        </div>
      </header>

      <div className={styles.stageGrid}>
        <article className={styles.queueCard}>
          <h3>Окна публикации</h3>
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
          badge="Публикационный центр"
          footer="Целевые площадки: 12 устройств • Публикация в один клик"
          image={image}
          imageAlt="Экран публикации SmartPlayer"
          subtitle="Финальная проверка перед запуском сценария."
          title="Весенний запуск / Пятница 16:00">
          <div className={styles.previewLayout}>
            <article className={styles.featureCardStrong}>
              <strong>Публикация подтверждена</strong>
              <span>Релиз уйдет на устройства сразу после финальной проверки.</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Контент проверен</strong>
              <span>Все блоки синхронизированы</span>
            </article>
            <article className={styles.featureCard}>
              <strong>Пилот завершен</strong>
              <span>Можно запускать production</span>
            </article>
          </div>
        </ScreenPanel>
      </div>
    </section>
  );
}

function CreateGroupModal({onClose}: ModalProps) {
  return (
    <div className={styles.modalLayer}>
      <div className={styles.modalCard} data-tour="create-group-modal">
        <header className={styles.modalHeader}>
          <div>
            <span className={styles.surfaceEyebrow}>Новая группа контента</span>
            <h3>Параметры запуска</h3>
          </div>
          <button aria-label="Закрыть модальное окно" className={styles.iconButton} onClick={onClose} type="button">
            ×
          </button>
        </header>
        <div className={styles.modalBody}>
          <label className={styles.modalField}>
            <span>Название группы</span>
            <div>Весенний запуск / Лобби</div>
          </label>
          <label className={styles.modalField}>
            <span>Целевой экран</span>
            <div>LED Lobby 01</div>
          </label>
          <label className={styles.modalField}>
            <span>Стартовый сценарий</span>
            <div>Основной поток / Утро</div>
          </label>
        </div>
        <footer className={styles.modalFooter}>
          <button className={styles.secondaryButton} onClick={onClose} type="button">
            Позже
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

  const contentScreenSrc = useBaseUrl('/img/interactive-tour/content-screen.png');
  const deviceScreenSrc = useBaseUrl('/img/interactive-tour/device-screen.png');
  const editorScreenSrc = useBaseUrl('/img/interactive-tour/editor-screen.png');
  const scheduleScreenSrc = useBaseUrl('/img/interactive-tour/schedule-screen.png');

  const steps = useMemo(
    () =>
      buildTourSteps({
        setActiveScreen,
        setShowCreateGroupModal,
      }),
    [setActiveScreen, setShowCreateGroupModal],
  );

  const {startTour} = useDriverTour(steps, {
    onDestroyed: () => {
      setShowCreateGroupModal(false);
    },
  });

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
            Реалистичный walkthrough в стиле product demo: один рабочий стенд, spotlight по ключевым действиям и четкий
            сценарий от подготовки контента до публикации.
          </p>
        </div>
        <div className={styles.heroActions}>
          <button className={styles.primaryButton} data-tour="launch-guide" onClick={launchTour} type="button">
            Запустить интерактивный гид
          </button>
          <Link className={styles.secondaryButton} to="/quickstart/">
            Открыть текущий Quick Start
          </Link>
        </div>
      </section>

      <section className={styles.stageShell}>
        <aside className={styles.sidebar} data-tour="sidebar">
          <div className={styles.sidebarBrand}>
            <span className={styles.sidebarLogo}>SP</span>
            <div>
              <strong>SmartPlayer CMS</strong>
              <span>Interactive training workspace</span>
            </div>
          </div>
          <div className={styles.sidebarProject}>
            <span className={styles.surfaceEyebrow}>Sandbox project</span>
            <strong>Весенний запуск / Центральный офис</strong>
            <p>Изолированный учебный контур для демонстрации сценария без влияния на production.</p>
          </div>
          <nav aria-label="Навигация по учебным экранам" className={styles.sidebarNav}>
            {navTabs.map((tab) => (
              <button
                className={tab.id === activeScreen ? styles.navButtonActive : styles.navButton}
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
            <p>Контент → Устройства → Редактор → Публикация</p>
          </div>
        </aside>

        <main className={styles.stageMain}>
          <header className={styles.topbar}>
            <div className={styles.topbarCopy}>
              <span className={styles.surfaceEyebrow}>SmartPlayer / Wallboard flow</span>
              <h2>{activeStage.heading}</h2>
              <p>{activeStage.description}</p>
            </div>
            <div className={styles.topbarControls}>
              <span>{`Экран ${activeStageIndex + 1} / ${screens.length}`}</span>
              <button className={styles.ghostButton} onClick={launchTour} type="button">
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
            <ContentStage image={contentScreenSrc} onCreateGroup={() => setShowCreateGroupModal(true)} />
          ) : null}
          {activeScreen === 'device' ? <DeviceStage image={deviceScreenSrc} /> : null}
          {activeScreen === 'editor' ? <EditorStage image={editorScreenSrc} /> : null}
          {activeScreen === 'schedule' ? <ScheduleStage image={scheduleScreenSrc} /> : null}
        </main>

        {showCreateGroupModal ? <CreateGroupModal onClose={() => setShowCreateGroupModal(false)} /> : null}
      </section>
    </div>
  );
}
