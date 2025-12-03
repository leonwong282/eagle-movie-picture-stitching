# Manifest 設定

本指南詳細說明 Eagle 外掛程式 `manifest.json` 設定檔。

## 概觀

`manifest.json` 檔案定義外掛程式的元資料、視窗設定和功能。Eagle 使用此檔案來識別、顯示和載入您的外掛程式。

## 完整 Manifest 結構

```json
{
  "id": "7af1dd74-1da3-4892-962d-ce5b4a493526",
  "name": "{{manifest.app.name}}",
  "version": "1.0.0",
  "description": "{{manifest.app.description}}",
  "fallbackLanguage": "en",
  "languages": ["en", "zh_TW", "zh_CN", "ja_JP", "ko_KR", "de_DE", "es_ES", "ru_RU"],
  "main": {
    "url": "dist/index.html",
    "width": 1200,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600,
    "maxWidth": 2560,
    "maxHeight": 1440,
    "frame": true,
    "vibrancy": true,
    "devTools": true
  },
  "logo": "public/logo.png",
  "platform": ["darwin", "win32"],
  "arch": ["x64", "arm64"],
  "keywords": ["react", "template"],
  "categories": ["utility"],
  "nativeModules": false,
  "preview": {
    "image": "public/preview.png",
    "description": "{{manifest.preview.description}}"
  }
}
```

## 必要欄位

### `id`

唯一識別碼（UUID v4 格式）：

```json
{
  "id": "7af1dd74-1da3-4892-962d-ce5b4a493526"
}
```

**要求：**
- 必須是有效的 UUID v4 格式
- 必須是全域唯一的
- 一旦發布不應更改

**生成新 ID：**

```javascript
// 瀏覽器或 Node.js
crypto.randomUUID()

// 命令列
uuidgen  // macOS/Linux
```

### `name`

顯示名稱（支援 i18n）：

```json
{
  "name": "{{manifest.app.name}}"
}
```

使用 `{{key}}` 語法時，值從 `_locales/` 翻譯檔案讀取：

```json
// _locales/en.json
{
  "manifest": {
    "app": {
      "name": "Eagle React Template"
    }
  }
}
```

### `version`

語意化版本：

```json
{
  "version": "1.0.0"
}
```

