# 持久化

儲存庫使用 Zustand 的 persist 中介軟體來自動儲存和恢復狀態。

## 基本配置

### 預設設定

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const usePluginStore = create<PluginStore>()(
  persist(
    (set, get) => ({
      // Store 定義
      settings: {
        theme: 'auto',
        language: 'en',
        quality: 0.9,
        // ...
      },
      selection: {
        items: [],
        isLoading: false,
        // ...
      },
    }),
    {
      name: 'eagle-plugin-store', // localStorage 鍵名
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 部分持久化

僅持久化特定的狀態切片：

```typescript
export const usePluginStore = create<PluginStore>()(
  persist(
    (set, get) => ({
      settings: { /* ... */ },
      selection: { /* ... */ },
      processing: { /* ... */ },
      ui: { /* ... */ },
    }),
    {
      name: 'eagle-plugin-store',
      // 僅持久化 settings
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
```

### 排除特定欄位

```typescript
{
  partialize: (state) => ({
    settings: {
      ...state.settings,
      // 排除暫時設定
      tempValue: undefined,
    },
  }),
}
```

## 儲存後端

### localStorage（預設）

```typescript
import { createJSONStorage } from 'zustand/middleware';

{
  storage: createJSONStorage(() => localStorage),
}
```

### sessionStorage

```typescript
{
  storage: createJSONStorage(() => sessionStorage),
}
```

### 自訂儲存

```typescript
// Eagle 特定儲存（使用 Node.js fs）
const eagleStorage = {
  getItem: async (name: string) => {
    if (!isEagleEnvironment()) return null;
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(eagle.plugin.path, 'config', `${name}.json`);
    
    try {
      if (fs.existsSync(configPath)) {
        return fs.readFileSync(configPath, 'utf-8');
      }
    } catch {
      return null;
    }
    return null;
  },
  
  setItem: async (name: string, value: string) => {
    if (!isEagleEnvironment()) return;
    const fs = require('fs');
    const path = require('path');
    const configDir = path.join(eagle.plugin.path, 'config');
    
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(configDir, `${name}.json`),
      value,
      'utf-8'
    );
  },
  
  removeItem: async (name: string) => {
    if (!isEagleEnvironment()) return;
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(eagle.plugin.path, 'config', `${name}.json`);
    
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  },
};

// 使用方式
{
  storage: createJSONStorage(() => eagleStorage),
}
```

## 版本管理與遷移

### 基本版本控制

```typescript
export const usePluginStore = create<PluginStore>()(
  persist(
    (set, get) => ({ /* ... */ }),
    {
      name: 'eagle-plugin-store',
      version: 1, // 增加此值以觸發遷移
      migrate: (persistedState, version) => {
        // 處理舊版本資料
        if (version === 0) {
          // 從版本 0 遷移
          return {
            ...persistedState,
            settings: {
              ...persistedState.settings,
              newField: 'default',
            },
          };
        }
        return persistedState;
      },
    }
  )
);
```

### 複雜遷移

```typescript
type MigrationFn = (state: unknown) => unknown;

const migrations: Record<number, MigrationFn> = {
  // 版本 0 → 1：新增 quality 欄位
  0: (state: any) => ({
    ...state,
    settings: {
      ...state.settings,
      quality: 0.9, // 新預設值
    },
  }),
  
  // 版本 1 → 2：重新命名欄位
  1: (state: any) => ({
    ...state,
    settings: {
      ...state.settings,
      outputFormat: state.settings.format, // 重新命名
      format: undefined,
    },
  }),
  
  // 版本 2 → 3：重構設定結構
  2: (state: any) => ({
    ...state,
    settings: {
      general: {
        theme: state.settings.theme,
        language: state.settings.language,
      },
      export: {
        format: state.settings.outputFormat,
        quality: state.settings.quality,
      },
    },
  }),
};

{
  version: 3,
  migrate: (persistedState, version) => {
    let state = persistedState;
    
    // 逐步應用遷移
    for (let v = version; v < 3; v++) {
      if (migrations[v]) {
        state = migrations[v](state);
      }
    }
    
    return state as PluginStore;
  },
}
```

## 水合控制

### 監聽水合完成

```typescript
// 在元件中
function App() {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    // 水合後執行
    const unsubscribe = usePluginStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    
    // 檢查是否已水合
    if (usePluginStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    
    return unsubscribe;
  }, []);
  
  if (!hydrated) {
    return <LoadingScreen />;
  }
  
  return <MainApp />;
}
```

### 手動水合

```typescript
// 停用自動水合
{
  skipHydration: true,
}

// 稍後手動觸發
await usePluginStore.persist.rehydrate();
```

### 水合前回呼

```typescript
{
  onRehydrateStorage: (state) => {
    console.log('開始水合...');
    
    // 回傳回呼在水合後執行
    return (state, error) => {
      if (error) {
        console.error('水合失敗:', error);
      } else {
        console.log('水合成功');
      }
    };
  },
}
```

## 合併策略

### 預設：淺層合併

```typescript
// 預設行為 - 僅頂層合併
{
  merge: (persistedState, currentState) => ({
    ...currentState,
    ...persistedState,
  }),
}
```

### 深層合併

```typescript
import deepMerge from 'deepmerge';

{
  merge: (persistedState, currentState) => 
    deepMerge(currentState, persistedState, {
      // 陣列處理策略
      arrayMerge: (_, sourceArray) => sourceArray,
    }),
}
```

### 自訂合併邏輯

```typescript
{
  merge: (persistedState, currentState) => {
    // 新 schema 欄位保留預設值
    const merged = {
      ...currentState,
      settings: {
        ...currentState.settings,
        ...(persistedState as any)?.settings,
        // 保留新欄位的預設值（如果不在持久化狀態中）
        newFeature: (persistedState as any)?.settings?.newFeature 
          ?? currentState.settings.newFeature,
      },
    };
    
    return merged;
  },
}
```

## 除錯工具

### 儲存偵測器

```typescript
// 開發除錯工具
export const storageDebug = {
  // 檢視持久化資料
  view: () => {
    const raw = localStorage.getItem('eagle-plugin-store');
    if (raw) {
      console.log(JSON.parse(raw));
    }
  },
  
  // 清除持久化資料
  clear: () => {
    localStorage.removeItem('eagle-plugin-store');
    console.log('已清除儲存');
  },
  
  // 匯出為 JSON
  export: () => {
    const raw = localStorage.getItem('eagle-plugin-store');
    if (raw) {
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plugin-state.json';
      a.click();
    }
  },
  
  // 從 JSON 匯入
  import: async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        localStorage.setItem('eagle-plugin-store', text);
        usePluginStore.persist.rehydrate();
      }
    };
    
    input.click();
  },
};

// 在主控台中使用
// storageDebug.view()
// storageDebug.clear()
```

### 與 DevTools 整合

```typescript
import { devtools, persist } from 'zustand/middleware';

export const usePluginStore = create<PluginStore>()(
  devtools(
    persist(
      (set, get) => ({ /* ... */ }),
      { name: 'eagle-plugin-store' }
    ),
    { 
      name: 'Eagle Plugin Store',
      // 在 DevTools 中顯示持久化 actions
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
```

## 錯誤處理

### 處理損壞的資料

```typescript
{
  storage: createJSONStorage(() => ({
    getItem: (name) => {
      try {
        const item = localStorage.getItem(name);
        if (item) {
          // 驗證 JSON
          JSON.parse(item);
        }
        return item;
      } catch (e) {
        console.error('儲存資料損壞，正在清除:', e);
        localStorage.removeItem(name);
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        localStorage.setItem(name, value);
      } catch (e) {
        console.error('儲存失敗:', e);
        // 可能是 quota 超出
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          // 處理儲存配額超出
          console.warn('儲存配額超出');
        }
      }
    },
    removeItem: (name) => localStorage.removeItem(name),
  })),
}
```

### Schema 驗證

```typescript
import { z } from 'zod';

const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  language: z.string(),
  quality: z.number().min(0.1).max(1),
  outputFormat: z.enum(['png', 'jpeg', 'webp']),
});

{
  merge: (persistedState, currentState) => {
    try {
      // 驗證持久化設定
      const validatedSettings = settingsSchema.parse(
        (persistedState as any)?.settings
      );
      
      return {
        ...currentState,
        settings: validatedSettings,
      };
    } catch (e) {
      console.warn('設定驗證失敗，使用預設值:', e);
      return currentState;
    }
  },
}
```

## 最佳實踐

1. **僅持久化必要資料**：使用 `partialize` 排除臨時狀態
2. **為遷移設定版本號**：增加 `version` 以處理 schema 變更
3. **驗證持久化資料**：實作 schema 驗證以處理損壞資料
4. **提供 fallback**：在合併邏輯中優雅處理缺失欄位
5. **適當的錯誤處理**：實作儲存配額限制和損壞資料的處理

## 下一步

- [Store 切片](./slices.md) - 詳細的切片文件
- [選擇器](./selectors.md) - 建立高效的選擇器
