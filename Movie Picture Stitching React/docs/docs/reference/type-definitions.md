# Type Definitions

The Eagle React Template includes comprehensive TypeScript type definitions for the Eagle Plugin API. These types provide full IntelliSense support and type safety when working with Eagle.

## Core Types

### Item

Represents an item (image, video, etc.) in Eagle's library.

```typescript
interface Item {
  /** Unique identifier */
  id: string;
  
  /** File name without extension */
  name: string;
  
  /** File extension (e.g., 'png', 'jpg') */
  ext: string;
  
  /** File size in bytes */
  size: number;
  
  /** Image/video width in pixels */
  width: number;
  
  /** Image/video height in pixels */
  height: number;
  
  /** Absolute path to the file */
  filePath: string;
  
  /** File URL (file:// protocol) */
  fileURL: string;
  
  /** Thumbnail path */
  thumbnailPath: string;
  
  /** Thumbnail URL */
  thumbnailURL: string;
  
  /** Array of tag strings */
  tags: string[];
  
  /** Array of folder IDs containing this item */
  folders: string[];
  
  /** Star rating (0-5) */
  star: number;
  
  /** Item annotation/notes */
  annotation: string;
  
  /** Custom palette colors */
  palettes: Palette[];
  
  /** Creation timestamp */
  btime: number;
  
  /** Modification timestamp */
  mtime: number;
  
  /** Source URL if imported from web */
  url?: string;
  
  /** Whether item is in trash */
  isDeleted: boolean;
  
  /** Duration in seconds (for video/audio) */
  duration?: number;
  
  /** No thumbnail available */
  noThumbnail?: boolean;
  
  /** No preview available */
  noPreview?: boolean;
}
```

### Folder

Represents a folder in Eagle's library.

```typescript
interface Folder {
  /** Unique identifier */
  id: string;
  
  /** Folder name */
  name: string;
  
  /** Folder description */
  description: string;
  
  /** Child folders */
  children: Folder[];
  
  /** Modification timestamp */
  modificationTime: number;
  
  /** Folder icon color */
  iconColor?: string;
  
  /** Folder cover image */
  cover?: string;
  
  /** Password protected */
  password?: string;
  
  /** Password hint */
  passwordTips?: string;
  
  /** Parent folder ID */
  parent?: string;
  
  /** Custom tags for this folder */
  tags?: string[];
  
  /** Whether folder is pinned */
  pinned?: boolean;
  
  /** Whether folder is new */
  isNew?: boolean;
  
  /** Original folder name (for localization) */
  originalName?: string;
  
  /** Folder images */
  images?: string[];
  
  /** Creation timestamp */
  createdAt?: number;
}
```

### Tag

Represents a tag in Eagle's library.

```typescript
interface Tag {
  /** Tag name */
  name: string;
  
  /** Number of items with this tag */
  count: number;
  
  /** Tag group */
  group?: string;
  
  /** Tag color */
  color?: string;
  
  /** Shortcut key */
  shortcut?: string;
}
```

### Palette

Color palette information for items.

```typescript
interface Palette {
  /** Color in hex format */
  color: [number, number, number];
  
  /** Color ratio in the image (0-100) */
  ratio: number;
}
```

## API Types

### AddItemOptions

Options when adding items to Eagle.

```typescript
interface AddItemOptions {
  /** Item name */
  name?: string;
  
  /** Website URL source */
  website?: string;
  
  /** Tags to apply */
  tags?: string[];
  
  /** Folder IDs to add to */
  folders?: string[];
  
  /** Annotation/notes */
  annotation?: string;
  
  /** Star rating (0-5) */
  star?: number;
}
```

### AddFromURLOptions

Options when adding items from URL.

```typescript
interface AddFromURLOptions extends AddItemOptions {
  /** Custom headers for the request */
  headers?: Record<string, string>;
  
  /** Request timeout in milliseconds */
  timeout?: number;
}
```

### SearchOptions

Options for searching items.

```typescript
interface SearchOptions {
  /** Search query string */
  query?: string;
  
  /** Filter by file extensions */
  ext?: string | string[];
  
  /** Filter by tags */
  tags?: string[];
  
  /** Filter by folder IDs */
  folders?: string[];
  
  /** Minimum star rating */
  star?: number;
  
  /** Filter by color (hex) */
  color?: string;
  
  /** Color similarity threshold (0-100) */
  colorSimilarity?: number;
  
  /** Sort field */
  sortBy?: 'name' | 'btime' | 'mtime' | 'size' | 'star';
  
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
  
  /** Maximum results */
  limit?: number;
  
  /** Results offset */
  offset?: number;
}
```

## Window Types

### WindowOptions

Options for window control.