遵循 [語意化版本](https://semver.org/) 規範：
- 主版本：重大變更
- 次版本：新功能（向下相容）
- 修補版本：錯誤修復

### `main`

主視窗設定：

```json
{
  "main": {
    "url": "dist/index.html",
    "width": 1200,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600,
    "maxWidth": 2560,
    "maxHeight": 1440,
    "frame": true,
    "vibrancy": true,
    "devTools": true
  }
}
```

## 視窗設定選項

### 尺寸設定

| 屬性 | 類型 | 描述 |
|------|------|------|
| `width` | number | 初始寬度（像素） |
| `height` | number | 初始高度（像素） |
| `minWidth` | number | 最小寬度 |
| `minHeight` | number | 最小高度 |
| `maxWidth` | number | 最大寬度 |
| `maxHeight` | number | 最大高度 |

### 視窗外觀

| 屬性 | 類型 | 預設值 | 描述 |
|------|------|--------|------|
| `frame` | boolean | `true` | 顯示原生視窗框架 |
| `vibrancy` | boolean | `false` | macOS 半透明效果 |
| `devTools` | boolean | `false` | 允許 DevTools |

### URL 設定

開發與部署使用不同路徑：

```json
// 開發（manifest.json 在專案根目錄）
{
  "main": {
    "url": "dist/index.html"
  }
}

// 部署後（由部署腳本轉換）
{
  "main": {
    "url": "index.html"
  }
}
```

:::tip
保持開發路徑在 `manifest.json` 中 - 部署腳本會自動轉換。
:::

## 國際化設定

### `languages`

支援的語言代碼陣列：

```json
{
  "languages": [
    "en",      // 英文
    "zh_CN",   // 簡體中文
    "zh_TW",   // 繁體中文
    "ja_JP",   // 日文
    "ko_KR",   // 韓文
    "de_DE",   // 德文
    "es_ES",   // 西班牙文
    "ru_RU"    // 俄文
  ]
}
```

### `fallbackLanguage`

當使用者語言不在支援列表時使用的語言：

```json
{
  "fallbackLanguage": "en"
}
```

### i18n 鍵語法

在 manifest 字串值中使用 `{{key}}` 語法：

```json
{
  "name": "{{manifest.app.name}}",
  "description": "{{manifest.app.description}}"
}
```

對應的翻譯檔案：

```json
// _locales/en.json
{
  "manifest": {
    "app": {
      "name": "My Plugin",
      "description": "Plugin description"
    }
  }
}

// _locales/zh_TW.json
{
  "manifest": {
    "app": {
      "name": "我的外掛程式",
      "description": "外掛程式描述"
    }
  }
}
```

## 平台設定

### `platform`

支援的作業系統：

```json
{
  "platform": ["darwin", "win32"]
}
```

可用值：
- `darwin` - macOS
- `win32` - Windows

### `arch`

支援的 CPU 架構：

```json
{
  "arch": ["x64", "arm64"]
}
```

可用值：
- `x64` - Intel/AMD 64 位元
- `arm64` - Apple Silicon / ARM

## 外掛程式元資料

### `logo`

外掛程式圖示路徑：

```json
{
  "logo": "public/logo.png"
}
```

**要求：**
- 推薦尺寸：128x128 像素
- 支援格式：PNG、SVG
- 部署腳本會移除 `public/` 前綴

### `keywords`

搜尋關鍵字：

```json
{
  "keywords": ["react", "template", "utility"]
}
```

### `categories`

外掛程式分類：

```json
{
  "categories": ["utility"]
}
```

可用類別：
- `utility` - 工具類
- `productivity` - 生產力
- `design` - 設計工具
- `developer` - 開發者工具

### `preview`

預覽圖片和描述（用於外掛程式商店）：

```json
{
  "preview": {
    "image": "public/preview.png",
    "description": "{{manifest.preview.description}}"
  }
}
```

## 原生模組

### `nativeModules`

指示外掛程式是否使用 Node.js 原生模組：

```json
{
  "nativeModules": false
}
```

**何時設為 `true`：**
- 使用需要編譯的 Node.js 套件
- 使用 `ffi-napi`、`sharp` 等原生綁定
- 需要特定平台的二進位檔案

:::warning
使用原生模組會增加部署複雜度，因為需要為每個平台/架構組合預編譯。
:::

## 完整範例

### 簡單工具外掛程式

```json
{
  "id": "abc12345-1234-5678-9abc-def012345678",
  "name": "Simple Tool",
  "version": "1.0.0",
  "description": "A simple utility plugin",
  "fallbackLanguage": "en",
  "languages": ["en", "zh_CN"],
  "main": {
    "url": "dist/index.html",
    "width": 600,
    "height": 400,
    "minWidth": 400,
    "minHeight": 300
  },
  "logo": "public/logo.png",
  "platform": ["darwin", "win32"],
  "keywords": ["utility"],
  "categories": ["utility"]
}
```

### 多語言全功能外掛程式

```json
{
  "id": "7af1dd74-1da3-4892-962d-ce5b4a493526",
  "name": "{{manifest.app.name}}",
  "version": "1.2.0",
  "description": "{{manifest.app.description}}",
  "fallbackLanguage": "en",
  "languages": ["en", "zh_TW", "zh_CN", "ja_JP", "ko_KR", "de_DE", "es_ES", "ru_RU"],
  "main": {
    "url": "dist/index.html",
    "width": 1200,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600,
    "maxWidth": 2560,
    "maxHeight": 1440,
    "frame": true,
    "vibrancy": true,
    "devTools": true
  },
  "logo": "public/logo.png",
  "platform": ["darwin", "win32"],
  "arch": ["x64", "arm64"],
  "keywords": ["react", "template", "productivity"],
  "categories": ["utility", "developer"],
  "preview": {
    "image": "public/preview.png",
    "description": "{{manifest.preview.description}}"
  }
}
```

## 驗證

### 驗證腳本

```javascript
// scripts/validate-manifest.js
import fs from 'fs/promises';

const validateManifest = async () => {
  const manifest = JSON.parse(
    await fs.readFile('manifest.json', 'utf-8')
  );
  
  const errors = [];
  
  // 檢查必要欄位
  if (!manifest.id) errors.push('缺少 id');
  if (!manifest.name) errors.push('缺少 name');
  if (!manifest.version) errors.push('缺少 version');
  if (!manifest.main?.url) errors.push('缺少 main.url');
  
  // 驗證 UUID 格式
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(manifest.id)) {
    errors.push('id 不是有效的 UUID v4');
  }
  
  // 驗證版本格式
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(manifest.version)) {
    errors.push('version 不是有效的語意化版本');
  }
  
  // 檢查 i18n 鍵
  if (manifest.name.includes('{{')) {
    const localesDir = '_locales';
    for (const lang of manifest.languages || ['en']) {
      const localeFile = `${localesDir}/${lang}.json`;
      try {
        await fs.access(localeFile);
      } catch {
        errors.push(`缺少語言檔案: ${localeFile}`);
      }
    }
  }
  
  if (errors.length > 0) {
    console.error('Manifest 驗證失敗:');
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
  
  console.log('✅ Manifest 驗證通過');
};

validateManifest();
```

### 整合到建置流程

```json
// package.json
{
  "scripts": {
    "validate": "node scripts/validate-manifest.js",
    "prebuild": "npm run validate",
    "build": "vite build"
  }
}
```

## 疑難排解

### 常見錯誤

**外掛程式不顯示在 Eagle 中**
- 檢查 `id` 是否唯一
- 確認 `main.url` 路徑正確
- 驗證 JSON 語法正確

**i18n 鍵不解析**
- 確認語言檔案存在於 `_locales/` 目錄
- 檢查鍵路徑是否正確
- 驗證 JSON 格式

**視窗大小不正確**
- 確認 `minWidth`/`minHeight` 不大於 `width`/`height`
- 檢查 `maxWidth`/`maxHeight` 設定

## 相關資源

- [部署腳本](./deploy-script.md) - 自動部署設定
- [CI/CD 管線](./ci-cd.md) - 自動化部署
- [國際化概觀](../i18n/overview.md) - 翻譯系統
