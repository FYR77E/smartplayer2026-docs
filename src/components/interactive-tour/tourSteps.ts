import type {Dispatch, SetStateAction} from 'react';
import type {DriveStep, DriverHook} from 'driver.js';

export type TourScreen = 'content' | 'device' | 'editor' | 'schedule';

type BuildTourStepsOptions = {
  setActiveScreen: Dispatch<SetStateAction<TourScreen>>;
  setShowCreateGroupModal: Dispatch<SetStateAction<boolean>>;
};

const TRANSITION_DELAY_MS = 240;

function queueTransition(action: () => void, move: () => void) {
  action();
  window.setTimeout(move, TRANSITION_DELAY_MS);
}

function withNextScreen(
  setActiveScreen: BuildTourStepsOptions['setActiveScreen'],
  screen: TourScreen,
  afterChange?: () => void,
): DriverHook {
  return (_, __, {driver}) => {
    queueTransition(
      () => {
        setActiveScreen(screen);
        afterChange?.();
      },
      () => driver.moveNext(),
    );
  };
}

function withPreviousScreen(
  setActiveScreen: BuildTourStepsOptions['setActiveScreen'],
  screen: TourScreen,
  afterChange?: () => void,
): DriverHook {
  return (_, __, {driver}) => {
    queueTransition(
      () => {
        setActiveScreen(screen);
        afterChange?.();
      },
      () => driver.movePrevious(),
    );
  };
}

export function buildTourSteps({
  setActiveScreen,
  setShowCreateGroupModal,
}: BuildTourStepsOptions): DriveStep[] {
  return [
    {
      popover: {
        title: 'Интерактивное обучение SmartPlayer',
        description:
          'Этот маршрут проводит по ключевым рабочим действиям: навигация, подготовка контента, проверка устройств, редактирование сценария и публикация.',
        side: 'over',
        align: 'center',
      },
    },
    {
      element: '[data-tour="sidebar"]',
      popover: {
        title: 'Навигация по разделам',
        description:
          'Левая панель помогает быстро переключаться между контентом, устройствами, редактором и расписаниями без выхода из рабочей области.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '[data-tour="content-screen"]',
      popover: {
        title: 'Стартовая рабочая область',
        description:
          'Здесь команда собирает группы контента, видит статус медиаматериалов и отслеживает, что уже готово к публикации.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '[data-tour="create-group"]',
      popover: {
        title: 'Создание группы контента',
        description:
          'Кнопка запускает короткую настройку группы: название, сценарий показа и базовые параметры публикации.',
        side: 'bottom',
        align: 'start',
        onNextClick: (_, __, {driver}) => {
          queueTransition(
            () => setShowCreateGroupModal(true),
            () => driver.moveNext(),
          );
        },
      },
    },
    {
      element: '[data-tour="create-group-modal"]',
      popover: {
        title: 'Параметры новой группы',
        description:
          'В модальном окне задаются название, целевой экран и стартовый сценарий. После этого можно переходить к проверке устройств.',
        side: 'top',
        align: 'start',
        onPrevClick: (_, __, {driver}) => {
          queueTransition(
            () => setShowCreateGroupModal(false),
            () => driver.movePrevious(),
          );
        },
        onNextClick: withNextScreen(setActiveScreen, 'device', () => {
          setShowCreateGroupModal(false);
        }),
      },
    },
    {
      element: '[data-tour="device-screen"]',
      popover: {
        title: 'Проверка устройств',
        description:
          'После подготовки контента оператор убеждается, что нужные экраны на связи, получают актуальные пакеты и готовы к пробному показу.',
        side: 'left',
        align: 'start',
        onPrevClick: (_, __, {driver}) => {
          queueTransition(
            () => {
              setActiveScreen('content');
              setShowCreateGroupModal(true);
            },
            () => driver.movePrevious(),
          );
        },
        onNextClick: withNextScreen(setActiveScreen, 'editor'),
      },
    },
    {
      element: '[data-tour="editor-screen"]',
      popover: {
        title: 'Редактор сценария',
        description:
          'В редакторе команда выстраивает последовательность блоков, проверяет длительности и готовит итоговый сценарий к публикации.',
        side: 'left',
        align: 'center',
        onPrevClick: withPreviousScreen(setActiveScreen, 'device'),
        onNextClick: withNextScreen(setActiveScreen, 'schedule'),
      },
    },
    {
      element: '[data-tour="schedule-screen"]',
      popover: {
        title: 'Расписание и публикация',
        description:
          'Финальный шаг — назначить временные окна, целевые площадки и подтвердить публикацию, чтобы сценарий ушёл на устройства по расписанию.',
        side: 'left',
        align: 'start',
        onPrevClick: withPreviousScreen(setActiveScreen, 'editor'),
      },
    },
    {
      popover: {
        title: 'Маршрут завершён',
        description:
          'Теперь страницу можно использовать как изолированный тренажёр: запускать гид заново, переключать экраны вручную и показывать сценарий новой команде.',
        side: 'over',
        align: 'center',
      },
    },
  ];
}
