---
sidebar_position: 1
title: 開發工作流程
description: 開發模式與 npm 指令總覽
---

# 開發工作流程

本模板支援兩種開發模式：使用模擬資料進行快速迭代的**瀏覽器開發**，以及使用真實 Eagle 資料測試的 **Eagle 監視模式**。

## 快速參考

| 指令 | 用途 | 使用時機 |
|------|------|----------|
| `npm run dev` | 瀏覽器開發伺服器 | UI 開發、快速原型設計 |
| `npm run build:watch` | Eagle 監視模式 | 使用真實 Eagle 資料測試 |
| `npm run deploy` | 生產環境部署 | 準備發布時 |
| `npm test` | 執行單元測試 | 程式碼變更後 |
| `npm run typecheck` | 型別檢查 | 提交程式碼前 |

## 開發模式

### 瀏覽器開發（推薦用於 UI）

```bash
npm run dev
```

- 在 `http://localhost:5173` 開啟熱模組替換
- 使用可設定資料的模擬 Eagle API
- UI 變更即時回饋
- 不需要 Eagle 應用程式

**最適合：** 元件開發、樣式設計、版面配置、快速迭代

### Eagle 監視模式（推薦用於整合）

```bash
npm run build:watch
```

然後在 Eagle 中匯入專案：
1. Eagle → 設定 → 外掛 → 開發者
2. 點擊「匯入本機專案」
3. 選擇專案根目錄
4. 變更後按 `Cmd+R` 重新載入

**最適合：** 測試真實 Eagle 整合、API 行為、檔案操作

### 生產環境建置

```bash
npm run build
```

在 `dist/` 中建立最佳化的生產環境建置：
- 壓縮的 JavaScript 套件
- 使用雜湊檔名的最佳化資源
- 準備好部署至 Eagle

## npm 指令參考

### 開發

| 指令 | 命令 | 說明 |
|------|------|------|
| `dev` | `vite` | 啟動開發伺服器 |
| `build` | `tsc -b && vite build` | 生產環境建置 |
| `build:watch` | `tsc && vite build --watch` | Eagle 監視模式 |
| `preview` | `vite preview` | 預覽生產環境建置 |

### 程式碼品質

| 指令 | 命令 | 說明 |
|------|------|------|
| `typecheck` | `tsc --noEmit` | 僅型別檢查不輸出 |
| `lint` | `eslint .` | 執行 ESLint |
| `lint:fix` | `eslint . --fix` | 修復 ESLint 問題 |
| `format` | `prettier --write "src/**/*"` | 格式化程式碼 |
| `format:check` | `prettier --check "src/**/*"` | 檢查格式 |

### 測試

| 指令 | 命令 | 說明 |
|------|------|------|
| `test` | `vitest` | 監視模式執行測試 |
| `test:run` | `vitest run` | 單次測試執行 |
| `test:coverage` | `vitest run --coverage` | 包含覆蓋率報告 |
| `test:ui` | `vitest --ui` | 視覺化測試 UI |
| `test:e2e` | `playwright test` | 端對端測試 |

### 部署

| 指令 | 命令 | 說明 |
|------|------|------|
| `deploy` | `npm run build && node scripts/deploy.js` | 部署至 Eagle |
| `create-plugin` | `npx tsx scripts/create-plugin.ts` | 建立新外掛骨架 |

## 推薦工作流程

### 日常開發

```bash
# 1. 啟動開發伺服器
npm run dev

# 2. 進行變更，即時看到更新

# 3. 提交前執行測試
npm test

# 4. 型別檢查
npm run typecheck

# 5. 格式化與 lint
npm run format && npm run lint:fix
```

### 提交前

```bash
# 執行所有檢查
npm run typecheck && npm run lint && npm run test:run
```

### 在 Eagle 中測試

```bash
# 1. 使用監視模式建置
npm run build:watch

# 2. 在 Eagle 中匯入（僅首次）
# Eagle → 設定 → 外掛 → 開發者 → 匯入本機專案

# 3. 程式碼變更後，重新載入外掛
# 在外掛視窗中按 Cmd+R
```

### 生產環境發布

```bash
# 1. 執行所有測試
npm run test:run

# 2. 建置並部署
npm run deploy

# 3. 重新啟動 Eagle 載入新版本
```

## 環境變數

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `NODE_ENV` | `development` | 建置環境 |
| `VITE_*` | - | 用戶端環境變數 |

在程式碼中存取：
```tsx
if (import.meta.env.DEV) {
  console.log('Development mode');
}

if (import.meta.env.PROD) {
  console.log('Production mode');
}
```

## 檔案監視器

### Vite 開發伺服器
- 監視 `src/**/*` 進行 HMR
- 不需完整重新載入即可即時更新
- 盡可能保留 React 狀態

### 建置監視模式
- 監視 `src/**/*` 進行重新建置
- 變更時完整重新建置（約 1-2 秒）
- 需要在 Eagle 中手動重新載入外掛

## 相關資源

- [瀏覽器開發](./browser-dev) - 模擬系統詳情
- [Eagle 監視模式](./eagle-watch) - Eagle 整合
- [建置設定](./build-config) - Vite 設定
