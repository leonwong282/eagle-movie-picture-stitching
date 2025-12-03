# 類型定義

Eagle React Template 包含完整的 Eagle Plugin API TypeScript 類型定義。這些類型在使用 Eagle 時提供完整的 IntelliSense 支援和類型安全。

## 核心類型

### Item

代表 Eagle 資料庫中的項目（圖片、影片等）。

```typescript
interface Item {
  /** 唯一識別碼 */
  id: string;
  
  /** 不含副檔名的檔案名稱 */
  name: string;
  
  /** 副檔名（例如 'png'、'jpg'） */
  ext: string;
  
  /** 檔案大小（位元組） */
  size: number;
  
  /** 圖片/影片寬度（像素） */
  width: number;
  
  /** 圖片/影片高度（像素） */
  height: number;
  
  /** 檔案絕對路徑 */
  filePath: string;
  
  /** 檔案 URL（file:// 協定） */
  fileURL: string;
  
  /** 縮圖路徑 */
  thumbnailPath: string;
  
  /** 縮圖 URL */
  thumbnailURL: string;
  
  /** 標籤字串陣列 */
  tags: string[];
  
  /** 包含此項目的資料夾 ID 陣列 */
  folders: string[];
  
  /** 星級評分（0-5） */
  star: number;
  
  /** 項目註解/備註 */
  annotation: string;
  
  /** 自訂調色盤顏色 */
  palettes: Palette[];
  
  /** 建立時間戳記 */
  btime: number;
  
  /** 修改時間戳記 */
  mtime: number;
  
  /** 從網頁匯入的來源 URL */
  url?: string;
  
  /** 是否在垃圾桶中 */
  isDeleted: boolean;
  
  /** 持續時間（秒，用於影片/音訊） */
  duration?: number;
  
  /** 無縮圖可用 */
  noThumbnail?: boolean;
  
  /** 無預覽可用 */
  noPreview?: boolean;
}
```

### Folder

代表 Eagle 資料庫中的資料夾。

```typescript
interface Folder {
  /** 唯一識別碼 */
  id: string;
  
  /** 資料夾名稱 */
  name: string;
  
  /** 資料夾描述 */
  description: string;
  
  /** 子資料夾 */
  children: Folder[];
  
  /** 修改時間戳記 */
  modificationTime: number;
  
  /** 資料夾圖示顏色 */
  iconColor?: string;
  
  /** 資料夾封面圖片 */
  cover?: string;
  
  /** 密碼保護 */
  password?: string;
  
  /** 密碼提示 */
  passwordTips?: string;
  
  /** 父資料夾 ID */
  parent?: string;
  
  /** 此資料夾的自訂標籤 */
  tags?: string[];
  
  /** 是否已釘選 */
  pinned?: boolean;
  
  /** 是否為新資料夾 */
  isNew?: boolean;
  
  /** 原始資料夾名稱（用於本地化） */
  originalName?: string;
  
  /** 資料夾圖片 */
  images?: string[];
  
  /** 建立時間戳記 */
  createdAt?: number;
}
```

### Tag

代表 Eagle 資料庫中的標籤。

```typescript
interface Tag {
  /** 標籤名稱 */
  name: string;
  
  /** 具有此標籤的項目數量 */
  count: number;
  
  /** 標籤群組 */
  group?: string;
  
  /** 標籤顏色 */
  color?: string;
  
  /** 快速鍵 */
  shortcut?: string;
}
```

### Palette

項目的調色盤顏色資訊。

```typescript
interface Palette {
  /** 十六進位格式的顏色 */
  color: [number, number, number];
  
  /** 圖片中的顏色比例（0-100） */
  ratio: number;
}
```

## API 類型

### AddItemOptions

新增項目到 Eagle 時的選項。

```typescript
interface AddItemOptions {
  /** 項目名稱 */
  name?: string;
  
  /** 網站 URL 來源 */
  website?: string;
  
  /** 要套用的標籤 */
  tags?: string[];
  
  /** 要加入的資料夾 ID */
  folders?: string[];
  
  /** 註解/備註 */
  annotation?: string;
  
  /** 星級評分（0-5） */
  star?: number;
}
```

