// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    // ==========================================
    // 🚀 Getting Started
    // ==========================================
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/project-structure',
      ],
    },
    // ==========================================
    // 🧠 Core Concepts
    // ==========================================
    {
      type: 'category',
      label: '🧠 Core Concepts',
      collapsed: false,
      items: [
        'core-concepts/dual-environment',
        'core-concepts/eagle-api-adapter',
        'core-concepts/mock-system',
        'core-concepts/theme-i18n',
      ],
    },
    // ==========================================
    // 🎨 Components
    // ==========================================
    {
      type: 'category',
      label: '🎨 Components',
      collapsed: false,
      items: [
        'components/overview',
        {
          type: 'category',
          label: 'UI',
          items: [
            'components/ui/button',
            'components/ui/card',
            'components/ui/header',
            'components/ui/toast',
          ],
        },
        {
          type: 'category',
          label: 'Form',
          items: [
            'components/form/input',
            'components/form/label',
            'components/form/select',
            'components/form/checkbox',
            'components/form/slider',
          ],
        },
        {
          type: 'category',
          label: 'Overlay',
          items: [
            'components/overlay/dialog',
            'components/overlay/dropdown-menu',
            'components/overlay/tooltip',
            'components/overlay/popover',
          ],
        },
        {
          type: 'category',
          label: 'Layout',
          items: [
            'components/layout/tabs',
            'components/layout/image-grid',
            'components/layout/eagle-image',
          ],
        },
        {
          type: 'category',
          label: 'Error Handling',
          items: ['components/error/error-boundary', 'components/error/error-fallback'],
        },
      ],
    },
    // ==========================================
    // 🪝 Hooks
    // ==========================================
    {
      type: 'category',
      label: '🪝 Hooks',
      collapsed: false,
      items: [
        'hooks/overview',
        'hooks/use-eagle-selection',
        'hooks/use-theme',
        'hooks/use-local-storage',
        'hooks/use-language-sync',
      ],
    },
    // ==========================================
    // 📐 Templates
    // ==========================================
    {
      type: 'category',
      label: '📐 Templates',
      collapsed: false,
      items: [
        'templates/overview',
        'templates/single-panel',
        'templates/split-panel',
        'templates/settings-panel',
        'templates/batch-process',
        'templates/image-browser',
        'templates/three-column',
      ],
    },
    // ==========================================
    // 🔌 Eagle API
    // ==========================================
    {
      type: 'category',
      label: '🔌 Eagle API',
      collapsed: false,
      items: [
        'eagle-api/overview',
        'eagle-api/item-operations',
        'eagle-api/folder-operations',
        'eagle-api/tag-operations',
        'eagle-api/window-controls',
        'eagle-api/dialogs',
        'eagle-api/clipboard',
        'eagle-api/notifications',
        'eagle-api/events-lifecycle',
        'eagle-api/logging',
      ],
    },
    // ==========================================
    // 🗃️ State Management
    // ==========================================
    {
      type: 'category',
      label: '🗃️ State Management',
      collapsed: false,
      items: ['state/overview', 'state/slices', 'state/selectors', 'state/persistence'],
    },
    // ==========================================
    // 🎨 Styling
    // ==========================================
    {
      type: 'category',
      label: '🎨 Styling',
      collapsed: false,
      items: [
        'styling/overview',
        'styling/design-tokens',
        'styling/dark-mode',
        'styling/animations',
      ],
    },
    // ==========================================
    // 🌍 Internationalization
    // ==========================================
    {
      type: 'category',
      label: '🌍 Internationalization',
      collapsed: false,
      items: ['i18n/overview', 'i18n/language-detection', 'i18n/translation-files'],
    },
    // ==========================================
    // 🛠️ Development
    // ==========================================
    {
      type: 'category',
      label: '🛠️ Development',
      collapsed: false,
      items: [
        'development/workflow',
        'development/browser-dev',
        'development/eagle-watch',
        'development/debugging',
        'development/build-config',
      ],
    },
    // ==========================================
    // 🧪 Testing
    // ==========================================
    {
      type: 'category',
      label: '🧪 Testing',
      collapsed: false,
      items: [
        'testing/overview',
        'testing/unit-testing',
        'testing/component-testing',
        'testing/hook-testing',
        'testing/e2e-testing',
      ],
    },
    // ==========================================
    // 🚢 Deployment
    // ==========================================
    {
      type: 'category',
      label: '🚢 Deployment',
      collapsed: false,
      items: ['deployment/deploy-script', 'deployment/manifest-config', 'deployment/ci-cd'],
    },
    // ==========================================
    // 📖 Reference
    // ==========================================
    {
      type: 'category',
      label: '📖 Reference',
      items: [
        'reference/type-definitions',
        'reference/known-limitations',
        'reference/migration-guide',
        'reference/changelog',
        'reference/contributing',
      ],
    },
    // ==========================================
    // 👥 Community
    // ==========================================
    {
      type: 'category',
      label: '👥 Community',
      items: ['community/code-of-conduct', 'community/security'],
    },
  ],
};

export default sidebars;
