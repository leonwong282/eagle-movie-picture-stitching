---
sidebar_position: 2
title: 安裝
description: Eagle React 範本的前置需求和設定說明
---

# 安裝

準備好您的開發環境，開始建立 Eagle 外掛。

## 前置需求

在開始之前，請確保您已安裝：

| 需求 | 版本 | 備註 |
|-------------|---------|-------|
| **Node.js** | 18.0+ | [下載](https://nodejs.org/) |
| **npm** 或 **pnpm** | 最新版 | 隨 Node.js 一同安裝 |
| **Eagle** | 4.0+ | [下載](https://eagle.cool)（用於部署測試） |
| **Git** | 最新版 | 可選，用於版本控制 |

:::tip 驗證安裝
```bash
node --version   # 應為 v18.0.0 或更高版本
npm --version    # 應為 9.0.0 或更高版本
```
:::

## 快速安裝

### 選項 1：複製範本

```bash
# 複製儲存庫
git clone https://github.com/leonwong282/eagle-react-template.git my-eagle-plugin

# 進入專案目錄
cd my-eagle-plugin

# 安裝依賴套件
npm install
```

### 選項 2：使用 CLI 腳手架

如果您已有範本，可使用互動式 CLI：

```bash
npm run create-plugin
```

這將提示您輸入：
- 專案目錄名稱
- 外掛顯示名稱
- 描述
- 作者名稱
- 要包含的語言

## 驗證安裝

啟動開發伺服器以驗證一切正常：

```bash
npm run dev
```

您應該會看到：

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

在瀏覽器中開啟 [http://localhost:5173](http://localhost:5173)。您將看到包含互動式標籤頁的示範頁面，展示所有功能。

## 專案腳本

以下是基本的 npm 腳本：

### 開發

| 腳本 | 描述 |
|--------|-------------|
| `npm run dev` | 啟動支援熱重載的瀏覽器開發伺服器 |
| `npm run build` | 建置生產版本 |
| `npm run build:watch` | 監聽模式建置（用於 Eagle 開發） |

### 測試

| 腳本 | 描述 |
|--------|-------------|
| `npm run test` | 使用 Vitest 執行單元測試 |
| `npm run test:coverage` | 執行測試並產生覆蓋率報告 |
| `npm run test:e2e` | 執行 Playwright E2E 測試 |

### 程式碼品質

| 腳本 | 描述 |
|--------|-------------|
| `npm run lint` | 執行 ESLint |
| `npm run lint:fix` | 自動修復 ESLint 問題 |
| `npm run format` | 使用 Prettier 格式化 |
| `npm run typecheck` | TypeScript 型別檢查 |

### 部署

| 腳本 | 描述 |
|--------|-------------|
| `npm run deploy` | 建置並複製到 Eagle 外掛目錄 |

## IDE 設定

### VS Code（推薦）

範本在 `.vscode/` 中包含 VS Code 設定：

1. **在提示時安裝推薦的擴充功能**，或手動安裝：
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin (Volar)

2. **已預先設定**以下功能：
   - 儲存時格式化
   - 儲存時自動修復 ESLint
   - Tailwind CSS class 排序

### 其他 IDE

對於 WebStorm、Neovim 或其他編輯器：

1. 啟用 ESLint 整合
2. 設定 Prettier 作為格式化工具
3. 新增對 `.tsx` 檔案的 TypeScript 支援

## 疑難排解

### Node.js 版本過舊

```bash
# 使用 nvm（推薦）
nvm install 18
nvm use 18

# 或從 nodejs.org 下載
```

### macOS/Linux 權限錯誤

```bash
# 如果看到 EACCES 錯誤
sudo chown -R $(whoami) ~/.npm
```

### Port 5173 已被使用

```bash
# 終止使用 port 5173 的程序
lsof -ti:5173 | xargs kill -9

# 或使用不同的 port
npm run dev -- --port 3000
```

### 依賴套件無法安裝

```bash
# 清除 npm 快取並重新安裝
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 下一步

現在您已設定完成：

1. **[快速開始](./quick-start)** — 在 Eagle 中執行您的第一個外掛
2. **[專案結構](./project-structure)** — 了解程式碼架構
