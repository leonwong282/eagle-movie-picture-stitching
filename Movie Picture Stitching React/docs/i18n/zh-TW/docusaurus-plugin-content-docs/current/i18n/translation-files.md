---
sidebar_position: 3
title: 翻譯檔案
description: 翻譯檔案格式和結構
---

# 翻譯檔案

翻譯檔案是位於 `_locales/` 目錄中的 JSON 檔案，包含每種支援語言的所有面向使用者的文字。

## 檔案結構

```
_locales/
├── en.json        # 英文（主要/回退）
├── zh_CN.json     # 簡體中文
├── zh_TW.json     # 繁體中文
├── ja_JP.json     # 日文
├── ko_KR.json     # 韓文
├── de_DE.json     # 德文
├── es_ES.json     # 西班牙文
└── ru_RU.json     # 俄文
```

## JSON 格式

### 基本結構

```json
{
  "manifest": {
    "app": {
      "name": "我的外掛",
      "description": "一個實用的 Eagle 外掛"
    }
  },
  "app": {
    "title": "我的外掛",
    "version": "版本 {{version}}"
  },
  "ui": {
    "buttons": {
      "save": "儲存",
      "cancel": "取消",
      "export": "匯出",
      "import": "匯入"
    },
    "labels": {
      "quality": "品質",
      "format": "格式",
      "filename": "檔案名稱"
    }
  },
  "messages": {
    "success": "操作成功完成",
    "error": "發生錯誤：{{error}}",
    "confirm": "您確定嗎？"
  }
}
```

### 鍵命名慣例

| 模式 | 使用情境 | 範例 |
|------|----------|------|
| `section.item` | 簡單分組 | `app.title` |
| `section.subsection.item` | 深層巢狀 | `ui.buttons.save` |
| `feature.action` | 基於功能 | `export.start` |
| `component.element` | 基於元件 | `header.logo` |

## 變數插值

### 基本變數

```json
{
  "greeting": "你好，{{name}}！",
  "count": "您有 {{count}} 個項目"
}
```

```tsx
t('greeting', { name: '使用者' })  // "你好，使用者！"
t('count', { count: 5 })           // "您有 5 個項目"
```

### 多個變數

```json
{
  "exportProgress": "正在匯出 {{current}} / {{total}}（{{percent}}%）"
}
```

```tsx
t('exportProgress', { 
  current: 5, 
  total: 10, 
  percent: 50 
})
// "正在匯出 5 / 10（50%）"
```

### 預設值

```json
{
  "welcome": "歡迎，{{name, 訪客}}！"
}
```

```tsx
t('welcome')                    // "歡迎，訪客！"
t('welcome', { name: 'Alice' }) // "歡迎，Alice！"
```

## 複數形式

### 英文（和類似語言）

```json
{
  "item": "{{count}} item",
  "item_plural": "{{count}} items",
  "item_zero": "No items"
}
```

```tsx
t('item', { count: 0 })  // "No items"
t('item', { count: 1 })  // "1 item"
t('item', { count: 5 })  // "5 items"
```

### 複雜複數形式（俄文等）

俄文有更複雜的複數形式：

```json
{
  "item_one": "{{count}} элемент",
  "item_few": "{{count}} элемента",
  "item_many": "{{count}} элементов"
}
```

### 序數

```json
{
  "position_ordinal_one": "第 {{count}} 名",
  "position_ordinal_two": "第 {{count}} 名",
  "position_ordinal_few": "第 {{count}} 名",
  "position_ordinal_other": "第 {{count}} 名"
}
```

## 巢狀和上下文

### 巢狀鍵

```json
{
  "settings": {
    "theme": {
      "label": "主題",
      "options": {
        "light": "淺色",
        "dark": "深色",
        "auto": "系統"
      }
    }
  }
}
```

```tsx
t('settings.theme.label')          // "主題"
t('settings.theme.options.dark')   // "深色"
```

### 基於上下文的翻譯

```json
{
  "friend": "一位朋友",
  "friend_male": "一位男性朋友",
  "friend_female": "一位女性朋友"
}
```

```tsx
t('friend')                          // "一位朋友"
t('friend', { context: 'male' })     // "一位男性朋友"
t('friend', { context: 'female' })   // "一位女性朋友"
```

## 完整範例

### 英文 (`en.json`)

```json
{
  "manifest": {
    "app": {
      "name": "Eagle React Template",
      "description": "Modern React template for Eagle plugins"
    }
  },
  "app": {
    "title": "Eagle React Template",
    "loading": "Loading..."
  },
  "demo": {
    "title": "Demo",
    "tabs": {
      "selection": "Selection",
      "components": "Components",
      "forms": "Forms",
      "dialogs": "Dialogs"
    },
    "selectedCount": "{{count}} items selected",
    "noSelection": "No items selected"
  },
  "ui": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "export": "Export",
      "refresh": "Refresh",
      "reset": "Reset"
    },
    "labels": {
      "quality": "Quality",
      "format": "Output Format",
      "theme": "Theme"
    },
    "placeholders": {
      "search": "Search...",
      "filename": "Enter filename"
    }
  },
  "settings": {
    "title": "Settings",
    "theme": {
      "label": "Theme",
      "light": "Light",
      "dark": "Dark",
      "auto": "System"
    },
    "language": {
      "label": "Language"
    }
  },
  "messages": {
    "success": "Success!",
    "error": "Error: {{message}}",
    "saved": "Changes saved successfully",
    "exportComplete": "Exported {{count}} items",
    "confirmDelete": "Are you sure you want to delete this?"
  },
  "errors": {
    "generic": "Something went wrong",
    "network": "Network error. Please try again.",
    "notFound": "Item not found"
  }
}
```