### AddFromURLOptions

從 URL 新增項目時的選項。

```typescript
interface AddFromURLOptions extends AddItemOptions {
  /** 請求的自訂標頭 */
  headers?: Record<string, string>;
  
  /** 請求逾時時間（毫秒） */
  timeout?: number;
}
```

### SearchOptions

搜尋項目時的選項。

```typescript
interface SearchOptions {
  /** 搜尋查詢字串 */
  query?: string;
  
  /** 依副檔名篩選 */
  ext?: string | string[];
  
  /** 依標籤篩選 */
  tags?: string[];
  
  /** 依資料夾 ID 篩選 */
  folders?: string[];
  
  /** 最低星級評分 */
  star?: number;
  
  /** 依顏色篩選（十六進位） */
  color?: string;
  
  /** 顏色相似度閾值（0-100） */
  colorSimilarity?: number;
  
  /** 排序欄位 */
  sortBy?: 'name' | 'btime' | 'mtime' | 'size' | 'star';
  
  /** 排序順序 */
  sortOrder?: 'asc' | 'desc';
  
  /** 最大結果數 */
  limit?: number;
  
  /** 結果偏移量 */
  offset?: number;
}
```

## 視窗類型

### WindowOptions

視窗控制選項。

```typescript
interface WindowOptions {
  /** 視窗寬度 */
  width?: number;
  
  /** 視窗高度 */
  height?: number;
  
  /** X 位置 */
  x?: number;
  
  /** Y 位置 */
  y?: number;
  
  /** 最小寬度 */
  minWidth?: number;
  
  /** 最小高度 */
  minHeight?: number;
  
  /** 最大寬度 */
  maxWidth?: number;
  
  /** 最大高度 */
  maxHeight?: number;
  
  /** 可調整大小 */
  resizable?: boolean;
  
  /** 始終置頂 */
  alwaysOnTop?: boolean;
}
```

## 對話框類型

### OpenDialogOptions

開啟檔案對話框的選項。

```typescript
interface OpenDialogOptions {
  /** 對話框標題 */
  title?: string;
  
  /** 預設路徑 */
  defaultPath?: string;
  
  /** 按鈕標籤 */
  buttonLabel?: string;
  
  /** 檔案篩選器 */
  filters?: FileFilter[];
  
  /** 對話框屬性 */
  properties?: Array<
    | 'openFile'
    | 'openDirectory'
    | 'multiSelections'
    | 'showHiddenFiles'
    | 'createDirectory'
  >;
}

interface FileFilter {
  /** 篩選器名稱 */
  name: string;
  
  /** 允許的副檔名 */
  extensions: string[];
}
```

### SaveDialogOptions

儲存檔案對話框的選項。

```typescript
interface SaveDialogOptions {
  /** 對話框標題 */
  title?: string;
  
  /** 預設路徑 */
  defaultPath?: string;
  
  /** 按鈕標籤 */
  buttonLabel?: string;
  
  /** 檔案篩選器 */
  filters?: FileFilter[];
  
  /** 預設檔案名稱 */
  defaultFilename?: string;
}
```

### MessageBoxOptions

訊息方塊對話框的選項。

```typescript
interface MessageBoxOptions {
  /** 對話框類型 */
  type?: 'none' | 'info' | 'error' | 'question' | 'warning';
  
  /** 對話框標題 */
  title?: string;
  
  /** 對話框訊息 */
  message: string;
  
  /** 詳細訊息 */
  detail?: string;
  
  /** 按鈕標籤 */
  buttons?: string[];
  
  /** 預設按鈕索引 */
  defaultId?: number;
  
  /** 取消按鈕索引 */
  cancelId?: number;
  
  /** 核取方塊標籤 */
  checkboxLabel?: string;
  
  /** 核取方塊初始狀態 */
  checkboxChecked?: boolean;
}
```

## 事件類型

### 外掛程式生命週期事件

