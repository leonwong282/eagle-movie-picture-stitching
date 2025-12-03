---
sidebar_position: 5
title: 視窗控制
description: 控制外掛視窗的外觀和行為
---

# 視窗控制

控制外掛視窗的大小、位置、可見性和行為。

## 匯入

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## 顯示/隱藏視窗

### 顯示視窗

將外掛視窗帶到前景。

```tsx
await eagleApi.window.show();
```

### 隱藏視窗

隱藏外掛視窗。

```tsx
await eagleApi.window.hide();
```

### 關閉視窗

完全關閉外掛視窗。

```tsx
await eagleApi.window.close();
```

## 視窗大小

### 設定大小

設定視窗尺寸。

```tsx
await eagleApi.window.setSize(width, height);
```

**參數：**
- `width: number` - 視窗寬度（像素）
- `height: number` - 視窗高度（像素）

```tsx
// 設為 800x600
await eagleApi.window.setSize(800, 600);
```

### 設定最小大小

設定視窗允許的最小尺寸。

```tsx
await eagleApi.window.setMinimumSize(minWidth, minHeight);
```

```tsx
// 防止視窗小於 400x300
await eagleApi.window.setMinimumSize(400, 300);
```

### 設定最大大小

設定視窗允許的最大尺寸。

```tsx
await eagleApi.window.setMaximumSize(maxWidth, maxHeight);
```

```tsx
// 限制視窗最大為 1200x800
await eagleApi.window.setMaximumSize(1200, 800);
```

## 視窗位置

### 設定位置

將視窗移動到指定座標。

```tsx
await eagleApi.window.setPosition(x, y);
```

**參數：**
- `x: number` - 從螢幕左側的 X 座標
- `y: number` - 從螢幕頂部的 Y 座標

```tsx
// 移到左上角
await eagleApi.window.setPosition(0, 0);

// 置中於螢幕（近似值）
await eagleApi.window.setPosition(
  (screenWidth - windowWidth) / 2,
  (screenHeight - windowHeight) / 2
);
```

### 視窗置中

將視窗置於螢幕中央。

```tsx
await eagleApi.window.center();
```

## 視窗狀態

### 最小化

將視窗最小化到 Dock/工作列。

```tsx
await eagleApi.window.minimize();
```

### 最大化/還原

在最大化和正常狀態之間切換。

```tsx
// 最大化
await eagleApi.window.maximize();

// 從最大化還原
await eagleApi.window.unmaximize();
```

### 檢查最大化狀態

```tsx
const isMaximized = await eagleApi.window.isMaximized();
```

### 全螢幕

切換全螢幕模式。

```tsx
await eagleApi.window.setFullScreen(true);

// 退出全螢幕
await eagleApi.window.setFullScreen(false);
```

## 視窗行為

### 置頂顯示

保持視窗在其他視窗之上。

```tsx
await eagleApi.window.setAlwaysOnTop(true);

// 停用
await eagleApi.window.setAlwaysOnTop(false);
```

### 聚焦視窗

聚焦外掛視窗（帶到前景並啟用）。

```tsx
await eagleApi.window.focus();
```

### 檢查聚焦狀態

```tsx
const isFocused = await eagleApi.window.isFocused();
```

### 檢查可見狀態

```tsx
const isVisible = await eagleApi.window.isVisible();
```

## 視窗外觀

### 設定不透明度

設定視窗透明度（0.0 到 1.0）。

```tsx
await eagleApi.window.setOpacity(0.9); // 90% 不透明
```

### 設定背景顏色

設定視窗背景顏色。

```tsx
await eagleApi.window.setBackgroundColor('#1a1a1a');
```

### 可調整大小

控制視窗是否可以調整大小。

```tsx
await eagleApi.window.setResizable(true);

// 鎖定大小
await eagleApi.window.setResizable(false);
```

### 可移動

控制視窗是否可以移動。

```tsx
await eagleApi.window.setMovable(true);

// 鎖定位置
await eagleApi.window.setMovable(false);
```

## 常見模式

### 響應式視窗

根據內容調整視窗：

```tsx
async function adjustWindowToContent(contentHeight: number) {
  const baseHeight = 100; // 標頭、內距等
  const maxHeight = 800;
  
  const targetHeight = Math.min(
    baseHeight + contentHeight,
    maxHeight
  );
  
  await eagleApi.window.setSize(600, targetHeight);
}
```

### 精簡模式切換

```tsx
const [isCompact, setIsCompact] = useState(false);

async function toggleCompactMode() {
  if (isCompact) {
    await eagleApi.window.setSize(800, 600);
  } else {
    await eagleApi.window.setSize(400, 200);
  }
  setIsCompact(!isCompact);
}
```

### 子母畫面模式

```tsx
async function enablePiP() {
  await eagleApi.window.setAlwaysOnTop(true);
  await eagleApi.window.setSize(320, 240);
  await eagleApi.window.setOpacity(0.9);
}

async function disablePiP() {
  await eagleApi.window.setAlwaysOnTop(false);
  await eagleApi.window.setSize(800, 600);
  await eagleApi.window.setOpacity(1);
}
```

### 記住視窗位置

```tsx
const STORAGE_KEY = 'window-bounds';

async function saveWindowBounds() {
  const bounds = {
    width: window.innerWidth,
    height: window.innerHeight,
    // 位置需要額外的 API
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bounds));
}

async function restoreWindowBounds() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const { width, height } = JSON.parse(saved);
    await eagleApi.window.setSize(width, height);
  }
}
```

## 拖曳區域

對於無邊框視窗，在 CSS 中指定可拖曳區域：

```css
/* 標頭可拖曳 */
.drag-region {
  -webkit-app-region: drag;
}

/* 標頭內的按鈕不可拖曳 */
.drag-region button,
.drag-region input,
.no-drag {
  -webkit-app-region: no-drag;
}
```

```tsx
<header className="drag-region">
  <h1>外掛標題</h1>
  <button className="no-drag" onClick={handleClose}>
    關閉
  </button>
</header>
```

## 瀏覽器 vs Eagle 行為

| 方法 | 瀏覽器（模擬） | Eagle |
|------|----------------|-------|
| `show()` | 無操作 | 顯示視窗 |
| `hide()` | 無操作 | 隱藏視窗 |
| `setSize()` | 無操作 | 調整視窗大小 |
| `setPosition()` | 無操作 | 移動視窗 |
| `setAlwaysOnTop()` | 無操作 | 視窗置頂 |
| `center()` | 無操作 | 視窗置中 |

## 最佳實踐

### ✅ 建議

```tsx
// 在 manifest.json 中設定大小限制
{
  "main": {
    "minWidth": 400,
    "minHeight": 300,
    "width": 800,
    "height": 600
  }
}

// 為自訂標題列使用 CSS 拖曳區域
<header className="drag-region">

// 尊重使用者偏好
const savedSize = localStorage.getItem('windowSize');
```

### ❌ 避免

```tsx
// 不要讓視窗太小
await eagleApi.window.setSize(100, 100); // 無法使用！

// 沒有充分理由不要停用調整大小功能
await eagleApi.window.setResizable(false);

// 未經使用者同意不要強制置頂
await eagleApi.window.setAlwaysOnTop(true); // 先詢問！
```

## 相關資源

- [Eagle API 概覽](./overview) - API 介紹
- [事件與生命週期](./events-lifecycle) - 視窗事件
- [Header 元件](../components/ui/header) - 視窗控制 UI
