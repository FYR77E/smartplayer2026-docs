import {useEffect, useRef, useState} from 'react';
import {driver} from 'driver.js';
import type {DriveStep, Driver} from 'driver.js';
import 'driver.js/dist/driver.css';

type UseDriverTourOptions = {
  onDestroyed?: () => void;
};

function scrollElementIntoFocus(element?: Element) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  });
}

export function useDriverTour(steps: DriveStep[], options: UseDriverTourOptions = {}) {
  const driverRef = useRef<Driver | null>(null);
  const stepsRef = useRef(steps);
  const onDestroyedRef = useRef(options.onDestroyed);
  const isUnmountingRef = useRef(false);
  const [isTourActive, setIsTourActive] = useState(false);

  useEffect(() => {
    stepsRef.current = steps;
    driverRef.current?.setSteps(steps);
  }, [steps]);

  useEffect(() => {
    onDestroyedRef.current = options.onDestroyed;
  }, [options.onDestroyed]);

  useEffect(() => {
    const driverObj = driver({
      animate: true,
      smoothScroll: true,
      showProgress: true,
      progressText: 'Шаг {{current}} из {{total}}',
      showButtons: ['previous', 'next', 'close'],
      allowClose: true,
      overlayClickBehavior: () => undefined,
      disableActiveInteraction: true,
      allowKeyboardControl: false,
      overlayColor: '#080605',
      overlayOpacity: 0.72,
      stagePadding: 14,
      stageRadius: 18,
      popoverOffset: 18,
      popoverClass: 'smartplayer-tour-popover',
      nextBtnText: 'Далее',
      prevBtnText: 'Назад',
      doneBtnText: 'Завершить тур',
      onPopoverRender: (popover, {driver}) => {
        popover.closeButton.setAttribute('aria-label', 'Закрыть тур');
        popover.closeButton.setAttribute('title', 'Закрыть тур');
        popover.previousButton.textContent = driver.isFirstStep() ? 'Назад' : '← Назад';
        popover.nextButton.textContent = driver.isLastStep() ? 'Завершить тур' : 'Далее →';
      },
      onHighlightStarted: (element) => {
        setIsTourActive(true);
        scrollElementIntoFocus(element);
      },
      onHighlighted: (element) => {
        scrollElementIntoFocus(element);
      },
      onDestroyed: () => {
        setIsTourActive(false);

        if (!isUnmountingRef.current) {
          onDestroyedRef.current?.();
        }
      },
      steps: stepsRef.current,
    });

    driverRef.current = driverObj;

    return () => {
      isUnmountingRef.current = true;
      setIsTourActive(false);
      driverObj.destroy();
      driverRef.current = null;
    };
  }, []);

  const startTour = () => {
    const driverObj = driverRef.current;

    if (!driverObj) {
      return;
    }

    if (driverObj.isActive()) {
      driverObj.destroy();
    }

    driverObj.setSteps(stepsRef.current);
    driverObj.drive();
  };

  return {startTour, isTourActive};
}
