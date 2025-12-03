---
sidebar_position: 1
title: 範本概覽
description: 即用型外掛佈局範本
---

# 範本概覽

Eagle React Template 提供 **6 個即用型佈局範本**，專為常見的 Eagle 外掛模式設計。每個範本都完全響應式、支援深色模式，並遵循 Eagle 的設計語言。

## 快速參考

| 範本 | 使用場景 | 欄數 | 複雜度 |
|------|----------|------|--------|
| [`SinglePanelTemplate`](./single-panel) | 簡單工具 | 1 | 低 |
| [`SplitPanelTemplate`](./split-panel) | 導覽 + 內容 | 2 | 低 |
| [`SettingsPanelTemplate`](./settings-panel) | 外掛設定 | 2 | 中 |
| [`BatchProcessTemplate`](./batch-process) | 批次操作 | 2-3 | 高 |
| [`ImageBrowserTemplate`](./image-browser) | 素材瀏覽器 | 1-2 | 中 |
| [`ThreeColumnTemplate`](./three-column) | 複雜工作流程 | 3 | 高 |

## 匯入

所有範本都從 `@/templates` barrel 匯出：

```tsx
import { 
  SinglePanelTemplate,
  SplitPanelTemplate,
  SettingsPanelTemplate,
  BatchProcessTemplate,
  ImageBrowserTemplate,
  ThreeColumnTemplate,
} from '@/templates';
```

## 視覺指南

### SinglePanelTemplate

```
┌─────────────────────────────────────┐
│            標題列                    │
├─────────────────────────────────────┤
│                                     │
│           主要內容                   │
│                                     │
├─────────────────────────────────────┤
│            頁尾                      │
└─────────────────────────────────────┘
```

**最適合：** 簡單工具、單一用途工具、快速操作

### SplitPanelTemplate

```
┌─────────────────────────────────────┐
│            標題列                    │
├──────────┬──────────────────────────┤
│          │                          │
│   側邊欄  │        主要內容          │
│  (280px) │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

**最適合：** 導覽式 UI、檔案總管、分類設定

### SettingsPanelTemplate

```
┌─────────────────────────────────────┐
│     設定           [儲存] [重設]    │
├──────────┬──────────────────────────┤
│ 一般     │  區段標題                 │
│ 進階     │  ┌─────────────────────┐ │
│ 匯出     │  │ 設定 1              │ │
│          │  │ 設定 2              │ │
│          │  └─────────────────────┘ │
└──────────┴──────────────────────────┘
```

**最適合：** 外掛配置、偏好設定、多區段設定

### BatchProcessTemplate

```
┌─────────────────────────────────────┐
│  批次處理                  [▶ 開始] │
├──────────────────────────────────────┤
│  進度：████████░░ 80% (8/10)        │
├──────────┬──────────────────────────┤
│ 佇列     │  目前項目預覽             │
│ ✓ item1  │  ┌─────────────────────┐ │
│ ✓ item2  │  │                     │ │
│ → item3  │  │    處理中...         │ │
│ ○ item4  │  │                     │ │
│ ○ item5  │  └─────────────────────┘ │
└──────────┴──────────────────────────┘
```

**最適合：** 批次操作、匯出工作流程、批次轉換

### ImageBrowserTemplate

```
┌─────────────────────────────────────┐
│  🔍 搜尋...      [網格] [排序 ▼]    │
├─────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ img │ │ img │ │ img │ │ img │   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ img │ │ img │ │ img │ │ img │   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
├─────────────────────────────────────┤
│  已選取：3 個項目                    │
└─────────────────────────────────────┘
```

**最適合：** 素材瀏覽器、圖片藝廊、檔案選擇器

### ThreeColumnTemplate

```
┌─────────────────────────────────────┐
│            標題列                    │
├─────────┬───────────────┬───────────┤
│  左欄   │     中央欄     │   右欄    │
│         │               │           │
│  佇列   │    預覽       │   參數    │
│  列表   │    畫布       │   面板    │
│         │               │           │
└─────────┴───────────────┴───────────┘
```

**最適合：** 複雜編輯工作流程、Eagle 風格佈局、預覽式工具

## 選擇範本

### 決策樹

```
需要設定/偏好設定？
├── 是 → SettingsPanelTemplate
└── 否 ↓
    
需要處理多個項目？
├── 是 → BatchProcessTemplate
└── 否 ↓
    
顯示圖片網格？
├── 是 → ImageBrowserTemplate
└── 否 ↓
    
需要側邊欄導覽？
├── 是 → SplitPanelTemplate
└── 否 ↓
    
需要 3 個獨立面板？
├── 是 → ThreeColumnTemplate
└── 否 → SinglePanelTemplate
```

## 共同功能

所有範本都具備這些功能：

### 標題列與視窗控制

```tsx
<SinglePanelTemplate
  title="我的外掛"
  headerActions={
    <Button variant="ghost" size="icon">
      <Settings className="w-4 h-4" />
    </Button>
  }
>
```

### 深色模式支援

範本自動適應主題：

```tsx
// 內建主題化背景和邊框
<SplitPanelTemplate>
  {/* 內容自動使用深色模式顏色 */}
</SplitPanelTemplate>
```

### 響應式行為

範本優雅處理視窗大小調整：

- 窄視窗時可折疊側邊欄
- ImageBrowserTemplate 中的響應式網格
- 具有適當溢位的可捲動面板

## 組合範例

範本可以組合用於複雜 UI：

```tsx
import { SplitPanelTemplate, ImageBrowserTemplate } from '@/templates';

function AdvancedBrowser() {
  return (
    <SplitPanelTemplate
      sidebarContent={<FolderTree />}
    >
      <ImageBrowserTemplate
        items={images}
        onSelectionChange={handleSelect}
      />
    </SplitPanelTemplate>
  );
}
```

## 相關資源

- [快速開始](../getting-started/installation) - 專案設定
- [元件：Button](../components/ui/button) - 範本中使用的 UI 元件
