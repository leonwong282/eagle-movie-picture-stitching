# Manifest Configuration

The `manifest.json` file defines your Eagle plugin's metadata, window configuration, and capabilities. This file is required for all Eagle plugins.

## Basic Structure

```json title="manifest.json"
{
  "id": "7af1dd74-1da3-4892-962d-ce5b4a493526",
  "version": "1.0.0",
  "name": "{{manifest.app.name}}",
  "fallbackLanguage": "en",
  "languages": ["en", "zh_TW", "zh_CN", "ja_JP", "ko_KR", "de_DE", "es_ES", "ru_RU"],
  "platform": ["darwin", "win32"],
  "arch": ["x64", "arm64"],
  "main": {
    "url": "dist/index.html",
    "width": 1200,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600,
    "devTools": true,
    "vibrancy": true
  },
  "logo": "public/logo.png"
}
```

## Required Fields

### id

A unique identifier for your plugin. **Must be a valid UUID**.

```json
{
  "id": "7af1dd74-1da3-4892-962d-ce5b4a493526"
}
```

:::tip Generating a UUID
Use any UUID generator:
```bash
# macOS/Linux
uuidgen

# Or use an online generator
# https://www.uuidgenerator.net/
```
:::

:::warning
Never change the `id` after publishing - it's used to identify the plugin for updates.
:::

### name

The display name shown in Eagle's plugin list. Supports i18n keys.

```json
{
  "name": "My Plugin Name"
}
```

**With i18n:**
```json
{
  "name": "{{manifest.app.name}}"
}
```

The translation key is defined in `_locales/*.json`:
```json title="_locales/en.json"
{
  "manifest": {
    "app": {
      "name": "Eagle React Template"
    }
  }
}
```

### main

Configuration for the plugin window.

```json
{
  "main": {
    "url": "dist/index.html"
  }
}
```

:::note Development vs Production
During development, use `dist/index.html`. The deploy script transforms this to `index.html` for production.
:::

## Window Configuration

### Size and Constraints