### 繁體中文 (`zh_TW.json`)

```json
{
  "manifest": {
    "app": {
      "name": "Eagle React 模板",
      "description": "用於 Eagle 外掛的現代 React 模板"
    }
  },
  "app": {
    "title": "Eagle React 模板",
    "loading": "載入中..."
  },
  "demo": {
    "title": "示範",
    "tabs": {
      "selection": "選取",
      "components": "元件",
      "forms": "表單",
      "dialogs": "對話框"
    },
    "selectedCount": "已選取 {{count}} 個項目",
    "noSelection": "未選取任何項目"
  },
  "ui": {
    "buttons": {
      "save": "儲存",
      "cancel": "取消",
      "export": "匯出",
      "refresh": "重新整理",
      "reset": "重設"
    },
    "labels": {
      "quality": "品質",
      "format": "輸出格式",
      "theme": "主題"
    },
    "placeholders": {
      "search": "搜尋...",
      "filename": "輸入檔案名稱"
    }
  },
  "settings": {
    "title": "設定",
    "theme": {
      "label": "主題",
      "light": "淺色",
      "dark": "深色",
      "auto": "跟隨系統"
    },
    "language": {
      "label": "語言"
    }
  },
  "messages": {
    "success": "成功！",
    "error": "錯誤：{{message}}",
    "saved": "變更已成功儲存",
    "exportComplete": "已匯出 {{count}} 個項目",
    "confirmDelete": "確定要刪除嗎？"
  },
  "errors": {
    "generic": "發生錯誤",
    "network": "網路錯誤，請重試。",
    "notFound": "找不到項目"
  }
}
```

## 新增語言

1. **建立 JSON 檔案：**

```bash
# 以英文為模板複製
cp _locales/en.json _locales/fr_FR.json
```

2. **翻譯所有鍵：**

```json
// _locales/fr_FR.json
{
  "app": {
    "title": "Modèle Eagle React",
    "loading": "Chargement..."
  }
  // ... 翻譯所有鍵
}
```

3. **新增到 i18n 設定：**

```tsx
// src/lib/i18n.ts
import fr_FR from '../../_locales/fr_FR.json';

const resources = {
  // ... 現有語言
  fr_FR: { translation: fr_FR },
};
```

4. **新增到語言對應：**

```tsx
const LANGUAGE_MAP = {
  // ... 現有對應
  'fr': 'fr_FR',
  'fr-FR': 'fr_FR',
  'fr-CA': 'fr_FR',
};

const SUPPORTED_LANGUAGES = [
  // ... 現有語言
  'fr_FR',
];
```

5. **更新 manifest.json：**

```json
{
  "languages": ["en", "zh_CN", "zh_TW", "ja_JP", "ko_KR", "de_DE", "es_ES", "ru_RU", "fr_FR"]
}
```

## 驗證

### 檢查缺少的鍵

```tsx
// 開發工具
function validateTranslations() {
  const baseKeys = getAllKeys(en);
  const languages = { zh_CN, zh_TW, ja_JP, ko_KR, de_DE, es_ES, ru_RU };
  
  for (const [lang, translations] of Object.entries(languages)) {
    const langKeys = getAllKeys(translations);
    const missing = baseKeys.filter(key => !langKeys.includes(key));
    
    if (missing.length > 0) {
      console.warn(`[i18n] ${lang} 缺少的鍵：`, missing);
    }
  }
}

function getAllKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return getAllKeys(value, fullKey);
    }
    return [fullKey];
  });
}
```

### 執行階段回退警告

```tsx
// 使用回退時記錄
i18n.on('missingKey', (lng, ns, key) => {
  console.warn(`[i18n] 缺少的鍵：${key}，語言：${lng}`);
});
```

## 最佳實踐

### ✅ 建議

```json
// 使用描述性鍵名
{
  "settings.theme.label": "主題",
  "settings.theme.description": "選擇您偏好的主題"
}

// 分組相關翻譯
{
  "export": {
    "button": "匯出",
    "progress": "匯出中...",
    "success": "匯出完成",
    "error": "匯出失敗"
  }
}

// 對動態內容使用變數
{
  "itemCount": "{{count}} 個項目"
}
```

### ❌ 避免

```json
// 不要使用通用鍵
{
  "text1": "儲存",
  "text2": "取消"
}

// 不要串接翻譯
// 程式碼中的錯誤做法：
// t('hello') + ' ' + t('world')

// 不要硬編碼數字/格式
{
  "date": "2024/12/25"  // 使用日期格式化函式庫
}

// 不要重複翻譯
{
  "saveButton": "儲存",
  "saveAction": "儲存"  // 重用 'saveButton'
}
```

## 相關資源

- [i18n 概覽](./overview) - 設定和使用
- [語言偵測](./language-detection) - 偵測策略
