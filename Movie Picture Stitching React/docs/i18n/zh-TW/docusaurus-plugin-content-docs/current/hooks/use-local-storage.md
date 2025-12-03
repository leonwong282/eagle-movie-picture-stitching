---
sidebar_position: 4
title: useLocalStorage
description: 類型安全的 localStorage Hook，具有防抖寫入功能
---

# useLocalStorage

用於將 React 狀態與 localStorage 同步的 Hook，具有防抖寫入、類型安全和可選驗證功能。

## 匯入

```tsx
import { useLocalStorage } from '@/hooks';
```

## 基本用法

```tsx
function Settings() {
  const [quality, setQuality] = useLocalStorage('quality', 80);

  return (
    <Slider 
      value={quality} 
      onChange={setQuality}
      min={0}
      max={100}
    />
  );
}
```

## 簽名

```tsx
const [value, setValue, reset] = useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: UseLocalStorageOptions<T>
);
```

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `key` | `string` | 儲存鍵（自動使用 `eagle-react-template:` 前綴） |
| `defaultValue` | `T` | 儲存中沒有值時的預設值 |
| `options` | `UseLocalStorageOptions<T>` | 可選配置 |

### 選項

| 選項 | 類型 | 預設值 | 說明 |
|--------|------|---------|-------------|
| `validator` | `(value: unknown) => T \| null` | - | 驗證儲存的值 |
| `debounceMs` | `number` | `300` | 寫入的防抖延遲 |

## 回傳值

回傳類似 `useState` 的元組：

| 索引 | 類型 | 說明 |
|-------|------|-------------|
| `0` | `T` | 目前的值 |
| `1` | `(value: T \| ((prev: T) => T)) => void` | 更新函式 |
| `2` | `() => void` | 重置為預設值 |

## 範例

### 簡單值

```tsx
function Counter() {
  const [count, setCount] = useLocalStorage('counter', 0);

  return (
    <div>
      <p>計數: {count}</p>
      <Button onClick={() => setCount(c => c + 1)}>增加</Button>
    </div>
  );
}
```

### 物件狀態

```tsx
interface UserPrefs {
  theme: 'light' | 'dark';
  quality: number;
  autoSave: boolean;
}

function Preferences() {
  const [prefs, setPrefs] = useLocalStorage<UserPrefs>('prefs', {
    theme: 'light',
    quality: 80,
    autoSave: true,
  });

  const updateQuality = (quality: number) => {
    setPrefs(prev => ({ ...prev, quality }));
  };

  return (
    <div className="space-y-4">
      <Slider 
        value={prefs.quality} 
        onChange={updateQuality}
      />
      <Checkbox 
        checked={prefs.autoSave}
        onCheckedChange={(checked) => 
          setPrefs(prev => ({ ...prev, autoSave: checked }))
        }
      />
    </div>
  );
}
```

### 帶驗證

```tsx
interface Settings {
  quality: number;
  format: 'png' | 'jpg' | 'webp';
}

const validateSettings = (value: unknown): Settings | null => {
  if (!value || typeof value !== 'object') return null;
  
  const obj = value as Record<string, unknown>;
  
  if (typeof obj.quality !== 'number' || obj.quality < 0 || obj.quality > 100) {
    return null;
  }
  
  if (!['png', 'jpg', 'webp'].includes(obj.format as string)) {
    return null;
  }
  
  return obj as Settings;
};

function SettingsPanel() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    'settings',
    { quality: 80, format: 'png' },
    { validator: validateSettings }
  );

  // 如果儲存的值無效，會回退到預設值
  return <div>品質: {settings.quality}</div>;
}
```

### 帶重置

```tsx
function ResettableSettings() {
  const [settings, setSettings, resetSettings] = useLocalStorage('settings', {
    volume: 50,
    muted: false,
  });

  return (
    <div className="space-y-4">
      <Slider 
        value={settings.volume} 
        onChange={(v) => setSettings(s => ({ ...s, volume: v }))}
      />
      <Button variant="outline" onClick={resetSettings}>
        重置為預設值
      </Button>
    </div>
  );
}
```

### 自訂防抖

