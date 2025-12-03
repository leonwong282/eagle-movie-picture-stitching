// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Eagle React Template',
  tagline: 'Modern React + TypeScript template for building Eagle desktop plugin extensions',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://leonwong282.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/eagle-react-template/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'leonwong282', // Usually your GitHub org/user name.
  projectName: 'eagle-react-template', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Enable Mermaid diagrams in Markdown
  markdown: {
    mermaid: true,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-TW'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      'zh-TW': {
        label: '繁體中文',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/leonwong282/eagle-react-template/tree/main/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  // Local search plugin (works offline, no external service needed)
  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'zh'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/docs',
        indexBlog: false,
      },
    ],
  ],

  // SEO and social sharing metadata
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'eagle, eagle plugin, react, typescript, vite, tailwind, plugin development, desktop app, eagle api',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
  ],

  // PWA plugin for offline support and installable app
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/logo.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#238636',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#238636',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/logo.png',
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Social card for link previews (1200x630 recommended)
      image: 'img/social-card.svg',
      navbar: {
        title: 'Eagle React Template',
        logo: {
          alt: 'Eagle React Template Logo',
          src: 'img/logo.png',
          srcDark: 'img/logo-dark.svg',
          href: '/',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/docs/eagle-api/overview',
            position: 'left',
            label: 'API',
          },
          {
            to: '/docs/components/overview',
            position: 'left',
            label: 'Components',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/leonwong282/eagle-react-template',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Getting Started',
            items: [
              {
                label: 'Introduction',
                to: '/docs/getting-started/introduction',
              },
              {
                label: 'Quick Start',
                to: '/docs/getting-started/quick-start',
              },
              {
                label: 'Project Structure',
                to: '/docs/getting-started/project-structure',
              },
            ],
          },
          {
            title: 'Learn',
            items: [
              {
                label: 'Core Concepts',
                to: '/docs/core-concepts/dual-environment',
              },
              {
                label: 'Components',
                to: '/docs/components/overview',
              },
              {
                label: 'Eagle API',
                to: '/docs/eagle-api/overview',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/leonwong282/eagle-react-template',
              },
              {
                label: 'Issues',
                href: 'https://github.com/leonwong282/eagle-react-template/issues',
              },
              {
                label: 'Discussions',
                href: 'https://github.com/leonwong282/eagle-react-template/discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Eagle Official',
                href: 'https://eagle.cool',
              },
              {
                label: 'Eagle Plugin API',
                href: 'https://developer.eagle.cool',
              },
              {
                label: 'Contributing',
                to: '/docs/reference/contributing',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Eagle React Template. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          'bash',
          'yaml',
          'json',
          'typescript',
          'javascript',
          'tsx',
          'jsx',
          'css',
          'shell-session',
        ],
      },
      // Announcement bar (optional)
      announcementBar: {
        id: 'star_us',
        content:
          '⭐ Build beautiful Eagle plugins with React! Give us a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/leonwong282/eagle-react-template">GitHub</a>',
        backgroundColor: '#238636',
        textColor: '#ffffff',
        isCloseable: true,
      },
      // Table of contents
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      // Color mode
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

export default config;
