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
    image: 'Авторизация.webp',
    imageAlt: 'Экран авторизации SmartPlayer',
    zone: {top: 46, left: 72, width: 24, height: 26},
    popover: {top: 63, left: 60},
    description: 'В этой форме введите e-mail и пароль. Ссылка «Не получается войти?» открывает восстановление доступа.',
  },
  {
    id: 'dashboard',
    title: 'Обзор Dashboard',
    image: 'ЛК - Обзор (5).webp',
    imageAlt: 'Личный кабинет SmartPlayer, обзор',
    zone: {top: 18, left: 0.5, width: 15.5, height: 79},
    popover: {top: 20, left: 23},
    description: 'Левая колонка — основная навигация SmartPlayer. Здесь переключаются ключевые разделы: устройства, контент, трансляции и расписание.',
  },
  {
    id: 'devices',
    title: 'Раздел «Устройства»',
    image: 'ЛК - Устройства.webp',
    imageAlt: 'Раздел Устройства в SmartPlayer',
    zone: {top: 20, left: 17, width: 42, height: 40},
    popover: {top: 24, left: 67},
    description: 'В карточках устройств цветные индикаторы показывают состояние. По ним сразу видно, где устройство онлайн, офлайн или с ошибкой.',
  },
  {
    id: 'add-device',
    title: 'Добавление устройства',
    image: 'Добавление устройства-20260226.webp',
    imageAlt: 'Диалог добавления устройства в SmartPlayer',
    zone: {top: 38, left: 39.5, width: 21, height: 27},
    popover: {top: 45, left: 67},
    description: 'В модальном окне укажите 9-значный код с экрана устройства и выберите лицензию для активации.',
  },
  {
    id: 'content',
    title: 'Раздел «Контент»',
    image: 'Контент.webp',
    imageAlt: 'Раздел Контент в SmartPlayer',
    zone: {top: 20, left: 15, width: 69, height: 33},
    popover: {top: 56, left: 66},
    description: 'Это рабочая область медиатеки: вкладки типов контента и список файлов. Отсюда выбираются материалы для трансляций.',
  },
  {
    id: 'quick-send',
    title: 'Быстрая отправка: шаг 1',
    image: 'Быстрая отправка - шаг 1-20260226.webp',
    imageAlt: 'Быстрая отправка, первый шаг',
    zone: {top: 7, left: 72, width: 27.5, height: 90},
    popover: {top: 18, left: 66},
    description:
      'В правой панели выберите нужный файл и перетащите его на центральный холст. Так формируется сценарий текущей трансляции.',
  },
  {
    id: 'targets',
    title: 'Выбор устройств',
    image: 'шаг 2.webp',
    imageAlt: 'Выбор устройств в сценарии быстрой отправки',
    zone: {top: 39, left: 1.5, width: 19.5, height: 23},
    popover: {top: 34, left: 34},
    description:
      'Выберите карточку устройства до появления отметки выбора. После этого устройство попадёт в список выбранных и шаг «Далее» станет осмысленным.',
  },
  {
    id: 'schedule',
    title: 'Расписание трансляции',
    image: 'шаг 3.webp',
    imageAlt: 'Расписание трансляции в SmartPlayer',
    zone: {top: 20, left: 1.2, width: 84, height: 40},
    popover: {top: 63, left: 65},
    description:
      'Задайте даты и время начала/окончания, затем проверьте повтор и приоритет. Эти поля определяют когда и как долго будет идти трансляция.',
  },
  {
    id: 'device-card',
    title: 'Карточка устройства',
    image: 'ЛК - меню устройства-20260226.webp',
    imageAlt: 'Карточка устройства в SmartPlayer',
    zone: {top: 6, left: 84, width: 15.5, height: 29},
    popover: {top: 40, left: 70},
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
      onClick={onClick}
      style={{
        top: `${zone.top}%`,
        left: `${zone.left}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
      }}
      type="button">
      <span className={styles.highlightLabel}>Фокус шага</span>
    </button>
  );
}

export default function InteractiveTourPage() {
  const {siteConfig} = useDocusaurusContext();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imageViewportRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLElement | null>(null);
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

  const scrollToTourTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (!stageRef.current) {
      return;
    }

    const stageRect = stageRef.current.getBoundingClientRect();
    const absoluteTop = window.scrollY + stageRect.top;
    window.scrollTo({
      top: Math.max(absoluteTop - 84, 0),
      behavior,
    });
  }, []);

  const handleStart = useCallback(() => {
    setStepIndex(0);
    setMode('active');
    requestAnimationFrame(() => scrollToTourTop());
  }, [scrollToTourTop]);

  const handleExitToIntro = useCallback(() => {
    setStepIndex(0);
    setMode('intro');
    requestAnimationFrame(() => scrollToTourTop());
  }, [scrollToTourTop]);

  const handleRestart = useCallback(() => {
    setStepIndex(0);
    setMode('active');
    requestAnimationFrame(() => scrollToTourTop());
  }, [scrollToTourTop]);

  const handleNext = useCallback(() => {
    if (!isActive) {
      return;
    }
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
    setStepIndex((current) => Math.max(current - 1, 0));
  }, [isActive]);

  const ensureActiveStepInView = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      if (!isActive || !imageViewportRef.current) {
        return;
      }

      const viewportRect = imageViewportRef.current.getBoundingClientRect();
      const currentPopoverRect = popoverRef.current?.getBoundingClientRect();
      const contentTop = Math.min(viewportRect.top, currentPopoverRect?.top ?? viewportRect.top);
      const contentBottom = Math.max(viewportRect.bottom, currentPopoverRect?.bottom ?? viewportRect.bottom);

      const safeTop = 92;
      const safeBottom = window.innerHeight - 24;

      if (contentTop < safeTop) {
        window.scrollBy({
          top: contentTop - safeTop - 8,
          behavior,
        });
        return;
      }

      if (contentBottom > safeBottom) {
        window.scrollBy({
          top: contentBottom - safeBottom + 8,
          behavior,
        });
      }
    },
    [isActive],
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
    ];

    let bestPosition = {top: margin, left: margin};
    let bestScore = Number.POSITIVE_INFINITY;

    for (const candidate of candidates) {
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
      const score = overlap * 1000 + clampShift * 4 + anchorDistance;

      if (score < bestScore) {
        bestScore = score;
        bestPosition = {left: clampedLeft, top: clampedTop};
      }
    }

    setPopoverPosition(bestPosition);
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

    computePopoverPosition();
    let ensureRafId = 0;
    const computeRafId = window.requestAnimationFrame(() => {
      computePopoverPosition();
      ensureRafId = window.requestAnimationFrame(() => {
        ensureActiveStepInView();
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
    if (!isActive || !popoverRef.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      computePopoverPosition();
      ensureActiveStepInView('auto');
    });

    observer.observe(popoverRef.current);
    return () => {
      observer.disconnect();
    };
  }, [computePopoverPosition, ensureActiveStepInView, isActive, stepIndex]);

  const popoverStyle =
    currentStep && popoverPosition
      ? {top: `${popoverPosition.top}px`, left: `${popoverPosition.left}px`}
      : currentStep
        ? {top: `${currentStep.popover.top}%`, left: `${currentStep.popover.left}%`}
        : undefined;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>SmartPlayer walkthrough</span>
          <h1>Интерактивный визуальный тур по Quick Start</h1>
          <p>
            Это guided walkthrough по реальным экранам SmartPlayer из раздела Быстрый старт. На каждом шаге показывается
            конкретная зона интерфейса и короткое пояснение, чтобы быстро пройти базовый путь запуска.
          </p>
        </div>
        <aside className={styles.heroGuide}>
          <h2>Как пользоваться интерактивом</h2>
          <ul className={styles.heroGuideList}>
            <li>На десктопе используйте «← Назад» и «Далее →» в popover рядом с подсвеченной зоной.</li>
            <li>На мобильных описание и кнопки выводятся отдельным блоком под скриншотом.</li>
            <li>Горячие клавиши: `ArrowRight` — следующий шаг, `ArrowLeft` — предыдущий, `Escape` — выход в intro.</li>
            <li>Все экраны в туре — реальные изображения из `/quickstart-site/image/png`.</li>
          </ul>
        </aside>
      </section>

      <section className={styles.tourShell} ref={stageRef}>
        <div className={styles.progressHeader}>
          <div className={styles.progressMeta}>
            <span className={styles.progressEyebrow}>Прогресс тура</span>
            <strong>{isComplete ? 'Завершено' : isActive ? `Шаг ${stepIndex + 1} из ${steps.length}` : 'Введение'}</strong>
          </div>
          <div aria-hidden="true" className={styles.progressTrack}>
            <div className={styles.progressBar} style={{width: `${progressValue}%`}} />
          </div>
        </div>

        {!isActive && !isComplete ? (
          <section className={styles.introCard}>
            <span className={styles.completionEyebrow}>Старт тура</span>
            <h2>Готовы пройти маршрут Quick Start</h2>
            <p>
              Тур покажет базовый путь: авторизация, устройство, контент, публикация и проверка результата. Нажмите
              «Запустить тур», чтобы перейти к первому шагу.
            </p>
            <div className={styles.introActions}>
              <button className={styles.primaryButton} onClick={handleStart} type="button">
                Запустить тур
              </button>
              <Link className={styles.secondaryButton} to="/quickstart/">
                Открыть полный Быстрый старт
              </Link>
            </div>
          </section>
        ) : isComplete ? (
          <section className={styles.completionCard}>
            <span className={styles.completionEyebrow}>Тур завершён</span>
            <h2>Вы прошли базовый тур SmartPlayer</h2>
            <p>Теперь можно повторить walkthrough или перейти к полному сценарию в разделе Быстрый старт.</p>
            <div className={styles.completionActions}>
              <button className={styles.primaryButton} onClick={handleRestart} type="button">
                Пройти ещё раз
              </button>
              <button className={styles.secondaryButton} onClick={handleExitToIntro} type="button">
                Вернуться к вступлению
              </button>
              <Link className={styles.secondaryButton} to="/quickstart/">
                Перейти к Быстрому старту
              </Link>
            </div>
          </section>
        ) : currentStep ? (
          <div className={styles.tourStage}>
            <div className={styles.stageFrame}>
              <div className={styles.stageFrameBar}>
                <span className={styles.stageDot} />
                <span className={styles.stageDot} />
                <span className={styles.stageDot} />
                <span className={styles.stageFrameLabel}>Реальный экран SmartPlayer</span>
              </div>

              <div className={styles.imageViewport} ref={imageViewportRef}>
                <img alt={currentStep.imageAlt} className={styles.stageImage} src={currentStep.image} />
                <HighlightZone onClick={handleNext} title={currentStep.title} zone={currentStep.zone} />

                <aside className={styles.popover} ref={popoverRef} style={popoverStyle}>
                  <span className={styles.popoverStep}>{`Шаг ${stepIndex + 1} из ${steps.length}`}</span>
                  <h2>{currentStep.title}</h2>
                  <p className={styles.popoverText}>{currentStep.description}</p>
                  <div className={styles.popoverActions}>
                    <button className={styles.secondaryButton} disabled={stepIndex === 0} onClick={handlePrevious} type="button">
                      ← Назад
                    </button>
                    <button className={styles.primaryButton} onClick={handleNext} type="button">
                      Далее →
                    </button>
                    <button className={styles.secondaryButton} onClick={handleExitToIntro} type="button">
                      Выйти из тура
                    </button>
                  </div>
                </aside>
              </div>

              <div className={styles.mobileDetails}>
                <span className={styles.popoverStep}>{`Шаг ${stepIndex + 1} из ${steps.length}`}</span>
                <h2>{currentStep.title}</h2>
                <p className={styles.popoverText}>{currentStep.description}</p>
                <div className={styles.mobileActions}>
                  <button className={styles.secondaryButton} disabled={stepIndex === 0} onClick={handlePrevious} type="button">
                    ← Назад
                  </button>
                  <button className={styles.primaryButton} onClick={handleNext} type="button">
                    Далее →
                  </button>
                  <button className={styles.secondaryButton} onClick={handleExitToIntro} type="button">
                    Выйти из тура
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.stageFooter}>
              <p className={styles.footerNote}>
                Сейчас отображается шаг: <strong>{currentStep.title}</strong>
              </p>
              <Link className={styles.quickstartLink} to="/quickstart/">
                Открыть полный Быстрый старт
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
