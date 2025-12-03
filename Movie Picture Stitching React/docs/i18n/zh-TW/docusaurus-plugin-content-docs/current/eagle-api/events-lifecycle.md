---
sidebar_position: 9
title: 事件與生命週期
description: 外掛生命週期事件和回呼
---

# 事件與生命週期

處理外掛生命週期事件以回應可見性變化、啟動和清理。

## 匯入

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## 事件概覽

| 事件 | 觸發時機 | 使用情境 |
|------|----------|----------|
| `onPluginShow` | 外掛視窗變為可見 | 恢復輪詢、動畫 |
| `onPluginHide` | 外掛視窗變為隱藏 | 暫停昂貴操作 |
| `onPluginRun` | 外掛開始執行 | 初始化狀態 |
| `onPluginBeforeExit` | 外掛即將關閉 | 儲存狀態、清理 |
| `onLibraryChanged` | Eagle 素材庫切換 | 重新整理資料 |

## 外掛顯示

當外掛視窗變為可見時觸發。

```tsx
eagleApi.onPluginShow(() => {
  console.log('外掛現在可見');
});
```

### 常見用途

```tsx
// 可見時恢復輪詢
eagleApi.onPluginShow(() => {
  startSelectionPolling();
});

// 顯示時重新整理資料
eagleApi.onPluginShow(async () => {
  await refreshSelectedItems();
});

// 恢復動畫
eagleApi.onPluginShow(() => {
  resumeAnimations();
});
```

## 外掛隱藏

當外掛視窗變為隱藏時觸發。

```tsx
eagleApi.onPluginHide(() => {
  console.log('外掛現在隱藏');
});
```

### 常見用途

```tsx
// 隱藏時暫停輪詢
eagleApi.onPluginHide(() => {
  stopSelectionPolling();
});

// 暫停昂貴操作
eagleApi.onPluginHide(() => {
  pauseAnimations();
  pauseVideoPlayback();
});

// 儲存草稿狀態
eagleApi.onPluginHide(() => {
  saveDraftToStorage();
});
```

## 外掛執行

當外掛開始執行時觸發。

```tsx
eagleApi.onPluginRun(() => {
  console.log('外掛已啟動');
});
```

### 常見用途

```tsx
// 初始化應用程式狀態
eagleApi.onPluginRun(() => {
  initializeApp();
  loadUserPreferences();
});

// 開始初始資料擷取
eagleApi.onPluginRun(async () => {
  const items = await eagleApi.item.getSelected();
  setSelectedItems(items);
});

// 設定事件監聽器
eagleApi.onPluginRun(() => {
  setupKeyboardShortcuts();
  setupDragAndDrop();
});
```

## 外掛退出前

在外掛關閉前觸發。支援非同步清理。

```tsx
eagleApi.onPluginBeforeExit(async () => {
  console.log('外掛正在關閉');
  await saveState();
});
```

### 常見用途

```tsx
// 儲存使用者偏好設定
eagleApi.onPluginBeforeExit(async () => {
  await savePreferences(userSettings);
});

// 清理暫存檔案
eagleApi.onPluginBeforeExit(async () => {
  await cleanupTempFiles();
});

// 取消待處理操作
eagleApi.onPluginBeforeExit(async () => {
  cancelAllPendingOperations();
});

// 儲存未儲存的工作
eagleApi.onPluginBeforeExit(async () => {
  if (hasUnsavedChanges) {
    await saveDraft();
  }
});
```

## 素材庫變更

當使用者切換到不同的 Eagle 素材庫時觸發。

```tsx
eagleApi.onLibraryChanged(() => {
  console.log('素材庫已變更');
});
```

### 常見用途

```tsx
// 重設外掛狀態
eagleApi.onLibraryChanged(() => {
  resetState();
  clearCache();
});

// 為新素材庫重新載入資料
eagleApi.onLibraryChanged(async () => {
  const folders = await eagleApi.folder.getAll();
  setFolders(folders);
});

// 為新素材庫更新 UI
eagleApi.onLibraryChanged(() => {
  showLoadingState();
  refreshUI();
});
```

## 完整設定模式

```tsx
function setupPluginLifecycle() {
  // 啟動時初始化
  eagleApi.onPluginRun(() => {
    console.log('正在初始化外掛...');
    initializeApp();
  });

  // 處理可見性
  eagleApi.onPluginShow(() => {
    console.log('外掛已顯示');
    resumeOperations();
  });

  eagleApi.onPluginHide(() => {
    console.log('外掛已隱藏');
    pauseOperations();
  });

  // 處理素材庫切換
  eagleApi.onLibraryChanged(() => {
    console.log('素材庫已變更');
    resetForNewLibrary();
  });

  // 退出前清理
  eagleApi.onPluginBeforeExit(async () => {
    console.log('外掛正在關閉...');
    await saveAllState();
    await cleanup();
  });
}
```

## React 整合

### usePluginLifecycle Hook