```typescript
interface WindowOptions {
  /** Window width */
  width?: number;
  
  /** Window height */
  height?: number;
  
  /** X position */
  x?: number;
  
  /** Y position */
  y?: number;
  
  /** Minimum width */
  minWidth?: number;
  
  /** Minimum height */
  minHeight?: number;
  
  /** Maximum width */
  maxWidth?: number;
  
  /** Maximum height */
  maxHeight?: number;
  
  /** Resizable */
  resizable?: boolean;
  
  /** Always on top */
  alwaysOnTop?: boolean;
}
```

## Dialog Types

### OpenDialogOptions

Options for open file dialog.

```typescript
interface OpenDialogOptions {
  /** Dialog title */
  title?: string;
  
  /** Default path */
  defaultPath?: string;
  
  /** Button label */
  buttonLabel?: string;
  
  /** File filters */
  filters?: FileFilter[];
  
  /** Dialog properties */
  properties?: Array<
    | 'openFile'
    | 'openDirectory'
    | 'multiSelections'
    | 'showHiddenFiles'
    | 'createDirectory'
  >;
}

interface FileFilter {
  /** Filter name */
  name: string;
  
  /** Allowed extensions */
  extensions: string[];
}
```

### SaveDialogOptions

Options for save file dialog.

```typescript
interface SaveDialogOptions {
  /** Dialog title */
  title?: string;
  
  /** Default path */
  defaultPath?: string;
  
  /** Button label */
  buttonLabel?: string;
  
  /** File filters */
  filters?: FileFilter[];
  
  /** Default file name */
  defaultFilename?: string;
}
```

### MessageBoxOptions

Options for message box dialog.

```typescript
interface MessageBoxOptions {
  /** Dialog type */
  type?: 'none' | 'info' | 'error' | 'question' | 'warning';
  
  /** Dialog title */
  title?: string;
  
  /** Dialog message */
  message: string;
  
  /** Detailed message */
  detail?: string;
  
  /** Button labels */
  buttons?: string[];
  
  /** Default button index */
  defaultId?: number;
  
  /** Cancel button index */
  cancelId?: number;
  
  /** Checkbox label */
  checkboxLabel?: string;
  
  /** Checkbox initial state */
  checkboxChecked?: boolean;
}
```

## Event Types

### Plugin Lifecycle Events

```typescript
/** Called when plugin is created */
type OnPluginCreate = (plugin: Plugin) => void | Promise<void>;

/** Called when plugin is shown */
type OnPluginShow = () => void | Promise<void>;

/** Called when plugin is hidden */
type OnPluginHide = () => void | Promise<void>;

/** Called before plugin exits */
type OnPluginBeforeExit = () => void | Promise<void>;

/** Plugin instance */
interface Plugin {
  /** Plugin manifest */
  manifest: Manifest;
  
  /** Plugin path */
  path: string;
}
```

### Library Events

```typescript
/** Called when library changes */
type OnLibraryChange = (libraryPath: string) => void;

/** Called when items are added */
type OnItemsAdded = (items: Item[]) => void;

/** Called when items are removed */
type OnItemsRemoved = (itemIds: string[]) => void;

/** Called when items are updated */
type OnItemsUpdated = (items: Item[]) => void;
```

## Locale Types

```typescript
/** Supported Eagle locales */
type EagleLocale =
  | 'en'
  | 'zh_CN'
  | 'zh_TW'
  | 'ja_JP'
  | 'ko_KR'
  | 'de_DE'
  | 'es_ES'
  | 'ru_RU';

/** Eagle theme options */
type EagleTheme =
  | 'LIGHT'
  | 'LIGHTGRAY'
  | 'GRAY'
  | 'DARK'
  | 'BLUE'
  | 'PURPLE'
  | 'Auto';
```

## Utility Types

### Helper Types

```typescript
/** Make all properties optional recursively */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extract array element type */
type ArrayElement<T> = T extends (infer U)[] ? U : never;

/** Make specific properties required */
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

### Guard Types

```typescript
/** Type guard for Item */
function isItem(value: unknown): value is Item {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'ext' in value
  );
}

/** Type guard for Folder */
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

## Using Types

### Importing Types

```typescript
// Import from type definitions
import type { Item, Folder, Tag } from '@/types/eagle';

// Or use inline
const items: Item[] = await eagleApi.getSelectedItems();
```

### Type-Safe API Calls

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

### Generic Helpers

```typescript
// Filter items by extension
function filterByExtension<T extends Item>(
  items: T[],
  extensions: string[]
): T[] {
  return items.filter(item => 
    extensions.includes(item.ext.toLowerCase())
  );
}

// Group items by folder
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

## Type Definition File

The complete type definitions are in `src/types/eagle.d.ts`:

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

// ... additional type definitions
```

## Related

- [Eagle API Overview](../eagle-api/overview.md) - API usage guide
- [Item Operations](../eagle-api/item-operations.md) - Working with items
- [Known Limitations](./known-limitations.md) - API constraints
