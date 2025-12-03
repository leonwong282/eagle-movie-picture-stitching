---
sidebar_position: 3
title: Eagle 監視模式
description: 使用真實 Eagle 整合進行開發
---

# Eagle 監視模式

Eagle 監視模式允許使用真實 Eagle API 和即時資料進行開發，同時保持快速的迭代週期。

## 運作方式

```
┌─────────────────────────────────────────────────────────────────┐
│                    Eagle 監視模式流程                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  在 VS Code  │ → │  Vite 監視   │ → │  重新建置    │      │
│  │  編輯程式碼  │    │  偵測變更    │    │  dist/       │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                 │               │
│                                                 ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  在外掛中    │ ← │  按 Cmd+R    │ ← │  Eagle 讀取  │      │
│  │  看到變更    │    │  重新載入    │    │  manifest    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 快速開始

### 步驟 1：啟動監視模式

```bash
npm run build:watch
```

這會執行 `tsc && vite build --watch`：
- TypeScript 編譯
- Vite 建置到 `dist/`
- 監視檔案變更
- 自動重新建置（約 1-2 秒）

### 步驟 2：在 Eagle 中匯入（僅首次）

1. 開啟 Eagle 桌面應用程式
2. 前往**設定** → **外掛** → **開發者**
3. 點擊**「匯入本機專案」**
4. 瀏覽至專案**根目錄**（包含 `manifest.json`）
5. 點擊**選擇** / **開啟**

Eagle 會讀取 `manifest.json` 並載入 `dist/index.html`。

### 步驟 3：開發週期

1. 在 VS Code 中編輯程式碼
2. 等待重新建置（查看終端機輸出）
3. 在外掛視窗中按 `Cmd+R`（Mac）或 `Ctrl+R`（Windows）
4. 看到變更

## Manifest 設定

`manifest.json` 設定 Eagle 如何載入您的外掛：

```json
{
  "id": "your-unique-plugin-id",
  "version": "1.0.0",
  "name": "{{manifest.app.name}}",
  "main": {
    "url": "dist/index.html",  // 開發路徑
    "width": 1024,
    "height": 720,
    "minWidth": 800,
    "minHeight": 600
  },
  "logo": "public/logo.png",   // 開發路徑
  "devTools": true             // 啟用 DevTools
}
```

:::info 路徑慣例
- **開發階段：** 路徑指向建置輸出（`dist/index.html`）
- **部署階段：** 路徑會被轉換（`index.html`）

部署腳本會自動處理這個轉換。
:::

## 重新載入方法

### 軟重新載入（推薦）

在外掛視窗中按 `Cmd+R`（Mac）或 `Ctrl+R`（Windows）。

- 重新載入外掛內容
- 維持 Eagle 狀態
- 快速（約 100ms）

### 硬重新載入

如果軟重新載入沒有偵測到變更：

1. 關閉外掛視窗
2. 從 Eagle 的外掛選單重新開啟

### 外掛切換（快取問題）

如果變更仍然沒有出現：

1. 前往**設定** → **外掛**
2. **停用**外掛（切換為關閉）
3. **啟用**外掛（切換為開啟）
4. 重新開啟外掛

這會清除 Eagle 的外掛快取。

## DevTools 存取

當 manifest 中設定 `devTools: true` 時：

| 平台 | 快捷鍵 |
|------|--------|
| macOS | `Cmd + Option + I` |
| Windows | `F12` 或 `Ctrl + Shift + I` |

DevTools 提供：
- 記錄與錯誤的主控台
- API 呼叫的網路分頁
- DOM 檢查的元素分頁
- 除錯的原始碼分頁

## 常見問題

### 變更沒有出現

1. **檢查建置是否完成：** 在終端機中尋找 "built in Xs"
2. **重新載入外掛：** 按 `Cmd+R`
3. **切換外掛：** 在設定中停用 → 啟用
4. **檢查錯誤：** 開啟 DevTools 主控台

### 建置錯誤

```bash
# 檢查 TypeScript 錯誤
npm run typecheck

# 在終端機輸出中檢查語法錯誤
# 修復錯誤並儲存 - 監視模式會重新建置
```

### 外掛無法載入

1. 驗證 `manifest.json` 是有效的 JSON
2. 檢查 `dist/index.html` 存在
3. 確保 Eagle 有權限讀取專案資料夾
4. 檢查 Eagle 的外掛主控台是否有錯誤

### 重新建置緩慢

如果重新建置緩慢：

```bash
# 檢查正在重新建置的內容
npm run build:watch -- --debug

# 確保 node_modules 沒有被監視
# 檢查 vite.config.ts server.watch 設定
```

## 開發技巧

### 先使用瀏覽器開發

從瀏覽器開發開始進行 UI 工作：

```bash
npm run dev  # 使用模擬 API 的瀏覽器
```

切換到 Eagle 監視模式用於：
- 測試真實 Eagle API
- 檔案操作
- 選取整合
- 平台特定功能

### 同時執行兩者

您可以同時執行兩種模式：

```bash
# 終端機 1：瀏覽器開發
npm run dev

# 終端機 2：Eagle 監視
npm run build:watch
```

這允許：
- 在瀏覽器中快速 UI 迭代
- 在 Eagle 中整合測試
- 快速比較模擬與真實行為

### 主控台記錄

使用 `eagleApi.log` 在 Eagle 中記錄可見的日誌：

```typescript
import { eagleApi } from '@/lib/eagle-api';

// 這些會出現在 Eagle 的 DevTools 主控台
eagleApi.log.info('Info message');
eagleApi.log.warn('Warning message');
eagleApi.log.error('Error message');
```

### 使用真實選取測試

1. 在 Eagle 主視窗中選取項目
2. 開啟您的外掛
3. 透過 `eagleApi.item.getSelected()` 可取得項目

### 測試不同資源庫

1. 切換到不同的 Eagle 資源庫
2. 外掛的 `onLibraryChanged` 事件會觸發
3. 測試資源庫特定行為

## 監視模式 vs 瀏覽器開發

| 功能 | 瀏覽器開發 | Eagle 監視 |
|------|------------|------------|
| 重新載入速度 | 即時（HMR） | 約 1-2 秒 + 手動 |
| Eagle API | 模擬 | 真實 |
| 檔案操作 | 模擬的 | 真實 |
| 選取 | 模擬資料 | 即時選取 |
| DevTools | 瀏覽器內建 | Eagle DevTools |
| 平台功能 | 模擬的 | 真實 |

## 相關資源

- [瀏覽器開發](./browser-dev) - 模擬系統
- [除錯](./debugging) - 除錯技巧
- [部署腳本](../deployment/deploy-script) - 生產環境部署
