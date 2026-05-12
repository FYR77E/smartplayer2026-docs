import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'SmartPlayer \u2014 \u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f',
  tagline:
    '\u0410\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u043e\u0435 \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u043e \u043f\u043e \u0437\u0430\u043f\u0443\u0441\u043a\u0443, \u043a\u043e\u043d\u0442\u0435\u043d\u0442\u0443 \u0438 \u044d\u043a\u0441\u043f\u043b\u0443\u0430\u0442\u0430\u0446\u0438\u0438 SmartPlayer',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  // Both Vercel (root /) and GitHub Pages (/smartplayer2026-docs/) deploy from
  // the same repo — env vars let each target inject the right base.
  url: process.env.SITE_URL || 'https://smartplayer2026-docs.vercel.app',
  baseUrl: process.env.BASE_URL || '/',
  // preconnect to font CDN so DNS+TLS handshake happens in parallel with
  // HTML parsing — knocks ~200-400ms off FCP/LCP on cold connections.
  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'},
    },
  ],
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
          exclude: ['**/README.md', '**/AGENTS.md'],
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
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'manualSidebar',
          position: 'left',
          label: '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f',
        },
        {
          to: '/quickstart/',
          label: '\u041f\u043e\u0448\u0430\u0433\u043e\u0432\u044b\u0439 \u0441\u0442\u0430\u0440\u0442',
          position: 'left',
        },
        {
          to: '/interactive-tour/',
          label: '\u0418\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0439 \u0442\u0443\u0440',
          position: 'left',
        },
        {
          to: '/checklist/',
          label: '\u0427\u0435\u043a-\u043b\u0438\u0441\u0442 \u043f\u0435\u0440\u0435\u0434 \u0437\u0430\u043f\u0443\u0441\u043a\u043e\u043c',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://wiki.smartplayer.org',
          label: '\u0411\u0430\u0437\u0430 \u0437\u043d\u0430\u043d\u0438\u0439',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '\u0421\u0442\u0430\u0440\u0442',
          items: [
            {
              label: '\u041f\u043e\u043b\u043d\u043e\u0435 \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u043e',
              to: '/generated/smartplayer-\u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u043e',
            },
            {
              label: '\u041f\u043e\u0448\u0430\u0433\u043e\u0432\u044b\u0439 \u0441\u0442\u0430\u0440\u0442',
              to: '/quickstart/',
            },
            {
              label: '\u0418\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0439 \u0442\u0443\u0440',
              to: '/interactive-tour/',
            },
            {
              label: '\u0427\u0435\u043a-\u043b\u0438\u0441\u0442 \u043f\u0435\u0440\u0435\u0434 \u0437\u0430\u043f\u0443\u0441\u043a\u043e\u043c',
              to: '/checklist/',
            },
          ],
        },
        {
          title: '\u042d\u043a\u0441\u043f\u043b\u0443\u0430\u0442\u0430\u0446\u0438\u044f',
          items: [
            {
              label: '\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u0438 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430',
              to: '/generated/09-4-\u0440\u0430\u0437\u0434\u0435\u043b\u044b-\u043c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433\u0430-\u0438-\u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432',
            },
            {
              label: '\u041a\u043e\u043d\u0442\u0435\u043d\u0442 \u0438 \u0442\u0440\u0430\u043d\u0441\u043b\u044f\u0446\u0438\u0438',
              to: '/generated/10-5-\u0440\u0430\u0431\u043e\u0442\u0430-\u0441-\u043a\u043e\u043d\u0442\u0435\u043d\u0442\u043e\u043c',
            },
            {
              label: '\u0422\u0438\u043f\u043e\u0432\u044b\u0435 \u043e\u0448\u0438\u0431\u043a\u0438',
              to: '/generated/16-12-\u0442\u0438\u043f\u043e\u0432\u044b\u0435-\u043e\u0448\u0438\u0431\u043a\u0438-\u0438-\u0440\u0435\u0448\u0435\u043d\u0438\u044f',
            },
          ],
        },
        {
          title: '\u0421\u0441\u044b\u043b\u043a\u0438',
          items: [
            {
              label: '\u0411\u0430\u0437\u0430 \u0437\u043d\u0430\u043d\u0438\u0439',
              href: 'https://wiki.smartplayer.org',
            },
            {
              label: '\u0422\u0435\u0445\u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430',
              href: 'https://smartplayer.atlassian.net/servicedesk/customer/portals',
            },
          ],
        },
      ],
      copyright: `\u00A9 ${new Date().getFullYear()} SmartPlayer`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