```typescript
/** 外掛程式建立時呼叫 */
type OnPluginCreate = (plugin: Plugin) => void | Promise<void>;

/** 外掛程式顯示時呼叫 */
type OnPluginShow = () => void | Promise<void>;

/** 外掛程式隱藏時呼叫 */
type OnPluginHide = () => void | Promise<void>;

/** 外掛程式退出前呼叫 */
type OnPluginBeforeExit = () => void | Promise<void>;

/** 外掛程式實例 */
interface Plugin {
  /** 外掛程式 manifest */
  manifest: Manifest;
  
  /** 外掛程式路徑 */
  path: string;
}
```

### 資料庫事件

```typescript
/** 資料庫變更時呼叫 */
type OnLibraryChange = (libraryPath: string) => void;

/** 新增項目時呼叫 */
type OnItemsAdded = (items: Item[]) => void;

/** 移除項目時呼叫 */
type OnItemsRemoved = (itemIds: string[]) => void;

/** 更新項目時呼叫 */
type OnItemsUpdated = (items: Item[]) => void;
```

## 地區設定類型

```typescript
/** 支援的 Eagle 地區設定 */
type EagleLocale =
  | 'en'
  | 'zh_CN'
  | 'zh_TW'
  | 'ja_JP'
  | 'ko_KR'
  | 'de_DE'
  | 'es_ES'
  | 'ru_RU';

/** Eagle 主題選項 */
type EagleTheme =
  | 'LIGHT'
  | 'LIGHTGRAY'
  | 'GRAY'
  | 'DARK'
  | 'BLUE'
  | 'PURPLE'
  | 'Auto';
```

## 工具類型

### 輔助類型

```typescript
/** 遞迴地將所有屬性設為可選 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** 提取陣列元素類型 */
type ArrayElement<T> = T extends (infer U)[] ? U : never;

/** 將特定屬性設為必要 */
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

### 型別守衛

```typescript
/** Item 的型別守衛 */
function isItem(value: unknown): value is Item {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'ext' in value
  );
}

/** Folder 的型別守衛 */
function isFolder(value: unknown): value is Folder {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'children' in value
  );
}
```

## 使用類型

### 匯入類型

```typescript
// 從類型定義匯入
import type { Item, Folder, Tag } from '@/types/eagle';

// 或使用內聯
const items: Item[] = await eagleApi.getSelectedItems();
```

### 型別安全的 API 呼叫

```typescript
import { eagleApi } from '@/lib/eagle-api';
import type { Item, AddItemOptions } from '@/types/eagle';

async function addProcessedImage(
  filePath: string,
  options: AddItemOptions
): Promise<Item> {
  return await eagleApi.addItemFromPath(filePath, options);
}
```

### 通用輔助函式

```typescript
// 依副檔名篩選項目
function filterByExtension<T extends Item>(
  items: T[],
  extensions: string[]
): T[] {
  return items.filter(item => 
    extensions.includes(item.ext.toLowerCase())
  );
}

// 依資料夾分組項目
function groupByFolder(items: Item[]): Map<string, Item[]> {
  const map = new Map<string, Item[]>();
  
  for (const item of items) {
    for (const folderId of item.folders) {
      const existing = map.get(folderId) || [];
      map.set(folderId, [...existing, item]);
    }
  }
  
  return map;
}
```

## 類型定義檔案

完整的類型定義位於 `src/types/eagle.d.ts`：

```typescript title="src/types/eagle.d.ts"
declare global {
  interface Window {
    eagle: EagleAPI;
  }
}

interface EagleAPI {
  app: EagleApp;
  item: EagleItem;
  folder: EagleFolder;
  tag: EagleTag;
  window: EagleWindow;
  dialog: EagleDialog;
  clipboard: EagleClipboard;
  notification: EagleNotification;
  log: EagleLog;
  
  onPluginCreate: (callback: OnPluginCreate) => void;
  onPluginShow: (callback: OnPluginShow) => void;
  onPluginHide: (callback: OnPluginHide) => void;
  onPluginBeforeExit: (callback: OnPluginBeforeExit) => void;
}

// ... 其他類型定義
```

## 相關資源

- [Eagle API 概觀](../eagle-api/overview.md) - API 使用指南
- [項目操作](../eagle-api/item-operations.md) - 項目操作
- [已知限制](./known-limitations.md) - API 約束