```tsx
function RealTimeSync() {
  // 對重要資料更快速地儲存
  const [draft, setDraft] = useLocalStorage('draft', '', {
    debounceMs: 100,  // 快速儲存
  });

  return (
    <textarea 
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      placeholder="開始輸入..."
    />
  );
}

function LargeData() {
  // 對大型資料使用較慢的儲存
  const [data, setData] = useLocalStorage('largeData', [], {
    debounceMs: 1000,  // 批次寫入
  });
  
  // ...
}
```

### 函式式更新

```tsx
function TodoList() {
  const [todos, setTodos] = useLocalStorage<string[]>('todos', []);

  const addTodo = (text: string) => {
    setTodos(prev => [...prev, text]);
  };

  const removeTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {todos.map((todo, i) => (
        <div key={i}>
          {todo}
          <Button size="sm" onClick={() => removeTodo(i)}>×</Button>
        </div>
      ))}
    </div>
  );
}
```

## 運作方式

### 鍵命名空間

所有鍵都會自動加上前綴以避免衝突：

```typescript
// 您的程式碼
useLocalStorage('settings', {});

// 實際儲存鍵
'eagle-react-template:settings'
```

### 防抖寫入

寫入會進行防抖以防止過度的磁碟 I/O：

```
┌─────────────────────────────────────────────────────┐
│  呼叫 setValue()                                    │
│         ↓                                           │
│  狀態立即更新（為了響應式 UI）                      │
│         ↓                                           │
│  防抖計時器開始（預設 300ms）                       │
│         ↓                                           │
│  ┌─────────────────┬──────────────────────────┐    │
│  │ 計時器到期      │ 另一個 setValue() 呼叫   │    │
│  │ → 寫入          │ → 計時器重置             │    │
│  │   localStorage  │                          │    │
│  └─────────────────┴──────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### JSON 序列化

值會自動序列化/反序列化：

```typescript
// 儲存
localStorage.setItem(key, JSON.stringify(value));

// 讀取
const value = JSON.parse(localStorage.getItem(key));
```

### 錯誤處理

Hook 處理常見的邊緣情況：

```typescript
// 儲存中的無效 JSON → 回傳預設值
// 超過儲存配額 → 記錄警告，保持狀態在記憶體中
// 驗證失敗 → 回傳預設值
```

## 儲存大小考量

localStorage 通常有 5-10MB 的限制。對於大型資料：

```tsx
// ❌ 不要儲存大型資料
const [images] = useLocalStorage('images', largeArray);

// ✅ 改為儲存參考
const [imageIds] = useLocalStorage('selectedImageIds', []);
```

## 跨分頁同步

Hook 會監聽其他分頁的儲存事件：

```tsx
function MultiTabApp() {
  const [count, setCount] = useLocalStorage('count', 0);
  
  // 如果另一個分頁更新了 'count'，這個分頁會看到變更
  return <div>計數: {count}</div>;
}
```

## 最佳實踐

### 應該做

- ✅ 使用描述性、唯一的鍵名稱
- ✅ 提供合理的預設值
- ✅ 對複雜資料結構使用驗證器
- ✅ 對陣列/物件使用函式式更新
- ✅ 保持儲存的資料小型（每個鍵 < 100KB）

### 不應該做

- ❌ 儲存敏感資料（localStorage 不安全）
- ❌ 不使用防抖儲存頻繁變更的資料
- ❌ 儲存大型二進位資料或圖片
- ❌ 對不同資料類型使用相同的鍵
- ❌ 忘記儲存會跨工作階段保留

## 除錯

在 DevTools 中查看儲存的值：

```javascript
// 在瀏覽器主控台中
Object.entries(localStorage)
  .filter(([key]) => key.startsWith('eagle-react-template:'))
  .forEach(([key, value]) => {
    console.log(key, JSON.parse(value));
  });
```

或使用 `storageDebug` 輔助工具：

```javascript
storageDebug.viewAll();   // 查看所有儲存的值
storageDebug.clearAll();  // 清除所有外掛儲存
```

## 相關

- [useTheme](./use-theme) - 使用 localStorage 進行主題持久化
- [Hooks 總覽](./overview) - 所有可用的 Hooks