```json
{
  "main": {
    "url": "dist/index.html",
    "width": 1200,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600,
    "maxWidth": 1920,
    "maxHeight": 1080
  }
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | number | 800 | Initial window width |
| `height` | number | 600 | Initial window height |
| `minWidth` | number | - | Minimum window width |
| `minHeight` | number | - | Minimum window height |
| `maxWidth` | number | - | Maximum window width |
| `maxHeight` | number | - | Maximum window height |

### Window Features

```json
{
  "main": {
    "url": "dist/index.html",
    "devTools": true,
    "vibrancy": true,
    "frame": true,
    "resizable": true,
    "alwaysOnTop": false,
    "transparent": false
  }
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `devTools` | boolean | false | Enable Chrome DevTools (Cmd+Option+I) |
| `vibrancy` | boolean | false | macOS translucency effect |
| `frame` | boolean | true | Show window frame |
| `resizable` | boolean | true | Allow window resizing |
| `alwaysOnTop` | boolean | false | Keep window above others |
| `transparent` | boolean | false | Transparent window background |

### Vibrancy (macOS)

The `vibrancy` option enables macOS-style translucent backgrounds:

```json
{
  "main": {
    "vibrancy": true
  }
}
```

:::note
`vibrancy` only works on macOS. On Windows, it has no effect.
:::

## Internationalization

### Supported Languages

```json
{
  "fallbackLanguage": "en",
  "languages": ["en", "zh_TW", "zh_CN", "ja_JP", "ko_KR", "de_DE", "es_ES", "ru_RU"]
}
```

| Property | Type | Description |
|----------|------|-------------|
| `fallbackLanguage` | string | Default language when user's language isn't supported |
| `languages` | string[] | List of supported language codes |

### Language Codes

| Code | Language |
|------|----------|
| `en` | English |
| `zh_CN` | Simplified Chinese |
| `zh_TW` | Traditional Chinese |
| `ja_JP` | Japanese |
| `ko_KR` | Korean |
| `de_DE` | German |
| `es_ES` | Spanish |
| `ru_RU` | Russian |

### Translation Files

Translations are stored in `_locales/<lang>.json`:

```
_locales/
├── en.json
├── zh_CN.json
├── zh_TW.json
├── ja_JP.json
├── ko_KR.json
├── de_DE.json
├── es_ES.json
└── ru_RU.json
```

**Example translation file:**
```json title="_locales/en.json"
{
  "manifest": {
    "app": {
      "name": "Eagle React Template",
      "description": "Modern React template for Eagle plugins"
    }
  },
  "app": {
    "title": "Eagle React Template",
    "welcome": "Welcome to the plugin"
  }
}
```

## Platform Support

### Platform Targets

```json
{
  "platform": ["darwin", "win32"]
}
```

| Platform | Description |
|----------|-------------|
| `darwin` | macOS |
| `win32` | Windows |

### Architecture

```json
{
  "arch": ["x64", "arm64"]
}
```

| Architecture | Description |
|--------------|-------------|
| `x64` | Intel 64-bit |
| `arm64` | Apple Silicon / ARM 64-bit |

## Version Information

```json
{
  "version": "1.0.0"
}
```

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

## Logo Configuration

```json
{
  "logo": "public/logo.png"
}
```

**Requirements:**
- Format: PNG recommended
- Size: 256x256 pixels minimum
- Path: Relative to project root (transformed during deploy)

:::note Path Transformation
During development, use `public/logo.png`. The deploy script transforms this to `logo.png` in production.
:::

## Optional Fields

### Description

```json
{
  "description": "{{manifest.app.description}}"
}
```

### Author

```json
{
  "author": "Your Name <email@example.com>"
}
```

### Keywords

```json
{
  "keywords": ["image", "processing", "batch"]
}
```

## Complete Example

```json title="manifest.json"
{
  "id": "7af1dd74-1da3-4892-962d-ce5b4a493526",
  "version": "1.0.0",
  "name": "{{manifest.app.name}}",
  "description": "{{manifest.app.description}}",
  "fallbackLanguage": "en",
  "languages": [
    "en",
    "zh_TW",
    "zh_CN",
    "ja_JP",
    "ko_KR",
    "de_DE",
    "es_ES",
    "ru_RU"
  ],
  "platform": ["darwin", "win32"],
  "arch": ["x64", "arm64"],
  "main": {
    "url": "dist/index.html",
    "width": 1200,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600,
    "devTools": true,
    "vibrancy": true,
    "resizable": true
  },
  "logo": "public/logo.png",
  "author": "Eagle Developer",
  "keywords": ["react", "template", "starter"]
}
```

## Validation

### Common Issues

**Invalid JSON:**
```bash
# Validate JSON syntax
npx jsonlint manifest.json
```

**Missing Required Fields:**
```json
// ❌ Missing id
{
  "name": "My Plugin",
  "main": { "url": "index.html" }
}

// ✅ Correct
{
  "id": "unique-uuid-here",
  "name": "My Plugin",
  "main": { "url": "index.html" }
}
```

**Invalid UUID:**
```json
// ❌ Invalid format
{ "id": "my-plugin" }

// ✅ Valid UUID
{ "id": "7af1dd74-1da3-4892-962d-ce5b4a493526" }
```

### JSON Schema

For IDE validation support, create a schema:

```json title="manifest.schema.json"
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "main"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
    },
    "name": { "type": "string" },
    "version": { "type": "string" },
    "main": {
      "type": "object",
      "required": ["url"],
      "properties": {
        "url": { "type": "string" },
        "width": { "type": "number" },
        "height": { "type": "number" }
      }
    }
  }
}
```

Then reference in manifest.json:
```json
{
  "$schema": "./manifest.schema.json",
  "id": "...",
  ...
}
```

## Related

- [Deploy Script](./deploy-script.md) - How paths are transformed
- [i18n Setup](../i18n/overview.md) - Translation configuration
- [Development Workflow](../development/workflow.md) - Testing your plugin
