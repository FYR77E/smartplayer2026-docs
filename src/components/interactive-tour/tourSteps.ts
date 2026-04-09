import type {Dispatch, SetStateAction} from 'react';
import type {DriveStep, DriverHook} from 'driver.js';

export type TourScreen = 'content' | 'device' | 'editor' | 'schedule';

type BuildTourStepsOptions = {
  setActiveScreen: Dispatch<SetStateAction<TourScreen>>;
  setShowCreateGroupModal: Dispatch<SetStateAction<boolean>>;
};

const BASE_TRANSITION_DELAY_MS = 140;
const WAIT_TIMEOUT_MS = 2800;

const SELECTORS = {
  sidebar: '[data-tour="sidebar"]',
  content: '[data-tour="content-screen"]',
  createGroup: '[data-tour="create-group"]',
  createGroupModal: '[data-tour="create-group-modal"]',
  device: '[data-tour="device-screen"]',
  editor: '[data-tour="editor-screen"]',
  schedule: '[data-tour="schedule-screen"]',
} as const;

function getVisibleElement(selector: string): HTMLElement | null {
  const element = document.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width < 8 || rect.height < 8) {
    return null;
  }

  return element;
}

function ensureElementInViewport(selector: string) {
  const element = getVisibleElement(selector);

  if (!element) {
    return;
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  });
}

async function waitForVisibleElement(selector: string, timeoutMs = WAIT_TIMEOUT_MS): Promise<void> {
  const start = window.performance.now();

  while (window.performance.now() - start < timeoutMs) {
    if (getVisibleElement(selector)) {
      return;
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, 32);
    });
  }
}

function queueTransition({
  action,
  move,
  waitForSelector,
}: {
  action: () => void;
  move: () => void;
  waitForSelector?: string;
}) {
  action();

  const run = async () => {
    if (waitForSelector) {
      await waitForVisibleElement(waitForSelector).catch(() => undefined);
      ensureElementInViewport(waitForSelector);
    } else {
      await new Promise((resolve) => {
        window.setTimeout(resolve, BASE_TRANSITION_DELAY_MS);
      });
    }

    window.requestAnimationFrame(() => {
      move();
    });
  };

  void run();
}

function withNextScreen(
  setActiveScreen: BuildTourStepsOptions['setActiveScreen'],
  screen: TourScreen,
  waitForSelector: string,
  afterChange?: () => void,
): DriverHook {
  return (_, __, {driver}) => {
    queueTransition({
      action: () => {
        setActiveScreen(screen);
        afterChange?.();
      },
      move: () => driver.moveNext(),
      waitForSelector,
    });
  };
}

function withPreviousScreen(
  setActiveScreen: BuildTourStepsOptions['setActiveScreen'],
  screen: TourScreen,
  waitForSelector: string,
  afterChange?: () => void,
): DriverHook {
  return (_, __, {driver}) => {
    queueTransition({
      action: () => {
        setActiveScreen(screen);
        afterChange?.();
      },
      move: () => driver.movePrevious(),
      waitForSelector,
    });
  };
}

export function buildTourSteps({setActiveScreen, setShowCreateGroupModal}: BuildTourStepsOptions): DriveStep[] {
  return [
    {
      popover: {
        title: 'Интерактивное обучение SmartPlayer',
        description:
          'Это guided walkthrough по реальным экранам Quick Start. Используйте кнопки «Далее» и «Назад», чтобы пройти маршрут Контент → Устройства → Трансляции → Расписание.',
        side: 'over',
        align: 'center',
      },
    },
    {
      element: SELECTORS.sidebar,
      popover: {
        title: 'Навигация по ключевым разделам',
        description:
          'Слева собраны основные зоны SmartPlayer: разделы «Контент», «Устройства», «Трансляции» и этап публикации по расписанию.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: SELECTORS.content,
      popover: {
        title: 'Раздел «Контент»',
        description:
          'В центре показан реальный экран раздела «Контент» из Quick Start: медиатека, список файлов и действия с выбранным материалом перед отправкой на устройства.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: SELECTORS.createGroup,
      popover: {
        title: 'Создание трансляции',
        description:
          'Этот шаг демонстрационный: кнопка открывает параметры новой трансляции, чтобы показать логику Quick Start перед переходом к экрану устройства.',
        side: 'bottom',
        align: 'start',
        onNextClick: (_, __, {driver}) => {
          queueTransition({
            action: () => {
              setShowCreateGroupModal(true);
            },
            move: () => driver.moveNext(),
            waitForSelector: SELECTORS.createGroupModal,
          });
        },
      },
    },
    {
      element: SELECTORS.createGroupModal,
      popover: {
        title: 'Параметры запуска трансляции',
        description:
          'Модальное окно показывает демонстрационный шаг создания трансляции: название, устройства и расписание перед переходом к реальной карточке устройства.',
        side: 'top',
        align: 'start',
        onPrevClick: (_, __, {driver}) => {
          queueTransition({
            action: () => {
              setShowCreateGroupModal(false);
            },
            move: () => driver.movePrevious(),
            waitForSelector: SELECTORS.createGroup,
          });
        },
        onNextClick: withNextScreen(setActiveScreen, 'device', SELECTORS.device, () => {
          setShowCreateGroupModal(false);
        }),
      },
    },
    {
      element: SELECTORS.device,
      popover: {
        title: 'Устройства и параметры устройства',
        description:
          'Сейчас в центре реальный экран Quick Start «Добавление устройства»: карточка устройства, статус подключения и параметры конкретного экрана.',
        side: 'left',
        align: 'start',
        onPrevClick: (_, __, {driver}) => {
          queueTransition({
            action: () => {
              setActiveScreen('content');
              setShowCreateGroupModal(true);
            },
            move: () => driver.movePrevious(),
            waitForSelector: SELECTORS.createGroupModal,
          });
        },
        onNextClick: withNextScreen(setActiveScreen, 'editor', SELECTORS.editor),
      },
    },
    {
      element: SELECTORS.editor,
      popover: {
        title: 'Трансляции и редактирование',
        description:
          'Это реальный экран редактирования созданных трансляций: здесь проверяют состав контента, текущие параметры и готовность трансляции к назначению.',
        side: 'left',
        align: 'center',
        onPrevClick: withPreviousScreen(setActiveScreen, 'device', SELECTORS.device),
        onNextClick: withNextScreen(setActiveScreen, 'schedule', SELECTORS.schedule),
      },
    },
    {
      element: SELECTORS.schedule,
      popover: {
        title: 'Расписание — назначение на устройства',
        description:
          'Финальный реальный экран Quick Start: задайте окно показа, выберите устройства и подтвердите назначение трансляции на целевые экраны.',
        side: 'left',
        align: 'start',
        onPrevClick: withPreviousScreen(setActiveScreen, 'editor', SELECTORS.editor),
      },
    },
    {
      popover: {
        title: 'Маршрут завершён',
        description:
          'Тур можно запускать повторно для онбординга команды: он показывает реальный интерфейс SmartPlayer и повторяет основной сценарий Quick Start без перехода по отдельным страницам.',
        side: 'over',
        align: 'center',
      },
    },
  ];
}
