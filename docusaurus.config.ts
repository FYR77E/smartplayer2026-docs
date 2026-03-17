import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'SmartPlayer — Документация',
  tagline: 'Актуальное руководство по запуску, контенту и эксплуатации SmartPlayer',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://smartplayer2026-docs.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&display=swap',
      type: 'text/css',
    },
  ],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'FYR77E',
  projectName: 'smartplayer2026-docs',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: 'filename',
        docsRouteBasePath: '/',
        indexBlog: false,
        indexPages: true,
        language: ['ru', 'en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchResultLimits: 8,
        searchBarShortcut: true,
        searchBarShortcutKeymap: 'mod+k',
        searchBarPosition: 'right',
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'SmartPlayer',
      logo: {
        alt: 'SmartPlayer',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'manualSidebar',
          position: 'left',
          label: 'Документация',
        },
        {
          to: '/quickstart/',
          label: 'Быстрый старт',
          position: 'left',
        },
        {
          to: '/generated/17-13-чек-лист-запуска',
          label: 'Чек-лист запуска',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
        {href: 'https://wiki.smartplayer.org', label: 'База знаний', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Старт',
          items: [
            {label: 'Полное руководство', to: '/generated/smartplayer-руководство'},
            {label: 'Быстрый старт', to: '/generated/быстрый-старт'},
            {label: 'Чек-лист запуска', to: '/generated/17-13-чек-лист-запуска'},
          ],
        },
        {
          title: 'Эксплуатация',
          items: [
            {label: 'Мониторинг и устройства', to: '/generated/09-4-разделы-мониторинга-и-устройств'},
            {label: 'Контент и трансляции', to: '/generated/10-5-работа-с-контентом'},
            {label: 'Типовые ошибки', to: '/generated/16-12-типовые-ошибки-и-решения'},
          ],
        },
        {
          title: 'Ссылки',
          items: [
            {
              label: 'База знаний',
              href: 'https://wiki.smartplayer.org',
            },
            {
              label: 'Техподдержка',
              href: 'https://smartplayer.atlassian.net/servicedesk/customer/portals',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} SmartPlayer`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
