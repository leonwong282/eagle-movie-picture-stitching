---
sidebar_position: 4
title: 專案結構
description: 了解 Eagle React 範本的檔案組織
---

# 專案結構

本指南說明 Eagle React 範本中的檔案組織和關鍵目錄。

## 概覽

```
eagle-react-template/
├── 📁 _locales/              # 國際化（8 種語言）
├── 📁 docs/                  # Docusaurus 文件（本站）
├── 📁 e2e/                   # Playwright E2E 測試
├── 📁 public/                # 靜態資源（logo、favicon）
├── 📁 scripts/               # 建置和部署腳本
├── 📁 src/                   # 應用程式原始碼
├── 📄 index.html             # HTML 進入點
├── 📄 manifest.json          # Eagle 外掛清單
├── 📄 package.json           # 依賴套件和腳本
├── 📄 tailwind.config.js     # Tailwind CSS 設定
├── 📄 tsconfig.json          # TypeScript 設定
└── 📄 vite.config.ts         # Vite 建置設定
```

## 原始碼目錄（`src/`）

主要應用程式碼：

```
src/
├── 📁 components/
│   ├── 📁 ui/                # UI 元件庫
│   │   ├── Button.tsx        # 7 種變體的按鈕
│   │   ├── Card.tsx          # 玻璃擬態卡片
│   │   ├── Dialog.tsx        # 模態對話框（Radix UI）
│   │   ├── DropdownMenu.tsx  # 下拉選單（Radix UI）
│   │   ├── Form.tsx          # Input、Select、Checkbox、Slider
│   │   ├── Header.tsx        # 帶有拖曳區域的應用程式標題
│   │   ├── Image.tsx         # EagleImage、ImageGrid
│   │   ├── Popover.tsx       # 彈出框（Radix UI）
│   │   ├── Tabs.tsx          # 標籤頁導覽（Radix UI）
│   │   ├── Toast.tsx         # 通知訊息
│   │   ├── Tooltip.tsx       # 工具提示（Radix UI）
│   │   ├── ErrorBoundary.tsx # 錯誤處理
│   │   └── index.ts          # 統一匯出
│   └── index.ts
│
├── 📁 demos/                 # 互動式示範元件
│   ├── SelectionDemo.tsx     # Eagle 選擇功能展示
│   ├── ComponentsDemo.tsx    # UI 元件展示
│   ├── FormsDemo.tsx         # 表單控制項示範
│   ├── DialogsDemo.tsx       # 覆蓋層元件示範
│   ├── CanvasDemo.tsx        # Canvas 渲染示範
│   ├── StorageDemo.tsx       # 持久化示範
│   ├── TemplatesDemo.tsx     # 外掛範本示範
│   └── index.ts
│
├── 📁 hooks/                 # 自訂 React hooks
│   ├── useEagleSelection.ts  # ⭐ 基於輪詢的選擇追蹤
│   ├── useTheme.ts           # Eagle 主題同步
│   ├── useLocalStorage.ts    # 型別安全的 localStorage
│   ├── useLanguageSync.ts    # 與 Eagle 同步的 i18n
│   └── index.ts
│
├── 📁 lib/                   # 核心工具
│   ├── eagle-api.ts          # ⭐ Eagle API 適配器（關鍵）
│   ├── mock-factory.ts       # 模擬資料生成
│   ├── i18n.ts               # i18next 設定
│   ├── storage.ts            # 命名空間 localStorage
│   ├── canvas.ts             # Canvas 工具
│   └── utils.ts              # cn()、debounce、格式化工具
│
├── 📁 pages/                 # 頁面元件
│   ├── DemoPage.tsx          # 帶有標籤頁的主要示範頁面
│   └── index.ts
│
├── 📁 stores/                # Zustand 狀態管理
│   ├── index.ts              # 帶有 slices 的主要 store
│   ├── selectors.ts          # 記憶化選擇器
│   └── slices/               # Store slices
│       ├── selection.ts      # Eagle 選擇狀態
│       ├── settings.ts       # 使用者偏好設定
│       ├── processing.ts     # 批次操作
│       └── ui.ts             # UI 狀態
│
├── 📁 styles/
│   └── globals.css           # Tailwind + Eagle 設計標記
│
├── 📁 templates/             # 即用型外掛佈局
│   ├── SinglePanelTemplate.tsx
│   ├── SplitPanelTemplate.tsx
│   ├── SettingsPanelTemplate.tsx
│   ├── BatchProcessTemplate.tsx
│   ├── ImageBrowserTemplate.tsx
│   ├── ThreeColumnTemplate.tsx
│   └── index.ts
│
├── 📁 types/
│   └── eagle.d.ts            # ⭐ 完整的 Eagle API 型別
│
├── App.tsx                   # 主要應用程式元件
└── main.tsx                  # 進入點（i18n + 主題初始化）
```

