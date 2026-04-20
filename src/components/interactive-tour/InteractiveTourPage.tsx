import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './styles.module.css';

type TourZone = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type TourPopoverAnchor = {
  top: number;
  left: number;
};

type TourStep = {
  id: string;
  title: string;
  shortTitle: string;
  image: string;
  imageAlt: string;
  zone: TourZone;
  popover: TourPopoverAnchor;
  description: string;
};

type TourMode = 'intro' | 'active' | 'complete';

const TOUR_STEPS: TourStep[] = [
  {
    id: 'login',
    title: 'Вход в личный кабинет',
    shortTitle: 'Вход',
    image: 'Авторизация.webp',
    imageAlt: 'Экран авторизации SmartPlayer',
    zone: {top: 46, left: 72, width: 24, height: 26},
    popover: {top: 63, left: 60},
    description: 'В этой форме введите e-mail и пароль. Ссылка «Не получается войти?» открывает восстановление доступа.',
  },
  {
    id: 'dashboard',
    title: 'Обзор Dashboard',
    shortTitle: 'Обзор',
    image: 'ЛК - Обзор (5).webp',
    imageAlt: 'Личный кабинет SmartPlayer, обзор',
    zone: {top: 16, left: 0.5, width: 15.5, height: 58},
    popover: {top: 20, left: 23},
    description: 'Левая колонка — основная навигация SmartPlayer. Здесь переключаются ключевые разделы: устройства, контент, трансляции и расписание.',
  },
  {
    id: 'devices',
    title: 'Раздел «Устройства»',
    shortTitle: 'Устройства',
    image: 'ЛК - Устройства.webp',
    imageAlt: 'Раздел Устройства в SmartPlayer',
    zone: {top: 20, left: 17, width: 42, height: 40},
    popover: {top: 24, left: 67},
    description: 'В карточках устройств цветные индикаторы показывают состояние. По ним сразу видно, где устройство онлайн, офлайн или с ошибкой.',
  },
  {
    id: 'add-device',
    title: 'Добавление устройства',
    shortTitle: 'Добавить',
    image: 'Добавление устройства-20260226.webp',
    imageAlt: 'Диалог добавления устройства в SmartPlayer',
    zone: {top: 38, left: 39.5, width: 21, height: 27},
    popover: {top: 45, left: 67},
    description: 'В модальном окне укажите 9-значный код с экрана устройства и выберите лицензию для активации.',
  },
  {
    id: 'content',
    title: 'Раздел «Контент»',
    shortTitle: 'Контент',
    image: 'Контент.webp',
    imageAlt: 'Раздел Контент в SmartPlayer',
    zone: {top: 23, left: 17, width: 44, height: 24},
    popover: {top: 56, left: 66},
    description:
      'Это верхняя часть медиатеки: вкладки типов контента и первые карточки файлов. Отсюда выбираются материалы для трансляций.',
  },
  {
    id: 'quick-send',
    title: 'Быстрая отправка: шаг 1',
    shortTitle: 'Отправка',
    image: 'Быстрая отправка - шаг 1-20260226.webp',
    imageAlt: 'Быстрая отправка, первый шаг',
    zone: {top: 7.5, left: 73.5, width: 26, height: 87},
    popover: {top: 18, left: 66},
    description:
      'В правой панели выберите нужный файл и перетащите его на центральный холст. Так формируется сценарий текущей трансляции.',
  },
  {
    id: 'targets',
    title: 'Выбор устройств',
    shortTitle: 'Выбор',
    image: 'шаг 2.webp',
    imageAlt: 'Выбор устройств в сценарии быстрой отправки',
    zone: {top: 39, left: 1.5, width: 19.5, height: 23},
    popover: {top: 34, left: 38},
    description:
      'Выберите карточку устройства до появления отметки выбора. После этого устройство попадёт в список выбранных и шаг «Далее» станет осмысленным.',
  },
  {
    id: 'schedule',
    title: 'Расписание трансляции',
    shortTitle: 'Расписание',
    image: 'шаг 3.webp',
    imageAlt: 'Расписание трансляции в SmartPlayer',
    zone: {top: 20, left: 1.2, width: 60, height: 26},
    popover: {top: 50, left: 60},
    description:
      'В этом блоке задаются даты и время начала и окончания трансляции. Это основная точка настройки расписания перед запуском.',
  },
  {
    id: 'device-card',
    title: 'Карточка устройства',
    shortTitle: 'Карточка',
    image: 'ЛК - меню устройства-20260226.webp',
    imageAlt: 'Карточка устройства в SmartPlayer',
    zone: {top: 6, left: 84, width: 15.5, height: 29},
    popover: {top: 18, left: 46},
    description:
      'В правой карточке доступны быстрые действия по устройству: скриншот, перезапуск, управление громкостью и переход в расширенное меню.',
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function overlapArea(
  first: {left: number; top: number; width: number; height: number},
  second: {left: number; top: number; width: number; height: number},
): number {
  const overlapWidth =
    Math.max(0, Math.min(first.left + first.width, second.left + second.width) - Math.max(first.left, second.left));
  const overlapHeight =
    Math.max(0, Math.min(first.top + first.height, second.top + second.height) - Math.max(first.top, second.top));
  return overlapWidth * overlapHeight;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable;
}

function HighlightZone({
  zone,
  title,
  onClick,
}: {
  zone: TourZone;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={`Подсвеченная зона: ${title}. Нажмите, чтобы перейти к следующему шагу.`}
      className={styles.highlightZone}
      data-tour-highlight="true"
      onClick={onClick}
      style={{
        top: `${zone.top}%`,
        left: `${zone.left}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
      }}
      type="button"
    />
  );
}

function FocusMask({zone}: {zone: TourZone}) {
  return (
    <div
      aria-hidden="true"
      className={styles.focusMask}
      style={{
        top: `${zone.top}%`,
        left: `${zone.left}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
      }}
    />
  );
}

function FocusWindow({
  zone,
  image,
}: {
  zone: TourZone;
  image: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={styles.focusWindow}
      style={{
        top: `${zone.top}%`,
        left: `${zone.left}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
      }}>
      <img
        alt=""
        className={styles.focusWindowImage}
        src={image}
        style={{
          width: `${10000 / zone.width}%`,
          height: `${10000 / zone.height}%`,
          transform: `translate(-${zone.left}%, -${zone.top}%)`,
        }}
      />
    </div>
  );
}

export default function InteractiveTourPage() {
  const {siteConfig} = useDocusaurusContext();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imageViewportRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLElement | null>(null);
  const mobileDetailsRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollBehaviorRef = useRef<ScrollBehavior>('auto');
  const [mode, setMode] = useState<TourMode>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [popoverPosition, setPopoverPosition] = useState<TourPopoverAnchor | null>(null);

  const normalizedBaseUrl = siteConfig.baseUrl.endsWith('/') ? siteConfig.baseUrl : `${siteConfig.baseUrl}/`;

  const steps = useMemo(
    () =>
      TOUR_STEPS.map((step) => ({
        ...step,
        image: `${normalizedBaseUrl}quickstart-site/image/png/${encodeURI(step.image)}`,
      })),
    [normalizedBaseUrl],
  );

  const isActive = mode === 'active';
  const isComplete = mode === 'complete';
  const currentStep = isActive ? steps[stepIndex] : null;
  const progressValue = isComplete ? 100 : isActive ? ((stepIndex + 1) / steps.length) * 100 : 0;

  const getMotionAwareBehavior = useCallback((behavior: ScrollBehavior) => {
    if (behavior !== 'smooth') {
      return behavior;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }, []);

  const getTourTopOffset = useCallback(() => {
    if (window.matchMedia('(max-width: 920px)').matches) {
      return 12;
    }

    if (window.matchMedia('(max-width: 1100px)').matches) {
      return 32;
    }

    return 48;
  }, []);

  const alignTourShellToViewport = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      if (!stageRef.current) {
        return false;
      }

      const stageRect = stageRef.current.getBoundingClientRect();
      const delta = stageRect.top - getTourTopOffset();

      if (Math.abs(delta) <= 6) {
        return false;
      }

      window.scrollBy({
        top: delta,
        behavior: getMotionAwareBehavior(behavior),
      });
      return true;
    },
    [getMotionAwareBehavior, getTourTopOffset],
  );

  const scrollToTourTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (!stageRef.current) {
      return;
    }

    const stageRect = stageRef.current.getBoundingClientRect();
    const absoluteTop = window.scrollY + stageRect.top;
    window.scrollTo({
      top: Math.max(absoluteTop - getTourTopOffset(), 0),
      behavior: getMotionAwareBehavior(behavior),
    });
  }, [getMotionAwareBehavior, getTourTopOffset]);

  const handleStart = useCallback(() => {
    pendingScrollBehaviorRef.current = 'auto';
    setStepIndex(0);
    setMode('active');
    requestAnimationFrame(() => scrollToTourTop('auto'));
  }, [scrollToTourTop]);

  const handleExitToIntro = useCallback(() => {
    pendingScrollBehaviorRef.current = 'auto';
    setStepIndex(0);
    setMode('intro');
    requestAnimationFrame(() => scrollToTourTop('auto'));
  }, [scrollToTourTop]);

  const handleRestart = useCallback(() => {
    pendingScrollBehaviorRef.current = 'auto';
    setStepIndex(0);
    setMode('active');
    requestAnimationFrame(() => scrollToTourTop('auto'));
  }, [scrollToTourTop]);

  const handleNext = useCallback(() => {
    if (!isActive) {
      return;
    }
    pendingScrollBehaviorRef.current = 'smooth';
    if (stepIndex >= steps.length - 1) {
      setMode('complete');
      return;
    }
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }, [isActive, stepIndex, steps.length]);

  const handlePrevious = useCallback(() => {
    if (!isActive) {
      return;
    }
    pendingScrollBehaviorRef.current = 'smooth';
    setStepIndex((current) => Math.max(current - 1, 0));
  }, [isActive]);

  const handleStepJump = useCallback(
    (targetIndex: number) => {
      if (!isActive) {
        return;
      }

      const nextIndex = clamp(targetIndex, 0, steps.length - 1);
      if (nextIndex === stepIndex) {
        return;
      }

      pendingScrollBehaviorRef.current = 'smooth';
      setStepIndex(nextIndex);
    },
    [isActive, stepIndex, steps.length],
  );

  const ensureActiveStepInView = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      if (!isActive || !imageViewportRef.current) {
        return;
      }

      const resolvedBehavior = getMotionAwareBehavior(behavior);
      if (alignTourShellToViewport(resolvedBehavior)) {
        return;
      }

      if (window.matchMedia('(max-width: 920px)').matches) {
        return;
      }

      const viewportRect = imageViewportRef.current.getBoundingClientRect();
      const currentPopoverRect = popoverRef.current?.getBoundingClientRect();
      const safeTop = getTourTopOffset() + 8;
      const safeBottom = window.innerHeight - 24;

      if (viewportRect.top < safeTop) {
        window.scrollBy({
          top: viewportRect.top - safeTop - 6,
          behavior: resolvedBehavior,
        });
        return;
      }

      if (currentPopoverRect && currentPopoverRect.bottom > safeBottom) {
        window.scrollBy({
          top: currentPopoverRect.bottom - safeBottom + 6,
          behavior: resolvedBehavior,
        });
      }
    },
    [alignTourShellToViewport, getMotionAwareBehavior, getTourTopOffset, isActive],
  );

  const computePopoverPosition = useCallback(() => {
    if (!isActive || !currentStep || !imageViewportRef.current || !popoverRef.current) {
      return;
    }

    if (window.matchMedia('(max-width: 920px)').matches) {
      setPopoverPosition(null);
      return;
    }

    const viewportRect = imageViewportRef.current.getBoundingClientRect();
    const currentPopoverRect = popoverRef.current.getBoundingClientRect();

    if (!currentPopoverRect.width || !currentPopoverRect.height) {
      return;
    }

    const margin = 12;
    const zoneRect = {
      top: (currentStep.zone.top / 100) * viewportRect.height,
      left: (currentStep.zone.left / 100) * viewportRect.width,
      width: (currentStep.zone.width / 100) * viewportRect.width,
      height: (currentStep.zone.height / 100) * viewportRect.height,
    };
    const anchorX = (currentStep.popover.left / 100) * viewportRect.width;
    const anchorY = (currentStep.popover.top / 100) * viewportRect.height;
    const popoverWidth = currentPopoverRect.width;
    const popoverHeight = currentPopoverRect.height;
    const zoneBottom = zoneRect.top + zoneRect.height;
    const zoneTop = zoneRect.top;

    const candidates = [
      {left: anchorX + 16, top: anchorY + 12},
      {left: anchorX + 16, top: anchorY - popoverHeight - 12},
      {left: anchorX - popoverWidth - 16, top: anchorY + 12},
      {left: anchorX - popoverWidth - 16, top: anchorY - popoverHeight - 12},
      {left: zoneRect.left + (zoneRect.width - popoverWidth) / 2, top: zoneBottom + 12},
      {left: zoneRect.left + (zoneRect.width - popoverWidth) / 2, top: zoneTop - popoverHeight - 12},
      {left: zoneRect.left, top: zoneBottom + 12},
      {left: zoneRect.left + zoneRect.width - popoverWidth, top: zoneBottom + 12},
      {left: zoneRect.left, top: zoneTop - popoverHeight - 12},
      {left: zoneRect.left + zoneRect.width - popoverWidth, top: zoneTop - popoverHeight - 12},
      {left: zoneRect.left - popoverWidth - 16, top: zoneRect.top + (zoneRect.height - popoverHeight) / 2},
      {left: zoneRect.left + zoneRect.width + 16, top: zoneRect.top + (zoneRect.height - popoverHeight) / 2},
    ];

    const scoredCandidates = candidates.map((candidate) => {
      const maxLeft = Math.max(margin, viewportRect.width - popoverWidth - margin - 10);
      const maxTop = Math.max(margin, viewportRect.height - popoverHeight - margin - 20);
      const clampedLeft = clamp(candidate.left, margin, maxLeft);
      const clampedTop = clamp(candidate.top, margin, maxTop);

      const overlap = overlapArea(
        {left: clampedLeft, top: clampedTop, width: popoverWidth, height: popoverHeight},
        zoneRect,
      );
      const clampShift = Math.abs(clampedLeft - candidate.left) + Math.abs(clampedTop - candidate.top);
      const anchorDistance = Math.hypot(clampedLeft + popoverWidth / 2 - anchorX, clampedTop + popoverHeight / 2 - anchorY);
      return {
        left: clampedLeft,
        top: clampedTop,
        overlap,
        score: overlap * 10000 + clampShift * 4 + anchorDistance,
      };
    });

    const zeroOverlapCandidates = scoredCandidates.filter((candidate) => candidate.overlap === 0);
    const rankedCandidates = zeroOverlapCandidates.length ? zeroOverlapCandidates : scoredCandidates;
    const bestPosition = rankedCandidates.reduce((best, candidate) => (candidate.score < best.score ? candidate : best));

    setPopoverPosition({left: bestPosition.left, top: bestPosition.top});
  }, [currentStep, isActive]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (!isActive) {
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        handleExitToIntro();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleExitToIntro, handleNext, handlePrevious, isActive]);

  useEffect(() => {
    if (!isActive) {
      setPopoverPosition(null);
      return;
    }

    const navigationBehavior = pendingScrollBehaviorRef.current;
    pendingScrollBehaviorRef.current = 'auto';
    computePopoverPosition();
    let ensureRafId = 0;
    const computeRafId = window.requestAnimationFrame(() => {
      computePopoverPosition();
      ensureRafId = window.requestAnimationFrame(() => {
        ensureActiveStepInView(navigationBehavior);
      });
    });

    return () => {
      window.cancelAnimationFrame(computeRafId);
      window.cancelAnimationFrame(ensureRafId);
    };
  }, [computePopoverPosition, ensureActiveStepInView, isActive, stepIndex]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const onResize = () => {
      computePopoverPosition();
      window.requestAnimationFrame(() => {
        ensureActiveStepInView('auto');
      });
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [computePopoverPosition, ensureActiveStepInView, isActive]);

  useEffect(() => {
    if (!isActive || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      computePopoverPosition();
    });

    if (popoverRef.current) {
      observer.observe(popoverRef.current);
    }
    if (stageRef.current) {
      observer.observe(stageRef.current);
    }
    if (imageViewportRef.current) {
      observer.observe(imageViewportRef.current);
    }
    if (mobileDetailsRef.current) {
      observer.observe(mobileDetailsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [computePopoverPosition, ensureActiveStepInView, isActive, stepIndex]);

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const navigationBehavior = pendingScrollBehaviorRef.current;
    pendingScrollBehaviorRef.current = 'auto';
    let rafId = 0;

    rafId = window.requestAnimationFrame(() => {
      scrollToTourTop(navigationBehavior);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isComplete, scrollToTourTop]);

  const popoverStyle =
    currentStep && popoverPosition
      ? {top: `${popoverPosition.top}px`, left: `${popoverPosition.left}px`}
      : currentStep
        ? {top: `${currentStep.popover.top}%`, left: `${currentStep.popover.left}%`}
        : undefined;

  return (
    <div className={styles.page} data-tour-page="interactive-tour">
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>Пошаговый тур SmartPlayer</span>
          <h1>Интерактивный визуальный тур по пошаговому старту</h1>
          <p>
            Тур проводит по 9 ключевым экранам SmartPlayer: от входа и устройств до публикации и проверки результата.
            На каждом шаге показывается нужная зона интерфейса и короткое пояснение, чтобы быстро собрать общую картину
            первого запуска.
          </p>
        </div>
        <aside className={styles.heroGuide}>
          <h2>Что внутри тура</h2>
          <ul className={styles.heroGuideList}>
            <li>9 шагов по реальным экранам SmartPlayer без перехода между разделами.</li>
            <li>На десктопе пояснение идёт рядом с подсвеченной зоной, на мобильных — под скриншотом.</li>
            <li className={styles.desktopGuideItem}>
              Горячие клавиши: <kbd className={styles.keycap}>→</kbd> следующий шаг,{' '}
              <kbd className={styles.keycap}>←</kbd> предыдущий, <kbd className={styles.keycap}>Esc</kbd> выход во
              вступление.
            </li>
            <li className={styles.mobileGuideHint}>
              После тура можно перейти в пошаговый старт и уже затем сверить запуск по чек-листу.
            </li>
          </ul>
        </aside>
      </section>

      <section className={styles.tourShell} ref={stageRef}>
        {isActive || isComplete ? (
          <div className={styles.progressHeader}>
            <div className={styles.progressMeta}>
              <span className={styles.progressEyebrow}>Прогресс тура</span>
              <strong>{isComplete ? 'Завершено' : `Шаг ${stepIndex + 1} из ${steps.length}`}</strong>
            </div>
            <div aria-hidden="true" className={styles.progressTrack}>
              <div className={styles.progressBar} style={{width: `${progressValue}%`}} />
            </div>
            <div className={styles.stepRailWrap}>
              <div aria-label="Шаги интерактивного тура" className={styles.stepRail}>
                {steps.map((step, index) => {
                  const isCurrent = isActive && index === stepIndex;
                  const isReached = isComplete || index < stepIndex;
                  const state = isCurrent ? 'current' : isReached ? 'reached' : 'upcoming';

                  return (
                    <button
                      aria-current={isCurrent ? 'step' : undefined}
                      className={styles.stepChip}
                      data-step-state={state}
                      disabled={!isActive}
                      key={step.id}
                      onClick={() => handleStepJump(index)}
                      type="button">
                      <span className={styles.stepChipNumber}>{index + 1}</span>
                      <span className={styles.stepChipLabel}>{step.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {!isActive && !isComplete ? (
          <section className={styles.introCard} data-tour-state="intro">
            <span className={styles.completionEyebrow}>Старт тура</span>
            <h2>Готовы пройти маршрут пошагового старта</h2>
            <p>
              Тур покажет базовый путь: вход, устройства, контент, публикация и проверка результата. Если нужен полный
              линейный сценарий со скриншотами, откройте пошаговый старт после прохождения тура.
            </p>
            <div className={styles.introActions}>
              <button className={styles.primaryButton} data-tour-action="start" onClick={handleStart} type="button">
                Запустить тур
              </button>
              <Link className={styles.secondaryButton} to="/quickstart/">
                Пошаговый старт
              </Link>
            </div>
            <p className={styles.introSupport}>
              Чек-лист перед запуском пригодится после тура и перед пилотом:{' '}
              <Link className={styles.inlineLink} to="/checklist/">
                открыть чек-лист
              </Link>
              .
            </p>
          </section>
        ) : isComplete ? (
          <section className={styles.completionCard} data-tour-state="complete">
            <span className={styles.completionEyebrow}>Тур завершён</span>
            <h2>Вы прошли базовый тур SmartPlayer</h2>
            <p>
              Тур дал общий обзор интерфейса. Дальше лучше идти по рабочей последовательности, чтобы не потерять
              контекст первого запуска.
            </p>
            <ol className={styles.completionPath}>
              <li>
                Откройте <strong>пошаговый старт</strong> и пройдите полный линейный маршрут со скриншотами.
              </li>
              <li>
                Перед пилотом или массовым запуском сверяйте результат по <strong>чек-листу перед запуском</strong>.
              </li>
            </ol>
            <div className={styles.completionActions}>
              <Link className={styles.primaryButton} to="/quickstart/">
                Перейти к пошаговому старту
              </Link>
              <Link className={styles.secondaryButton} to="/checklist/">
                Сверить запуск по чек-листу
              </Link>
            </div>
            <p className={styles.completionSupport}>
              Нужно быстро освежить экраны тура?{' '}
              <button
                className={styles.inlineAction}
                data-tour-action="restart"
                onClick={handleRestart}
                type="button">
                Пройти ещё раз
              </button>
              .
            </p>
          </section>
        ) : currentStep ? (
          <div className={styles.tourStage} data-tour-state="active" data-tour-step-id={currentStep.id}>
            <div className={styles.stageFrame}>
              <div className={styles.stageFrameBar}>
                <span className={styles.stageDot} />
                <span className={styles.stageDot} />
                <span className={styles.stageDot} />
                <span className={styles.stageFrameLabel}>Реальный экран SmartPlayer</span>
              </div>

              <div className={styles.imageViewport} ref={imageViewportRef}>
                <img alt={currentStep.imageAlt} className={`${styles.stageImage} ${styles.stageImageMuted}`} src={currentStep.image} />
                <FocusWindow image={currentStep.image} zone={currentStep.zone} />
                <FocusMask zone={currentStep.zone} />
                <HighlightZone onClick={handleNext} title={currentStep.title} zone={currentStep.zone} />

                <aside className={styles.popover} data-tour-popover="true" ref={popoverRef} style={popoverStyle}>
                  <span className={styles.popoverStep} data-tour-progress="true">{`Шаг ${stepIndex + 1} из ${steps.length}`}</span>
                  <h2 data-tour-step-title="true">{currentStep.title}</h2>
                  <p className={styles.popoverText}>{currentStep.description}</p>
                  <div className={styles.popoverActions}>
                    <button
                      className={styles.secondaryButton}
                      data-tour-action="previous"
                      disabled={stepIndex === 0}
                      onClick={handlePrevious}
                      type="button">
                      ← Назад
                    </button>
                    <button className={styles.primaryButton} data-tour-action="next" onClick={handleNext} type="button">
                      Далее →
                    </button>
                    <button className={styles.secondaryButton} data-tour-action="exit" onClick={handleExitToIntro} type="button">
                      Выйти из тура
                    </button>
                  </div>
                </aside>
              </div>

              <div
                aria-live="polite"
                className={styles.mobileDetails}
                data-tour-mobile-details="true"
                ref={mobileDetailsRef}>
                <span className={styles.popoverStep} data-tour-progress="true">{`Шаг ${stepIndex + 1} из ${steps.length}`}</span>
                <h2 data-tour-step-title="true">{currentStep.title}</h2>
                <p className={styles.popoverText}>{currentStep.description}</p>
                <div className={styles.mobileActions}>
                  <button
                    className={styles.secondaryButton}
                    data-tour-action="previous"
                    disabled={stepIndex === 0}
                    onClick={handlePrevious}
                    type="button">
                    ← Назад
                  </button>
                  <button className={styles.primaryButton} data-tour-action="next" onClick={handleNext} type="button">
                    Далее →
                  </button>
                  <button className={styles.secondaryButton} data-tour-action="exit" onClick={handleExitToIntro} type="button">
                    Выйти из тура
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.stageFooter}>
              <p className={styles.footerNote}>
                Сейчас отображается шаг: <strong>{currentStep.title}</strong>
              </p>
              <div className={styles.footerLinks}>
                <Link className={styles.quickstartLink} to="/quickstart/">
                  Пошаговый старт
                </Link>
                <Link className={styles.quickstartLink} to="/checklist/">
                  Сверить запуск по чек-листу
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
