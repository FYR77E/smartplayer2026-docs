import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  manualSidebar: [
    {
      type: 'category',
      label: 'Старт и ориентация',
      link: {
        type: 'generated-index',
        title: 'Старт и ориентация',
        description: 'Краткий вход в документацию SmartPlayer: обзор, быстрый старт, чек-лист и история изменений.',
      },
      items: [
        'generated/smartplayer-руководство',
        'generated/руководство-пользователя',
        'generated/быстрый-старт',
        'generated/17-13-чек-лист-запуска',
        'generated/история-изменений',
        'generated/оглавление',
      ],
    },
    {
      type: 'category',
      label: 'Платформа и запуск',
      link: {
        type: 'generated-index',
        title: 'Платформа и запуск',
        description: 'Архитектура решения, сценарии развертывания и первые действия после входа в SmartPlayer.',
      },
      items: [
        'generated/06-1-введение',
        'generated/07-2-архитектура-и-развертывание',
        'generated/08-3-начало-работы',
      ],
    },
    {
      type: 'category',
      label: 'Контент и операции',
      link: {
        type: 'generated-index',
        title: 'Контент и операции',
        description: 'Мониторинг, устройства, контент, эфирные сценарии, расписания, отчеты и администрирование.',
      },
      items: [
        'generated/09-4-разделы-мониторинга-и-устройств',
        'generated/10-5-работа-с-контентом',
        'generated/10-6-работа-с-трансляциями',
        'generated/11-7-расписания',
        'generated/12-8-отчеты',
        'generated/13-9-дополнительные-разделы',
        'generated/14-10-администрирование',
      ],
    },
    {
      type: 'category',
      label: 'Практика и поддержка',
      link: {
        type: 'generated-index',
        title: 'Практика и поддержка',
        description: 'Рекомендации по эксплуатации, устранение проблем и помощь в сопровождении платформы.',
      },
      items: [
        'generated/15-11-практические-рекомендации',
        'generated/16-12-типовые-ошибки-и-решения',
      ],
    },
  ],
};

export default sidebars;
