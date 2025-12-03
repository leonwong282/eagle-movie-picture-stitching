---
sidebar_position: 1
title: Introduction
description: A modern React + TypeScript template for building Eagle desktop plugin extensions
---

# Introduction

Welcome to **Eagle React Template** — a modern, feature-rich template for building professional Eagle desktop plugin extensions with React and TypeScript.

## What is Eagle?

[Eagle](https://eagle.cool) is a powerful desktop application for organizing and managing creative assets like images, videos, fonts, and design files. It provides a **Plugin API** that allows developers to extend its functionality with custom plugins.

## What is Eagle React Template?

This template provides everything you need to build production-ready Eagle plugins:

- **Modern Tech Stack** — React 18, TypeScript 5, Vite 5, Tailwind CSS
- **Dual Environment** — Develop in browser with mock data, deploy to Eagle seamlessly
- **Component Library** — 18 ready-to-use UI components with dark mode support
- **Type Safety** — Complete Eagle API type definitions
- **Best Practices** — 1,040+ unit tests, ESLint, Prettier, CI/CD

## Why This Template?

Eagle's official Plugin API is powerful but low-level. It doesn't include:

- ❌ React component library
- ❌ Browser-based development workflow
- ❌ Mock API for testing without Eagle
- ❌ TypeScript type definitions
- ❌ Build tooling for modern JavaScript

**Eagle React Template fills these gaps**, providing:

- ✅ **18 UI components** with CVA variants (Button, Card, Dialog, Toast, etc.)
- ✅ **Browser development** with hot reload and mock Eagle API
- ✅ **Complete TypeScript types** for the entire Eagle Plugin API
- ✅ **Production build system** with one-command deployment
- ✅ **5 plugin templates** for common layouts (SinglePanel, SplitPanel, BatchProcess, etc.)

## Key Features

### 🎨 Component Library

Pre-built, accessible components that match Eagle's design language:

```tsx
import { Button, Card, Toast, Dialog } from '@/components';

<Button variant="primary" isLoading>
  Processing...
</Button>
```

### 🔌 Eagle API Adapter

Type-safe wrapper that works in both browser and Eagle:

```tsx
import { eagleApi } from '@/lib/eagle-api';

// Works in browser (mock) and Eagle (real API)
const items = await eagleApi.getSelectedItems();
const isDark = eagleApi.isDarkMode;
```

### 🌐 8-Language i18n

Built-in internationalization with Eagle locale detection:

- English (en)
- Simplified Chinese (zh_CN)
- Traditional Chinese (zh_TW)
- Japanese (ja_JP)
- Korean (ko_KR)
- German (de_DE)
- Spanish (es_ES)
- Russian (ru_RU)

### 🧪 Comprehensive Testing

1,040+ unit tests with Vitest and React Testing Library:

```bash
npm run test           # Run all tests
npm run test:coverage  # With coverage report
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Your React App                          │
├─────────────────────────────────────────────────────────────┤
│                   EagleAPIAdapter                           │
│         (src/lib/eagle-api.ts - singleton)                  │
├─────────────────┬───────────────────────────────────────────┤
│   Browser Dev   │              Eagle Runtime                │
│  (npm run dev)  │           (deployed plugin)               │
├─────────────────┼───────────────────────────────────────────┤
│  Mock Eagle API │           window.eagle                    │
│  (fake data)    │        (real Eagle API)                   │
└─────────────────┴───────────────────────────────────────────┘
```

The template's **dual environment pattern** lets you:

1. **Develop in browser** — Fast hot reload, DevTools, no Eagle required
2. **Test with mock data** — Configurable mock items, folders, themes
3. **Deploy to Eagle** — One command, zero configuration changes

## What's Included

| Category | Contents |
|----------|----------|
| **Components** | Button, Card, Dialog, Toast, Header, Form controls, ImageGrid |
| **Hooks** | useEagleSelection, useTheme, useLocalStorage, useLanguageSync |
| **Templates** | SinglePanel, SplitPanel, Settings, BatchProcess, ImageBrowser |
| **Utilities** | Eagle API adapter, Mock factory, i18n, Storage, Canvas utils |
| **State** | Zustand store with slices and persistence |
| **Testing** | Vitest, React Testing Library, Playwright for E2E |

## Next Steps

Ready to build your first Eagle plugin?

1. **[Installation](./installation)** — Set up your development environment
2. **[Quick Start](./quick-start)** — Create and deploy your first plugin
3. **[Project Structure](./project-structure)** — Understand the codebase

Or dive into specific topics:

- **[Core Concepts](/docs/core-concepts/dual-environment)** — Understand the architecture
- **[Components](/docs/components/overview)** — Explore the UI library
- **[Eagle API](/docs/eagle-api/overview)** — Learn the API wrapper
