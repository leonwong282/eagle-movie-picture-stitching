---
sidebar_position: 5
title: 建置設定
description: Vite 與建置系統設定
---

# 建置設定

本模板使用 Vite 進行開發與生產環境建置，針對 Eagle 外掛需求進行設定。

## Vite 設定

### 核心設定

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // 關鍵：必須為相對路徑才能在 Eagle 中運作
  base: './',
  
  plugins: [react()],
  
  build: {
    outDir: 'dist',
    sourcemap: false,  // 生產環境停用
    minify: true,
    rollupOptions: {
      output: {
        // 單一套件（Eagle 需求）
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  
  server: {
    port: 5173,
    open: true,
  },
});
```

### 關鍵設定說明

#### `base: './'`

**必須為相對路徑**才能讓 Eagle 正確載入資源：

```typescript
// ✅ 正確 - 相對路徑
base: './'
// 結果：<script src="./assets/index-abc123.js">

// ❌ 錯誤 - 絕對路徑在 Eagle 中會失效
base: '/'
// 結果：<script src="/assets/index-abc123.js">
```

#### `manualChunks: undefined`

Eagle 將外掛作為單一進入點載入。程式碼分割可能導致問題：

```typescript
rollupOptions: {
  output: {
    // 停用程式碼分割
    manualChunks: undefined,
  },
}
```

## 路徑別名

設定匯入別名以獲得更簡潔的匯入：

| 別名 | 路徑 | 使用方式 |
|------|------|----------|
| `@` | `src/` | `import { App } from '@/App'` |
| `@components` | `src/components/` | `import { Button } from '@components/ui'` |
| `@hooks` | `src/hooks/` | `import { useTheme } from '@hooks'` |
| `@lib` | `src/lib/` | `import { eagleApi } from '@lib/eagle-api'` |
| `@styles` | `src/styles/` | `import '@styles/globals.css'` |

### TypeScript 別名設定

也必須在 `tsconfig.json` 中設定：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@lib/*": ["src/lib/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

## 開發伺服器

```typescript
server: {
  port: 5173,           // 預設連接埠
  open: true,           // 自動開啟瀏覽器
  host: true,           // 監聽所有位址
  strictPort: false,    // 若繁忙則嘗試下一個連接埠
  
  // 代理 API 請求（如需要）
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  
  // 監視選項
  watch: {
    // 忽略的模式
    ignored: ['**/node_modules/**', '**/dist/**'],
  },
},
```

## 建置最佳化

### 套件分析

模板包含 `rollup-plugin-visualizer`：

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({
    filename: 'dist/bundle-stats.html',
    gzipSize: true,
    brotliSize: true,
    template: 'treemap',  // 或 'sunburst'、'network'
  }),
],
```

建置後，開啟 `dist/bundle-stats.html` 分析套件組成。

### 壓縮

```typescript
build: {
  minify: 'esbuild',  // 快速，預設值
  // 或
  minify: 'terser',   // 更積極，較慢
  
  terserOptions: {
    compress: {
      drop_console: true,  // 在生產環境移除 console.*
      drop_debugger: true,
    },
  },
},
```

### 目標瀏覽器

```typescript
build: {
  target: 'es2020',  // Eagle 使用現代 Chromium
  
  // 或明確指定
  target: ['chrome90', 'safari14'],
},
```

## 環境變數

### 定義

建立 `.env` 檔案：

```bash
# .env - 所有環境
VITE_APP_NAME=Eagle Plugin

# .env.development - 僅開發環境
VITE_DEBUG=true

# .env.production - 僅生產環境
VITE_DEBUG=false
```

### 使用方式

```typescript
// 在程式碼中存取（必須以 VITE_ 為前綴）
const appName = import.meta.env.VITE_APP_NAME;
const isDebug = import.meta.env.VITE_DEBUG === 'true';

// 內建變數
import.meta.env.DEV      // 開發環境為 true
import.meta.env.PROD     // 生產環境為 true
import.meta.env.MODE     // 'development' 或 'production'
```

### 型別定義

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## CSS 設定

### PostCSS

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // 自訂主題擴展
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

## TypeScript 設定

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `tsconfig.node.json`

用於 Vite 設定與 Node.js 腳本：

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "scripts/**/*"]
}
```

## 輸出結構

執行 `npm run build` 後：

```
dist/
├── index.html              # 進入點
├── assets/
│   ├── index-[hash].js     # 主要套件
│   ├── index-[hash].css    # 樣式
│   └── [asset]-[hash].*    # 其他資源
└── bundle-stats.html       # 套件分析（如啟用）
```

## 建置指令

| 指令 | 說明 |
|------|------|
| `npm run build` | 生產環境建置 |
| `npm run build:watch` | Eagle 監視模式 |
| `npm run preview` | 預覽生產環境建置 |

### 監視模式詳情

```bash
npm run build:watch
# 執行：tsc && vite build --watch
```

- 先編譯 TypeScript
- 檔案變更時重新建置
- 輸出至 `dist/`
- 每次重新建置約 1-2 秒

## 相關資源

- [開發工作流程](./workflow) - 整體工作流程
- [部署腳本](../deployment/deploy-script) - 部署
- [Manifest 設定](../deployment/manifest-config) - 外掛 manifest