```tsx
import { useEffect } from 'react';
import { eagleApi } from '@/lib/eagle-api';

function usePluginLifecycle(callbacks: {
  onShow?: () => void;
  onHide?: () => void;
  onRun?: () => void;
  onBeforeExit?: () => Promise<void>;
  onLibraryChanged?: () => void;
}) {
  useEffect(() => {
    const { onShow, onHide, onRun, onBeforeExit, onLibraryChanged } = callbacks;

    if (onShow) eagleApi.onPluginShow(onShow);
    if (onHide) eagleApi.onPluginHide(onHide);
    if (onRun) eagleApi.onPluginRun(onRun);
    if (onBeforeExit) eagleApi.onPluginBeforeExit(onBeforeExit);
    if (onLibraryChanged) eagleApi.onLibraryChanged(onLibraryChanged);

    // 注意：Eagle API 不提供取消訂閱方法
    // 事件在外掛關閉時清理
  }, []);
}

// 使用方式
function App() {
  usePluginLifecycle({
    onShow: () => console.log('已顯示！'),
    onHide: () => console.log('已隱藏！'),
    onLibraryChanged: () => window.location.reload(),
  });

  return <div>我的外掛</div>;
}
```

### 可見性感知輪詢

```tsx
function useVisibilityAwarePolling(
  pollFn: () => Promise<void>,
  interval: number = 500
) {
  const [isPolling, setIsPolling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    eagleApi.onPluginShow(() => {
      setIsPolling(true);
    });

    eagleApi.onPluginHide(() => {
      setIsPolling(false);
    });
  }, []);

  useEffect(() => {
    if (isPolling) {
      intervalRef.current = setInterval(pollFn, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPolling, pollFn, interval]);

  return { isPolling };
}
```

### 隱藏時自動儲存

```tsx
function useAutoSaveOnHide(data: unknown, saveFn: (data: unknown) => void) {
  const dataRef = useRef(data);
  
  // 保持 ref 更新
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    eagleApi.onPluginHide(() => {
      saveFn(dataRef.current);
    });
  }, [saveFn]);
}

// 使用方式
function Editor() {
  const [content, setContent] = useState('');
  
  useAutoSaveOnHide(content, (data) => {
    localStorage.setItem('draft', data as string);
  });

  return <textarea value={content} onChange={e => setContent(e.target.value)} />;
}
```

## 生命週期順序

```
┌─────────────────────────────────────────────────────────────────┐
│                        外掛生命週期                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  使用者開啟外掛                                                  │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐                                             │
│  │  onPluginRun    │  ← 初始化狀態、載入偏好設定                 │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                             │
│  │  onPluginShow   │  ← 開始輪詢、動畫                           │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────────┐                     │
│  │           外掛處於活動狀態                │                     │
│  │                                         │                     │
│  │   ┌─────────────┐     ┌─────────────┐   │                     │
│  │   │onPluginHide │ ←─→ │onPluginShow │   │  使用者切換        │
│  │   └─────────────┘     └─────────────┘   │  可見性            │
│  │                                         │                     │
│  │   ┌───────────────────┐                 │                     │
│  │   │ onLibraryChanged  │                 │  使用者切換        │
│  │   └───────────────────┘                 │  素材庫            │
│  └─────────────────────────────────────────┘                     │
│           │                                                      │
│           ▼  使用者關閉外掛                                      │
│  ┌─────────────────────┐                                         │
│  │ onPluginBeforeExit  │  ← 儲存狀態、清理                       │
│  └─────────────────────┘                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 瀏覽器 vs Eagle 行為

| 事件 | 瀏覽器（模擬） | Eagle |
|------|----------------|-------|
| `onPluginShow` | 使用 `visibilitychange` 事件 | 原生 Eagle 事件 |
| `onPluginHide` | 使用 `visibilitychange` 事件 | 原生 Eagle 事件 |
| `onPluginRun` | 載入時立即觸發 | 外掛啟動時觸發 |
| `onPluginBeforeExit` | 使用 `beforeunload` 事件 | 原生 Eagle 事件 |
| `onLibraryChanged` | 不會觸發 | 原生 Eagle 事件 |

## 最佳實踐

### ✅ 建議

```tsx
// 清理操作使用非同步
eagleApi.onPluginBeforeExit(async () => {
  await saveData();  // 確保儲存在退出前完成
});

// 隱藏時暫停昂貴操作
eagleApi.onPluginHide(() => {
  stopPolling();
  pauseAnimations();
});

// 素材庫變更時重設狀態
eagleApi.onLibraryChanged(() => {
  store.getState().reset();
});
```

### ❌ 避免

```tsx
// 不要依賴 onPluginHide 進行重要儲存
// 使用者可能強制關閉 Eagle
eagleApi.onPluginHide(() => {
  saveImportantData();  // 可能無法完成！
});

// 改為頻繁儲存
useAutoSave(data, { interval: 5000 });  // 每 5 秒儲存

// 不要在 onPluginShow 中執行繁重工作
eagleApi.onPluginShow(async () => {
  await loadEntireDatabase();  // 阻塞 UI！
});

// 改為漸進式載入
eagleApi.onPluginShow(() => {
  loadMinimalData().then(() => loadFullData());
});
```

## 相關資源

- [Eagle API 概覽](./overview) - API 介紹
- [視窗控制](./window-controls) - 視窗可見性控制
- [通知](./notifications) - 使用者警示
