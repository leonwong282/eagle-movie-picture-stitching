---
sidebar_position: 1
title: 簡介
description: 一個現代化的 React + TypeScript 範本，用於建立 Eagle 桌面外掛擴充功能
---

# 簡介

歡迎使用 **Eagle React 範本** — 一個現代化、功能豐富的範本，用於使用 React 和 TypeScript 建立專業的 Eagle 桌面外掛擴充功能。

## 什麼是 Eagle？

[Eagle](https://eagle.cool) 是一款功能強大的桌面應用程式，用於組織和管理創意素材，如圖片、影片、字型和設計檔案。它提供了 **外掛 API**，讓開發者可以透過自訂外掛來擴展其功能。

## 什麼是 Eagle React 範本？

這個範本提供了建立生產級 Eagle 外掛所需的一切：

- **現代技術棧** — React 18、TypeScript 5、Vite 5、Tailwind CSS
- **雙環境模式** — 在瀏覽器中使用模擬資料開發，無縫部署至 Eagle
- **元件庫** — 18 個即用型 UI 元件，支援深色模式
- **型別安全** — 完整的 Eagle API 型別定義
- **最佳實踐** — 1,040+ 單元測試、ESLint、Prettier、CI/CD

## 為什麼選擇這個範本？

Eagle 的官方外掛 API 功能強大但較為底層。它不包含：

- ❌ React 元件庫
- ❌ 瀏覽器開發工作流程
- ❌ 用於測試的模擬 API（無需 Eagle）
- ❌ TypeScript 型別定義
- ❌ 現代 JavaScript 建置工具

**Eagle React 範本填補了這些空白**，提供：

- ✅ **18 個 UI 元件**，使用 CVA 變體（Button、Card、Dialog、Toast 等）
- ✅ **瀏覽器開發**，支援熱重載和模擬 Eagle API
- ✅ **完整的 TypeScript 型別**，涵蓋整個 Eagle 外掛 API
- ✅ **生產建置系統**，一鍵部署
- ✅ **5 個外掛範本**，適用於常見佈局（SinglePanel、SplitPanel、BatchProcess 等）

## 主要功能

### 🎨 元件庫

預建的無障礙元件，符合 Eagle 的設計語言：

```tsx
import { Button, Card, Toast, Dialog } from '@/components';

<Button variant="primary" isLoading>
  處理中...
</Button>
```

### 🔌 Eagle API 適配器

型別安全的封裝，可在瀏覽器和 Eagle 中運作：

```tsx
import { eagleApi } from '@/lib/eagle-api';

// 可在瀏覽器（模擬）和 Eagle（真實 API）中運作
const items = await eagleApi.getSelectedItems();
const isDark = eagleApi.isDarkMode;
```

### 🌐 8 種語言 i18n

內建國際化功能，支援 Eagle 語系偵測：

- 英文 (en)
- 簡體中文 (zh_CN)
- 繁體中文 (zh_TW)
- 日文 (ja_JP)
- 韓文 (ko_KR)
- 德文 (de_DE)
- 西班牙文 (es_ES)
- 俄文 (ru_RU)

### 🧪 完整的測試

1,040+ 單元測試，使用 Vitest 和 React Testing Library：

```bash
npm run test           # 執行所有測試
npm run test:coverage  # 包含覆蓋率報告
```

## 架構概覽

```
┌─────────────────────────────────────────────────────────────┐
│                     您的 React 應用程式                      │
├─────────────────────────────────────────────────────────────┤
│                   EagleAPIAdapter                           │
│         (src/lib/eagle-api.ts - 單例模式)                    │
├─────────────────┬───────────────────────────────────────────┤
│   瀏覽器開發     │              Eagle 執行環境               │
│  (npm run dev)  │           (已部署的外掛)                   │
├─────────────────┼───────────────────────────────────────────┤
│  模擬 Eagle API │           window.eagle                    │
│  (假資料)       │        (真實 Eagle API)                   │
└─────────────────┴───────────────────────────────────────────┘
```

範本的**雙環境模式**讓您可以：

1. **在瀏覽器中開發** — 快速熱重載、DevTools、無需 Eagle
2. **使用模擬資料測試** — 可設定的模擬項目、資料夾、主題
3. **部署至 Eagle** — 一鍵部署，無需更改設定

## 包含內容

| 類別 | 內容 |
|----------|----------|
| **元件** | Button、Card、Dialog、Toast、Header、表單控制項、ImageGrid |
| **Hooks** | useEagleSelection、useTheme、useLocalStorage、useLanguageSync |
| **範本** | SinglePanel、SplitPanel、Settings、BatchProcess、ImageBrowser |
| **工具** | Eagle API 適配器、模擬工廠、i18n、Storage、Canvas 工具 |
| **狀態管理** | Zustand store，支援 slices 和持久化 |
| **測試** | Vitest、React Testing Library、Playwright（E2E） |

## 下一步

準備好建立您的第一個 Eagle 外掛了嗎？

1. **[安裝](./installation)** — 設定您的開發環境
2. **[快速開始](./quick-start)** — 建立並部署您的第一個外掛
3. **[專案結構](./project-structure)** — 了解程式碼架構

或深入特定主題：

- **[核心概念](/docs/core-concepts/dual-environment)** — 了解架構設計
- **[元件](/docs/components/overview)** — 探索 UI 元件庫
- **[Eagle API](/docs/eagle-api/overview)** — 學習 API 封裝
