<div align="center">

<a href="https://github.com/leonwong282/awesome-project-template">
  <img src="images/logo.png" alt="Logo" width="80" height="80">
</a>

# 🚀 Movie Picture Stitching - Eagle 插件

> 一款現代化、國際化的 Eagle 影像管理插件，支援將多張電影圖片垂直拼接成全景圖，並具備完整多語言介面

**🚀 重大更新 (v3.0.0):** 插件已完全使用 **React 18 + TypeScript + Tailwind CSS** 重寫，提供現代化、可維護的程式碼庫。這是一次重大的架構升級，帶來更好的效能、開發體驗和增強的 UI 元件。

![Eagle Plugin](https://img.shields.io/badge/Eagle-Plugin-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-3.0.0-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-GPL--3.0-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge)
![Internationalization](https://img.shields.io/badge/i18n-8_Languages-orange?style=for-the-badge)

[🌍 English](README.md) | [🇹🇼 繁體中文](README.zh-TW.md) 

[功能特色](#-功能特色) • [安裝方式](#-安裝方式) • [使用說明](#-使用說明) • [開發指南](#-開發指南)

</div>

<a id="readme-top"></a>

## 📸 預覽

![cover](./images/cover.webp)
![feature](./images/feature.webp)
![mulit-language](./images/multi-language.webp)


## ✨ 功能特色

### 🎯 核心功能

- **智慧拼接**：多張圖片垂直拼接成全景圖
- **精確裁切**：支援上下百分比裁切
- **多格式匯出**：JPG、WebP、PNG 格式
- **品質控制**：0.1-1.0 精細品質調整
- **即時預覽**：高效能 Canvas 實時預覽

### 🌍 國際化
- **8 種語言**：英文、簡體中文、繁體中文、日文、西班牙文、德文、韓文、俄文
- **自動偵測**：自動偵測 Eagle 語言設定
- **即時切換**：動態語言切換，無需重啟
- **完整翻譯**：所有介面元素皆已本地化

### 🎨 現代化 React 介面
- **React 18 + TypeScript**：完全型別安全的元件架構，支援 IntelliSense
- **Tailwind CSS**：工具優先的樣式系統，整合 Eagle 設計語彙與深色模式
- **Radix UI**：無障礙、無樣式的元件基礎（Dialog、Slider、Select 等）
- **Lucide 圖示**：美觀一致的圖示系統
- **玻璃態效果**：現代毛玻璃效果與流暢動畫
- **響應式設計**：使用 Tailwind 響應式工具，完美適應各種螢幕尺寸

### 🚀 進階功能
- **自動預覽**：圖片重新排序或參數變更時自動更新預覽
- **參數記憶**：自動記住上次的設定，跨工作階段保持
- **鍵盤快捷鍵**：完整的鍵盤導航支援（Cmd/Ctrl + Enter 預覽等）
- **全螢幕檢視器**：支援縮放與平移的全螢幕圖片檢視器
- **拖放排序**：直覺的圖片順序管理
- **參數驗證**：智慧參數調整，防止無效輸入
- **錯誤處理**：完整錯誤捕捉，友善提示
- **資源管理**：自動清理暫存檔與記憶體
- **效能優化**：圖片平行載入，防抖處理
- **置頂視窗**：可釘選視窗，提升工作效率
- **狀態管理**：使用 Zustand 進行可靠的資料流管理

## 🛠 安裝方式

### 方法一：直接安裝

1. 下載插件安裝包
2. 開啟 Eagle 的「設定」→「插件」→「插件中心」
3. 點擊「安裝插件」
4. 啟用插件

![Plugin install one](./images/install_eagle.webp)

### 方法二：開發者安裝
1. 下載插件安裝包
2. 開啟 Eagle 的「設定」→「插件」→「開發者」
3. 點擊「匯入本地專案」
4. 選擇插件資料夾 `Movie Picture Stitching`
5. 啟用插件

![Plugin install two](./images/install_dev.webp)

## 🎯 使用說明

1. **選擇圖片**：在 Eagle 中選取 2 張以上欲拼接的圖片
2. **開啟插件**：右鍵選單點擊「Movie Picture Stitching」
3. **設定參數**：
   - **上裁切**：設定從頂部裁切的百分比 (0-90%)
   - **下裁切**：設定從底部裁切的百分比 (0-90%)
   - **品質**：調整匯出品質 (0.1-1.0，適用於 JPG 與 WebP)
   - **格式**：選擇匯出格式 (JPG、WebP、PNG)
4. **即時預覽**：調整參數時即時預覽拼接效果
5. **儲存結果**：點擊「儲存圖片」匯出拼接後圖片

![](./images/feature_demo1.webp)
![](./images/feature_demo2.webp)
![](./images/feature_demo3.webp)
![](./images/feature_demo4.webp)
![](./images/feature_demo5.webp)
![](./images/result_showcase.webp)

### 🌍 語言支援

插件會自動偵測 Eagle 語言設定並切換介面，目前支援以下語言：

- **英文** (en)
- **簡體中文** (zh_CN) 
- **繁體中文** (zh_TW)
- **日文** (ja_JP)
- **西班牙文** (es_ES)
- **德文** (de_DE)
- **韓文** (ko_KR)
- **俄文** (ru_RU)

### 💡 使用小技巧

- **自動預覽**：在設定中啟用自動預覽，重新排序圖片或變更參數時自動更新預覽
- **鍵盤快捷鍵**：
  - `Cmd/Ctrl + Enter`：產生預覽
  - `Cmd/Ctrl + S`：儲存圖片
  - `Cmd/Ctrl + H`：顯示鍵盤快捷鍵說明
  - `Cmd/Ctrl + 1/2`：聚焦裁切輸入欄位
- **設定記憶**：您的參數（裁切百分比、格式、品質、自動預覽）會在重新開啟插件時自動儲存與還原
- **全螢幕檢視器**：點擊預覽圖片開啟全螢幕檢視器，支援縮放與平移
- **拖放排序**：在左側面板拖放圖片以重新排序
- **裁切建議**：總裁切百分比（上+下）建議不超過 80% 以獲得最佳效果
- **品質平衡**：建議品質設為 0.8-0.9，兼顧檔案大小與畫質
- **格式選擇**：
  - JPG：適合色彩豐富的照片
  - WebP：檔案小且品質佳
  - PNG：需透明或無損壓縮時使用
- **效能提示**：大圖自動優化處理，確保流暢操作

### 📊 參數指南
- **上裁切**：影響除第一張外所有圖片，從頂部裁切指定百分比
- **下裁切**：影響所有圖片，從底部裁切指定百分比  
- **匯出格式**：
  - `JPG`：適合色彩豐富的照片，檔案較小
  - `WebP`：現代格式，壓縮佳，品質與檔案大小平衡
  - `PNG`：無損格式，適合需透明的圖片
- **匯出品質**：範圍 0.1-1.0，值越高畫質越好但檔案越大

### 🎯 使用提示
- 💡 **智慧驗證**：系統自動顯示有效參數範圍
- 💡 **裁切限制**：總裁切（上+下）不可超過 99%
- 💡 **即時預覽**：調整參數時即時更新預覽
- 💡 **效能建議**：建議每批最多處理 50 張圖片
- 💡 **記憶體管理**：大圖自動優化記憶體使用

![tip1](./images/tip1.webp)
![tip2](./images/tip2.webp)
![tip3](./images/tip3.webp)
![tip4](./images/tip4.webp)
![tip5](./images/tip5.webp)
![tip6](./images/tip6.webp)

## 🛠️ 開發指南

### 環境需求
- **Node.js** 18+ 與 npm/yarn/pnpm
- **Eagle** 4.0 以上
- **現代瀏覽器**支援 Canvas API（用於開發）
- 基本了解 **React**、**TypeScript** 與 **Tailwind CSS**

### 專案結構 (React + TypeScript)
```
eagle-movie-picture-stitching/
├── LICENSE                                    # GPL-3.0 授權
├── README.md                                  # 英文說明文件
├── README.zh-TW.md                            # 繁體中文說明文件
├── CHANGELOG.md                               # 版本歷史
├── Movie Picture Stitching/                  # 舊版插件 (Bootstrap 5 版本)
│   └── ...                                    # 原始實作
├── Movie Picture Stitching React/            # ⭐ 新版 React 插件
│   ├── manifest.json                         # 插件設定
│   ├── index.html                            # 入口點
│   ├── package.json                          # 依賴與腳本
│   ├── vite.config.ts                        # Vite 建置設定
│   ├── tailwind.config.js                    # Tailwind CSS 設定
│   ├── tsconfig.json                         # TypeScript 設定
│   ├── _locales/                             # 國際化 (8 種語言)
│   │   ├── en.json
│   │   ├── zh_CN.json
│   │   ├── zh_TW.json
│   │   └── ...
│   ├── src/
│   │   ├── main.tsx                          # 應用程式入口點
│   │   ├── App.tsx                           # 根元件
│   │   ├── pages/
│   │   │   └── StitchingPage.tsx            # 主要拼接介面
│   │   ├── components/
│   │   │   ├── stitching/                   # 拼接專用元件
│   │   │   │   ├── ImageQueue.tsx           # 圖片列表（支援拖放）
│   │   │   │   ├── ParameterPanel.tsx        # 設定面板
│   │   │   │   ├── PreviewCanvas.tsx        # 預覽顯示
│   │   │   │   ├── LightboxDialog.tsx       # 全螢幕檢視器
│   │   │   │   └── ShortcutsDialog.tsx      # 鍵盤快捷鍵說明
│   │   │   └── ui/                          # 可重用的 UI 元件
│   │   │       ├── Button.tsx
│   │   │       ├── Dialog.tsx
│   │   │       ├── Slider.tsx
│   │   │       └── ...
│   │   ├── hooks/                           # 自訂 React Hooks
│   │   │   ├── useEagleSelection.ts         # 追蹤選取項目
│   │   │   ├── useKeyboardShortcuts.ts     # 鍵盤快捷鍵
│   │   │   ├── useTheme.ts                 # 主題管理
│   │   │   └── ...
│   │   ├── stores/                         # Zustand 狀態管理
│   │   │   ├── index.ts                    # Store 設定
│   │   │   └── slices/                     # 功能切片
│   │   │       ├── stitching.ts            # 拼接狀態
│   │   │       ├── settings.ts             # 使用者設定
│   │   │       └── ...
│   │   ├── lib/                            # 核心工具
│   │   │   ├── eagle-api.ts                # Eagle API 適配器
│   │   │   ├── stitching-engine.ts         # 圖片拼接邏輯
│   │   │   ├── i18n.ts                     # i18next 設定
│   │   │   └── ...
│   │   ├── templates/                      # 版面範本
│   │   │   └── ThreeColumnTemplate.tsx     # 主要版面
│   │   └── styles/
│   │       └── globals.css                 # 全域樣式 + Tailwind
│   └── dist/                               # 建置輸出（部署到 Eagle）
├── images/                                 # 文件資源
└── screenshots/                            # 插件截圖
```

### 🌍 國際化開發

插件支援 8 種語言，並具備完整 i18n 系統：

**語言檔案結構：**
```
_locales/
├── en.json       # 英文 (基礎語言)
├── zh_CN.json    # 簡體中文
├── zh_TW.json    # 繁體中文
├── ja_JP.json    # 日文
├── es_ES.json    # 西班牙文
├── de_DE.json    # 德文
├── ko_KR.json    # 韓文
└── ru_RU.json    # 俄文
```

**主要 i18n 功能：**
- 根據 Eagle 設定自動偵測語言
- 即時切換 UI 語言，無需重啟
- 完整錯誤訊息本地化
- 文化化數字與日期格式

### 本地開發

1. **複製專案**：
   ```bash
   git clone https://github.com/leonwong282/eagle-movie-picture-stitching.git
   cd eagle-movie-picture-stitching
   ```

2. **安裝依賴**：
   ```bash
   cd "Movie Picture Stitching React"
   npm install
   ```

3. **開發模式**（瀏覽器，使用模擬 API）：
   ```bash
   npm run dev
   # 在 http://localhost:5173 開啟瀏覽器
   # 啟用熱重載 - 編輯程式碼立即看到變更
   ```

4. **建置生產版本**：
   ```bash
   npm run build
   # 輸出優化後的套件到 dist/ 資料夾
   ```

5. **部署到 Eagle**：
   ```bash
   npm run deploy
   # 複製 dist/ 到 Eagle 插件目錄
   # 或手動複製 dist/ 內容到 Eagle 插件資料夾
   ```

6. **測試**：
   ```bash
   npm run test          # 執行單元測試
   npm run test:e2e      # 執行端對端測試
   npm run test:visual  # 視覺回歸測試
   ```

7. **程式碼品質**：
   ```bash
   npm run lint          # 檢查程式碼錯誤
   npm run lint:fix      # 自動修復程式碼問題
   npm run format        # 使用 Prettier 格式化
   npm run typecheck     # TypeScript 型別檢查
   ```

### React 元件範例

**使用 Eagle API：**
```typescript
import { eagleApi } from '@/lib/eagle-api';
import { useEagleSelection } from '@/hooks/useEagleSelection';

function MyComponent() {
  const { selectedItems, isLoading } = useEagleSelection();
  
  const handleSave = async () => {
    const items = await eagleApi.getSelectedItems();
    // 處理項目...
  };
  
  return <div>{/* UI */}</div>;
}
```

**使用 Zustand 狀態管理：**
```typescript
import { useStitching } from '@/stores';

function ParameterPanel() {
  const { cropTop, cropBottom, setCropTop, setCropBottom } = useStitching();
  
  return (
    <Slider
      value={[cropTop]}
      onValueChange={([value]) => setCropTop(value)}
    />
  );
}
```

**國際化：**
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('ui.title', '預設標題')}</h1>;
}
```

**鍵盤快捷鍵：**
```typescript
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

function MyComponent() {
  useKeyboardShortcuts({
    preview: () => handlePreview(),
    save: () => handleSave(),
  });
  
  return <div>{/* UI */}</div>;
}
```

### 技術棧
- **前端框架**：React 18.3 + TypeScript 5.6
- **建置工具**：Vite 5（快速 HMR 與優化建置）
- **樣式系統**：Tailwind CSS 3 + CSS 變數（Eagle 設計語彙）
- **UI 元件**：Radix UI（無障礙基礎元件）+ Lucide 圖示
- **狀態管理**：Zustand 5（輕量、高效能）
- **國際化**：i18next + react-i18next（8 種語言）
- **圖片處理**：Canvas API 高效渲染
- **檔案操作**：Node.js fs、path 模組（Eagle 環境）
- **測試**：Vitest（單元測試）+ Playwright（E2E 測試）
- **程式碼品質**：ESLint + Prettier + TypeScript 嚴格模式

### 開發工作流程

**瀏覽器開發（熱重載）：**
```bash
cd "Movie Picture Stitching React"
npm install
npm run dev
# 開啟瀏覽器，使用模擬的 Eagle API
# 編輯程式碼 → 立即看到變更
```

**建置生產版本：**
```bash
npm run build
# 輸出到 dist/ 資料夾
# 使用部署腳本部署到 Eagle
```

**測試：**
```bash
npm run test          # 單元測試
npm run test:e2e      # 端對端測試
npm run test:visual  # 視覺回歸測試
```

### 架構亮點

**雙環境模式：**
- 在瀏覽器中開發，使用模擬的 Eagle API（快速迭代）
- 部署到 Eagle，使用真實 API（無縫轉換）
- 同一程式碼庫在兩種環境中皆可運作

**元件化設計：**
- 可重用的 UI 元件，具備 TypeScript 型別
- 組合優於繼承
- 基於 Props 的設定

**狀態管理：**
- Zustand 切片實現功能隔離
- 型別安全的狀態更新
- 使用選擇器優化重新渲染

## 🐛 疑難排解

### 常見問題

**Q: 插件無法啟動**
- 請確認 Eagle 版本支援插件（需 4.0 以上）
- 檢查插件檔案完整性
- 查看 Eagle 插件管理頁錯誤訊息

**Q: 圖片拼接失敗**
- 確認選取的檔案為有效圖片格式
- 檢查圖片數量是否過多（建議 <50 張）
- 驗證參數設定是否合理

**Q: 預覽顯示異常**
- 重新整理插件頁面
- 檢查圖片尺寸是否過大
- 確認瀏覽器支援 Canvas 功能

**Q: 介面顯示異常**
- 清除瀏覽器快取
- 檢查 CSS 檔案完整性
- 確認瀏覽器支援現代 CSS

**Q: 語言無法切換**
- 確認 Eagle 語言設定
- 檢查 `_locales/` 資料夾是否有語言檔
- 重新啟動插件

### 效能優化建議
- 每批圖片建議不超過 50 張
- 使用 JPG 格式降低記憶體消耗
- 避免處理超高解析度圖片（>4K）
- 定期重啟插件釋放記憶體
- 處理大量圖片時關閉其他高資源程式

### 語言支援問題
- **缺少翻譯**：部分文字若翻譯不完整會回退英文
- **文化化格式**：數字與格式會自動依語言調整
- **RTL 語言**：目前優化 LTR 語言，RTL 支援未來規劃

## 📋 更新紀錄

### v3.0.0 (2025-01-XX) 🚀 React 重寫
- **🚀 完整 React 重寫**：全面遷移至 React 18 + TypeScript
  - 使用 Hooks 的現代元件架構
  - 完全型別安全的開發，支援 IntelliSense
  - 提升效能與可維護性
- **🎨 UI 全面翻新**：
  - Tailwind CSS 工具優先樣式
  - Radix UI 無障礙元件
  - Lucide 圖示提供一致圖示系統
  - 增強的深色模式支援
- **✨ 新功能**：
  - 參數變更時自動預覽
  - 鍵盤快捷鍵支援（Cmd/Ctrl + H 開啟說明等）
  - 全螢幕檢視器，支援縮放與平移
  - 拖放圖片重新排序
  - 改進的參數記憶功能
- **🛠 開發體驗**：
  - Vite 提供快速 HMR
  - 瀏覽器開發環境，使用模擬 API
  - 完整的測試套件
  - 更好的錯誤處理與除錯

### v2.0.0 (2024-XX-XX) 🎨 Bootstrap 5
- **🎨 Bootstrap 5 遷移**：使用 Bootstrap 5 重建 UI
- **📦 模組化 CSS**：元件式樣式表架構

### v1.0.0 (2025-09-01) 🌍
- **🌍 完整國際化**：支援 8 種語言
  - 英文、簡體中文、繁體中文、日文、西班牙文、德文、韓文、俄文
  - 自動偵測 Eagle 語言
  - 即時語言切換
  - 本地化錯誤訊息與介面

## 📄 授權

本專案採用 [GPL-3.0 License](LICENSE) 授權。

## 🙏 致謝

- [Eagle](https://eagle.cool/) - 優秀的影像管理軟體
- 社群貢獻者的寶貴建議
- 國際用戶協助翻譯與本地化
- 所有支持本插件的用戶

## 📞 聯絡與支援

- **專案首頁**：[GitHub Repository](https://github.com/leonwong282/eagle-movie-picture-stitching)
- **問題回報**：[Issues](https://github.com/leonwong282/eagle-movie-picture-stitching/issues)
- **功能建議**：[Discussions](https://github.com/leonwong282/eagle-movie-picture-stitching/discussions)
- **文件說明**：[Wiki](https://github.com/leonwong282/eagle-movie-picture-stitching/wiki)

---

<div align="center">

**如果本插件對你有幫助，請給予 ⭐ Star 支持！**

Made with ❤️ for the Eagle community

*致力於讓數位資產管理更輕鬆*

</div>

<p align="right">(<a href="#readme-top">回到頂部</a>)</p>
