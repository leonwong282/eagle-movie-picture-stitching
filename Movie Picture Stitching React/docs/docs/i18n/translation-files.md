---
sidebar_position: 3
title: Translation Files
description: Translation file format and structure
---

# Translation Files

Translation files are JSON files located in the `_locales/` directory, containing all user-facing text for each supported language.

## File Structure

```
_locales/
├── en.json        # English (primary/fallback)
├── zh_CN.json     # Simplified Chinese
├── zh_TW.json     # Traditional Chinese
├── ja_JP.json     # Japanese
├── ko_KR.json     # Korean
├── de_DE.json     # German
├── es_ES.json     # Spanish
└── ru_RU.json     # Russian
```

## JSON Format

### Basic Structure

```json
{
  "manifest": {
    "app": {
      "name": "My Plugin",
      "description": "A useful Eagle plugin"
    }
  },
  "app": {
    "title": "My Plugin",
    "version": "Version {{version}}"
  },
  "ui": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "export": "Export",
      "import": "Import"
    },
    "labels": {
      "quality": "Quality",
      "format": "Format",
      "filename": "Filename"
    }
  },
  "messages": {
    "success": "Operation completed successfully",
    "error": "An error occurred: {{error}}",
    "confirm": "Are you sure?"
  }
}
```

### Key Naming Conventions

| Pattern | Use Case | Example |
|---------|----------|---------|
| `section.item` | Simple grouping | `app.title` |
| `section.subsection.item` | Deep nesting | `ui.buttons.save` |
| `feature.action` | Feature-based | `export.start` |
| `component.element` | Component-based | `header.logo` |

## Variable Interpolation

### Basic Variables

```json
{
  "greeting": "Hello, {{name}}!",
  "count": "You have {{count}} items"
}
```

```tsx
t('greeting', { name: 'User' })  // "Hello, User!"
t('count', { count: 5 })         // "You have 5 items"
```

### Multiple Variables

```json
{
  "exportProgress": "Exporting {{current}} of {{total}} ({{percent}}%)"
}
```

```tsx
t('exportProgress', { 
  current: 5, 
  total: 10, 
  percent: 50 
})
// "Exporting 5 of 10 (50%)"
```

### Default Values

```json
{
  "welcome": "Welcome, {{name, Guest}}!"
}
```

```tsx
t('welcome')                    // "Welcome, Guest!"
t('welcome', { name: 'Alice' }) // "Welcome, Alice!"
```

## Pluralization

### English (and similar languages)

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

### Complex Pluralization (Russian, etc.)

Russian has more complex plural forms:

```json
{
  "item_one": "{{count}} элемент",
  "item_few": "{{count}} элемента",
  "item_many": "{{count}} элементов"
}
```

### Ordinal Numbers

```json
{
  "position_ordinal_one": "{{count}}st place",
  "position_ordinal_two": "{{count}}nd place",
  "position_ordinal_few": "{{count}}rd place",
  "position_ordinal_other": "{{count}}th place"
}
```

## Nesting and Context

### Nested Keys

```json
{
  "settings": {
    "theme": {
      "label": "Theme",
      "options": {
        "light": "Light",
        "dark": "Dark",
        "auto": "System"
      }
    }
  }
}
```

```tsx
t('settings.theme.label')          // "Theme"
t('settings.theme.options.dark')   // "Dark"
```

### Context-Based Translations

```json
{
  "friend": "A friend",
  "friend_male": "A boyfriend",
  "friend_female": "A girlfriend"
}
```

```tsx
t('friend')                          // "A friend"
t('friend', { context: 'male' })     // "A boyfriend"
t('friend', { context: 'female' })   // "A girlfriend"
```

## Complete Example

### English (`en.json`)

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

### Simplified Chinese (`zh_CN.json`)