## 關鍵檔案說明

### `manifest.json` — 外掛設定

Eagle 外掛清單定義了您外掛的識別資訊：

```json
{
  "id": "your-unique-plugin-id",
  "name": "{{manifest.app.name}}",          // i18n 鍵值
  "description": "{{manifest.app.description}}",
  "main": {
    "url": "dist/index.html",               // 進入點
    "devTools": true,                       // 啟用 DevTools
    "vibrancy": true,                       // macOS 模糊效果
    "minWidth": 800,
    "minHeight": 600
  },
  "languages": ["en", "zh_CN", "zh_TW", "ja_JP", ...],
  "fallbackLanguage": "en"
}
```

:::note 路徑轉換
`deploy.js` 腳本會在部署時將 `dist/index.html` 轉換為 `index.html`。在 `manifest.json` 中保持開發路徑。
:::

### `src/lib/eagle-api.ts` — Eagle API 適配器

最關鍵的檔案。為瀏覽器和 Eagle 提供統一介面：

```typescript
class EagleAPIAdapter {
  private _api: EagleAPI | MockEagleAPI;
  private _isMock: boolean;

  constructor() {
    if (isEagleEnvironment()) {
      this._api = window.eagle;
      this._isMock = false;
    } else {
      this._api = createMockEagleAPI();
      this._isMock = true;
    }
  }

  // 所有 Eagle API 方法都封裝在這裡
  async getSelectedItems() { ... }
  async addItemFromPath(path, options) { ... }
}

export const eagleApi = new EagleAPIAdapter();
```

### `src/types/eagle.d.ts` — 型別定義

Eagle 外掛 API v4.0 的完整 TypeScript 型別：

```typescript
interface EagleAPI {
  app: EagleApp;
  item: EagleItemAPI;
  folder: EagleFolderAPI;
  tag: EagleTagAPI;
  window: EagleWindow;
  dialog: EagleDialog;
  // ... 50+ 介面
}

interface Item {
  id: string;
  name: string;
  ext: string;
  filePath: string;
  thumbnailURL: string;
  // ... 30+ 屬性
}
```

### `tailwind.config.js` — 設計標記

Eagle 專用的顏色標記和動畫：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // 語意化顏色
        primary: 'oklch(var(--primary))',
        success: 'oklch(var(--success))',
        // Eagle 專用
        'eagle-bg': 'var(--eagle-bg-primary)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
};
```

## 語系目錄（`_locales/`）

8 種語言的翻譯檔案：

```
_locales/
├── en.json       # 英文（備用）
├── zh_CN.json    # 簡體中文
├── zh_TW.json    # 繁體中文
├── ja_JP.json    # 日文
├── ko_KR.json    # 韓文
├── de_DE.json    # 德文
├── es_ES.json    # 西班牙文
└── ru_RU.json    # 俄文
```

結構範例：

```json
{
  "manifest": {
    "app": {
      "name": "Eagle React 範本",
      "description": "現代化的 Eagle 外掛 React 範本"
    }
  },
  "app": {
    "title": "Eagle React 範本"
  },
  "demo": {
    "tabs": {
      "selection": "選擇",
      "components": "元件"
    }
  }
}
```

## 腳本目錄（`scripts/`）

建置和部署工具：

```
scripts/
├── deploy.js         # 跨平台部署
└── create-plugin.ts  # CLI 腳手架工具
```

`deploy.js` 腳本：
1. 執行 `npm run build`
2. 轉換清單路徑
3. 複製到 Eagle 外掛目錄
4. 處理 macOS/Windows 差異

## 匯入別名

範本在 `vite.config.ts` 中設定了路徑別名：

```typescript
resolve: {
  alias: {
    '@': './src',
    '@components': './src/components',
    '@hooks': './src/hooks',
    '@lib': './src/lib',
  },
}
```

使用方式：

```typescript
// 不使用相對路徑
import { Button } from '../../../components/ui/Button';

// 使用別名
import { Button } from '@/components';
import { useTheme } from '@hooks';
import { eagleApi } from '@lib/eagle-api';
```

## 下一步

現在您了解了結構：

1. **[核心概念](/docs/core-concepts/dual-environment)** — 學習架構設計
2. **[元件](/docs/components/overview)** — 探索 UI 元件
3. **[Eagle API](/docs/eagle-api/overview)** — 精通 API 封裝
