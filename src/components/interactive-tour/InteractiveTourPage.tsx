import {useEffect, useMemo, useRef, useState} from 'react';
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

const TOUR_STEPS: TourStep[] = [
  {
    id: 'login',
    title: 'Вход в личный кабинет',
    image: 'Авторизация.webp',
    imageAlt: 'Экран авторизации SmartPlayer',
    zone: {top: 30, left: 25, width: 50, height: 35},
    popover: {top: 66, left: 62},
    description: 'Введите e-mail и пароль. Для восстановления доступа нажмите «Не получается войти?».',
  },
  {
    id: 'dashboard',
    title: 'Обзор Dashboard',
    image: 'ЛК - Обзор (5).webp',
    imageAlt: 'Личный кабинет SmartPlayer, обзор',
    zone: {top: 10, left: 0, width: 25, height: 80},
    popover: {top: 17, left: 40},
    description:
      'Левое меню — основная навигация. Отсюда доступны все разделы: устройства, контент, трансляции.',
  },
  {
    id: 'devices',
    title: 'Раздел «Устройства»',
    image: 'ЛК - Устройства.webp',
    imageAlt: 'Раздел Устройства в SmartPlayer',
    zone: {top: 15, left: 5, width: 90, height: 60},
    popover: {top: 77, left: 60},
    description: 'Список устройств с цветовыми статусами: зелёный — онлайн, серый — офлайн, красный — ошибка.',
  },
  {
    id: 'add-device',
    title: 'Добавление устройства',
    image: 'Добавление устройства-20260226.webp',
    imageAlt: 'Диалог добавления устройства в SmartPlayer',
    zone: {top: 20, left: 30, width: 45, height: 50},
    popover: {top: 75, left: 56},
    description: 'Введите 9-значный код с экрана устройства. Укажите название, местоположение и часовой пояс.',
  },
  {
    id: 'content',
    title: 'Раздел «Контент»',
    image: 'Контент.webp',
    imageAlt: 'Раздел Контент в SmartPlayer',
    zone: {top: 10, left: 5, width: 90, height: 75},
    popover: {top: 79, left: 61},
    description: 'Медиатека проекта. Загружайте файлы через Drag & Drop или выбором из проводника.',
  },
  {
    id: 'quick-send',
    title: 'Быстрая отправка: шаг 1',
    image: 'Быстрая отправка - шаг 1-20260226.webp',
    imageAlt: 'Быстрая отправка, первый шаг',
    zone: {top: 5, left: 5, width: 65, height: 80},
    popover: {top: 13, left: 79},
    description:
      'Перетащите файлы из правой панели в рабочую зону. Timeline покажет порядок воспроизведения.',
  },
  {
    id: 'targets',
    title: 'Выбор устройств',
    image: 'шаг 2.webp',
    imageAlt: 'Выбор устройств в сценарии быстрой отправки',
    zone: {top: 15, left: 10, width: 80, height: 60},
    popover: {top: 79, left: 56},
    description: 'Выберите устройства или группы, на которые отправится трансляция. Нажмите «Далее».',
  },
  {
    id: 'schedule',
    title: 'Расписание трансляции',
    image: 'шаг 3.webp',
    imageAlt: 'Расписание трансляции в SmartPlayer',
    zone: {top: 15, left: 10, width: 80, height: 65},
    popover: {top: 81, left: 56},
    description: 'Установите дату, время и повторение. Приоритет у новых трансляций по умолчанию — низкий.',
  },
  {
    id: 'device-card',
    title: 'Карточка устройства',
    image: 'ЛК - меню устройства-20260226.webp',
    imageAlt: 'Карточка устройства в SmartPlayer',
    zone: {top: 20, left: 20, width: 60, height: 55},
    popover: {top: 80, left: 56},
    description:
      'После запуска проверяйте устройства: скриншот, статус, перезагрузка и управление громкостью.',
  },
];

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
  const [stepIndex, setStepIndex] = useState(0);

  const normalizedBaseUrl = siteConfig.baseUrl.endsWith('/') ? siteConfig.baseUrl : `${siteConfig.baseUrl}/`;

  const steps = useMemo(
    () =>
      TOUR_STEPS.map((step) => ({
        ...step,
        image: `${normalizedBaseUrl}quickstart-site/image/png/${encodeURI(step.image)}`,
      })),
    [normalizedBaseUrl],
  );

  const isComplete = stepIndex >= steps.length;
  const currentStep = isComplete ? null : steps[stepIndex];
  const progressValue = isComplete ? 100 : ((stepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    stageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [stepIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setStepIndex((current) => Math.min(current + 1, steps.length));
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setStepIndex((current) => Math.max(current - 1, 0));
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setStepIndex(steps.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [steps.length]);

  const handleNext = () => {
    setStepIndex((current) => Math.min(current + 1, steps.length));
  };

  const handlePrevious = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const handleRestart = () => {
    setStepIndex(0);
  };

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
            <li>Используйте кнопки «← Назад» и «Далее →» в popover рядом с подсвеченной зоной.</li>
            <li>Клик по выделенной области на скриншоте тоже переводит к следующему шагу.</li>
            <li>Горячие клавиши: `ArrowRight` — следующий шаг, `ArrowLeft` — предыдущий, `Escape` — завершить тур.</li>
            <li>Все экраны в туре — реальные изображения из `/quickstart-site/image/png`.</li>
          </ul>
        </aside>
      </section>

      <section className={styles.tourShell} ref={stageRef}>
        <div className={styles.progressHeader}>
          <div className={styles.progressMeta}>
            <span className={styles.progressEyebrow}>Прогресс тура</span>
            <strong>{isComplete ? 'Завершено' : `Шаг ${stepIndex + 1} из ${steps.length}`}</strong>
          </div>
          <div aria-hidden="true" className={styles.progressTrack}>
            <div className={styles.progressBar} style={{width: `${progressValue}%`}} />
          </div>
        </div>

        {isComplete ? (
          <section className={styles.completionCard}>
            <span className={styles.completionEyebrow}>Тур завершён</span>
            <h2>Вы прошли базовый тур SmartPlayer</h2>
            <p>Теперь можно повторить walkthrough или перейти к полному сценарию в разделе Быстрый старт.</p>
            <div className={styles.completionActions}>
              <button className={styles.primaryButton} onClick={handleRestart} type="button">
                Пройти ещё раз
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

              <div className={styles.imageViewport}>
                <img alt={currentStep.imageAlt} className={styles.stageImage} src={currentStep.image} />
                <HighlightZone onClick={handleNext} title={currentStep.title} zone={currentStep.zone} />

                <aside
                  className={styles.popover}
                  style={{
                    top: `${currentStep.popover.top}%`,
                    left: `${currentStep.popover.left}%`,
                  }}>
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
                  </div>
                </aside>
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