```json
{
  "manifest": {
    "app": {
      "name": "Eagle React 模板",
      "description": "用于 Eagle 插件的现代 React 模板"
    }
  },
  "app": {
    "title": "Eagle React 模板",
    "loading": "加载中..."
  },
  "demo": {
    "title": "演示",
    "tabs": {
      "selection": "选择",
      "components": "组件",
      "forms": "表单",
      "dialogs": "对话框"
    },
    "selectedCount": "已选择 {{count}} 个项目",
    "noSelection": "未选择任何项目"
  },
  "ui": {
    "buttons": {
      "save": "保存",
      "cancel": "取消",
      "export": "导出",
      "refresh": "刷新",
      "reset": "重置"
    },
    "labels": {
      "quality": "质量",
      "format": "输出格式",
      "theme": "主题"
    },
    "placeholders": {
      "search": "搜索...",
      "filename": "输入文件名"
    }
  },
  "settings": {
    "title": "设置",
    "theme": {
      "label": "主题",
      "light": "浅色",
      "dark": "深色",
      "auto": "跟随系统"
    },
    "language": {
      "label": "语言"
    }
  },
  "messages": {
    "success": "成功！",
    "error": "错误：{{message}}",
    "saved": "更改已成功保存",
    "exportComplete": "已导出 {{count}} 个项目",
    "confirmDelete": "确定要删除吗？"
  },
  "errors": {
    "generic": "出了点问题",
    "network": "网络错误，请重试。",
    "notFound": "未找到项目"
  }
}
```

## Adding a New Language

1. **Create the JSON file:**

```bash
# Copy English as template
cp _locales/en.json _locales/fr_FR.json
```

2. **Translate all keys:**

```json
// _locales/fr_FR.json
{
  "app": {
    "title": "Modèle Eagle React",
    "loading": "Chargement..."
  }
  // ... translate all keys
}
```

3. **Add to i18n configuration:**

```tsx
// src/lib/i18n.ts
import fr_FR from '../../_locales/fr_FR.json';

const resources = {
  // ... existing languages
  fr_FR: { translation: fr_FR },
};
```

4. **Add to language map:**

```tsx
const LANGUAGE_MAP = {
  // ... existing mappings
  'fr': 'fr_FR',
  'fr-FR': 'fr_FR',
  'fr-CA': 'fr_FR',
};

const SUPPORTED_LANGUAGES = [
  // ... existing languages
  'fr_FR',
];
```

5. **Update manifest.json:**

```json
{
  "languages": ["en", "zh_CN", "zh_TW", "ja_JP", "ko_KR", "de_DE", "es_ES", "ru_RU", "fr_FR"]
}
```

## Validation

### Check for Missing Keys

```tsx
// Development utility
function validateTranslations() {
  const baseKeys = getAllKeys(en);
  const languages = { zh_CN, zh_TW, ja_JP, ko_KR, de_DE, es_ES, ru_RU };
  
  for (const [lang, translations] of Object.entries(languages)) {
    const langKeys = getAllKeys(translations);
    const missing = baseKeys.filter(key => !langKeys.includes(key));
    
    if (missing.length > 0) {
      console.warn(`[i18n] ${lang} missing keys:`, missing);
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

### Runtime Fallback Warning

```tsx
// Log when fallback is used
i18n.on('missingKey', (lng, ns, key) => {
  console.warn(`[i18n] Missing key: ${key} for ${lng}`);
});
```

## Best Practices

### ✅ Do

```json
// Use descriptive key names
{
  "settings.theme.label": "Theme",
  "settings.theme.description": "Choose your preferred theme"
}

// Group related translations
{
  "export": {
    "button": "Export",
    "progress": "Exporting...",
    "success": "Export complete",
    "error": "Export failed"
  }
}

// Use variables for dynamic content
{
  "itemCount": "{{count}} items"
}
```

### ❌ Don't

```json
// Don't use generic keys
{
  "text1": "Save",
  "text2": "Cancel"
}

// Don't concatenate translations
// Wrong approach in code:
// t('hello') + ' ' + t('world')

// Don't hardcode numbers/formats
{
  "date": "12/25/2024"  // Use date formatting libraries
}

// Don't duplicate translations
{
  "saveButton": "Save",
  "saveAction": "Save"  // Reuse 'saveButton'
}
```

## Related

- [i18n Overview](./overview) - Setup and usage
- [Language Detection](./language-detection) - Detection strategies
