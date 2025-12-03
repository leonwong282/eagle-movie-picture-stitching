# 已知限制

本文件概述使用 React Template 開發 Eagle 外掛程式時的當前限制和約束。

## 瀏覽器與 Eagle 環境

### API 可用性

| 功能 | 瀏覽器開發 | Eagle 執行環境 |
|------|------------|----------------|
| `window.eagle` | ❌ 未定義 | ✅ 可用 |
| `require()` | ❌ 不可用 | ✅ Node.js require |
| 檔案系統 | ❌ 無存取權 | ✅ 完整存取 |
| localStorage | ✅ 可用 | ✅ 可用 |
| 選取輪詢 | ⚠️ 模擬資料 | ✅ 真實選取 |

### 環境偵測

使用 Eagle 特定功能前始終檢查環境：

```typescript
import { isEagleEnvironment, eagleApi } from '@/lib/eagle-api';

if (isEagleEnvironment()) {
  // 可以安全使用 Eagle API
  const items = await eagleApi.getSelectedItems();
} else {
  // 瀏覽器模式 - 使用模擬資料或停用功能
  console.log('在瀏覽器模式下執行');
}
```

## Canvas 限制

### 最大 Canvas 尺寸

**硬性限制：任何維度 32,767 像素**。

```typescript
const MAX_CANVAS_SIZE = 32767;

function validateCanvasSize(width: number, height: number): boolean {
  if (width > MAX_CANVAS_SIZE || height > MAX_CANVAS_SIZE) {
    throw new Error(
      `Canvas 尺寸 (${width}x${height}) 超過瀏覽器最大值 (${MAX_CANVAS_SIZE}px)`
    );
  }
  return true;
}
```

### 記憶體約束

大型 canvas 操作可能耗盡記憶體：

```typescript
// 估算記憶體使用量（RGBA = 每像素 4 位元組）
function estimateMemoryUsage(width: number, height: number): number {
  return width * height * 4; // 位元組
}

// 範例：10000x10000 圖片 = 400MB
const usage = estimateMemoryUsage(10000, 10000);
console.log(`記憶體使用量: ${(usage / 1024 / 1024).toFixed(2)} MB`);
```

**建議：**
- 大型操作時分批處理圖片
- 完成後釋放 canvas 參照：`canvas.width = 0; canvas.height = 0;`
- 使用 Web Workers 進行繁重處理

## 選取輪詢

### 沒有推送更新

Eagle 不會推送選取變更 - 外掛程式必須輪詢：

```typescript
// Eagle 沒有選取變更事件
// 必須定期輪詢
const POLL_INTERVAL = 500; // 毫秒

function startPolling() {
  setInterval(async () => {
    const selected = await eagleApi.getSelectedItems();
    // 與前一次選取比較
  }, POLL_INTERVAL);
}
```

### 輪詢最佳化

`useEagleSelection` hook 使用基於雜湊的變更偵測來減少重新渲染：

```typescript
// Hook 只在選取實際變更時更新狀態
const { items } = useEagleSelection({
  pollingInterval: 500,
  pauseOnHidden: true, // 分頁隱藏時停止輪詢
});
```

## 檔案路徑處理

### 路徑與 URL

Eagle 提供路徑和 URL - 使用正確的格式：

```typescript
const item = (await eagleApi.getSelectedItems())[0];

// ✅ 使用 filePath 進行 Node.js 操作
const path = item.filePath; // '/Users/.../image.png'

// ❌ 不要使用 fileURL 進行 fs 操作
const url = item.fileURL; // 'file:///Users/.../image.png'
```

### 路徑分隔符號

處理平台差異：

```typescript
import path from 'path';

// ✅ 使用 path.join 處理跨平台路徑
const fullPath = path.join(baseDir, 'subfolder', 'file.png');

// ❌ 不要寫死分隔符號
const badPath = baseDir + '/subfolder/file.png'; // 在 Windows 上失敗
```

## API 時序

### 外掛程式生命週期

某些 API 呼叫在 `onPluginCreate` 之前會失敗：

```typescript
// ❌ 可能失敗 - API 尚未準備好
const locale = eagle.app.locale; // 可能拋出錯誤

// ✅ 等待外掛程式建立
eagle.onPluginCreate(async () => {
  const locale = eagle.app.locale; // 安全
});
```

### 安全初始化

`eagleApi` 適配器使用 try-catch 處理：

```typescript
// 在 eagle-api.ts 中 - 所有 getter 都受保護
get locale(): EagleLocale {
  try {
    return this._api.app?.locale || 'en';
  } catch {
    return 'en'; // 安全預設值
  }
}
```

## 儲存限制

### localStorage 限制

| 瀏覽器 | 典型限制 |
|--------|----------|
| Chrome | 5-10 MB |
| Safari | 5 MB |
| Firefox | 10 MB |

```typescript
// 檢查可用儲存空間
function getStorageUsage(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length * 2; // UTF-16
    }
  }
  return total;
}
```

### 儲存命名空間

所有模板儲存使用前綴以避免衝突：

```typescript
const STORAGE_PREFIX = 'eagle-react-template:';

// 鍵使用命名空間
localStorage.setItem(`${STORAGE_PREFIX}theme`, 'dark');
```

## i18n 限制

### 動態語言偵測

Eagle 地區設定變更需要重新偵測：

```typescript
// 當外掛程式重新顯示時語言可能變更
eagle.onPluginShow(() => {
  const newLocale = eagle.app.locale;
  if (newLocale !== currentLocale) {
    i18n.changeLanguage(newLocale);
  }
});
```

### 缺少翻譯

回退鏈：請求的 → 回退 → 鍵

```typescript
// 如果 'zh_TW' 翻譯缺失，回退到 'en'
i18n.init({
  fallbackLng: 'en',
  lng: 'zh_TW',
});
```

## 建置約束

### 沒有程式碼分割

Eagle 需要單一檔案套件：

```typescript title="vite.config.ts"
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 必要：沒有程式碼分割
        manualChunks: undefined,
      },
    },
  },
});
```

### 相對基礎路徑

必須為 Eagle 使用相對路徑：

```typescript title="vite.config.ts"
export default defineConfig({
  base: './', // Eagle 必要
});
```

## 元件限制

### 視窗拖曳區域

只有使用正確的 CSS 才能運作：

```css
/* Header 必須有拖曳區域用於視窗拖曳 */
.drag-region {
  -webkit-app-region: drag;
}

/* 內部按鈕必須停用拖曳 */
.drag-region button {
  -webkit-app-region: no-drag;
}
```

### 對話框焦點陷阱

Radix UI 對話框可能與 Eagle 視窗有問題：

```typescript
// 可能需要停用 portal 以獲得正確的焦點
<Dialog modal={true}>
  <DialogContent
    onOpenAutoFocus={(e) => e.preventDefault()}
    onCloseAutoFocus={(e) => e.preventDefault()}
  >
    ...
  </DialogContent>
</Dialog>
```

## 效能考量

### 圖片載入

大型圖片可能阻塞主執行緒：

```typescript
// ✅ 非同步載入圖片
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ✅ 使用 Promise.all 搭配逾時
async function loadImages(sources: string[], timeout = 10000) {
  return Promise.all(
    sources.map(src => 
      Promise.race([
        loadImage(src),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ])
    )
  );
}
```

### 批次處理

限制並行操作：

```typescript
async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize = 10
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
}
```

## 變通方法

### 模擬工廠用於測試

使用模擬工廠來模擬 Eagle 環境：

```typescript
// 在瀏覽器開發模式
import { mockController } from '@/lib/mock-factory';

// 模擬不同場景
mockController.preset('largeLibrary'); // 100 個項目
mockController.simulateError('getSelectedItems', 'API error');
```

### 主控台命令

在 Eagle DevTools 中除錯：

```javascript
// 檢查環境
eagleApi.isMock // 在 Eagle 中為 false

// 強制重新整理選取
window.app?.refreshSelection?.()

// 查看已儲存的設定
storageDebug?.viewAll?.()
```

## 未來改進

計劃中或考慮中的功能：

| 功能 | 狀態 | 備註 |
|------|------|------|
| 推送式選取 | ⏳ 等待 Eagle API | 目前需要輪詢 |
| 程式碼分割 | ⏳ 等待 Eagle | 套件大小考量 |
| Service Workers | ❌ 不支援 | Eagle 限制 |
| WebGL 加速 | ⏳ 評估中 | 用於圖片處理 |

## 相關資源

- [雙環境模式](../core-concepts/dual-environment.md) - 了解環境
- [Eagle API 概觀](../eagle-api/overview.md) - API 功能
- [除錯](../development/debugging.md) - 疑難排解技巧
