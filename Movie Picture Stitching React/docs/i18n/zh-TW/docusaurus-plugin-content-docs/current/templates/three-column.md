---
sidebar_position: 7
title: ThreeColumnTemplate
description: 複雜工作流程的經典三欄佈局
---

# ThreeColumnTemplate

精緻的三欄佈局，適用於複雜的編輯工作流程，模擬 Eagle 的原生介面。具有佇列管理、中央預覽和參數面板功能。

## 匯入

```tsx
import { ThreeColumnTemplate } from '@/templates';
```

## 基本用法

```tsx
import { ThreeColumnTemplate } from '@/templates';

function ImageEditor() {
  return (
    <ThreeColumnTemplate
      leftColumn={<ItemQueue />}
      centerColumn={<PreviewCanvas />}
      rightColumn={<ParameterPanel />}
    />
  );
}
```

## 佈局結構

```
┌─────────────────────────────────────┐
│            標題列                    │
├─────────┬───────────────┬───────────┤
│  左欄   │     中央欄     │   右欄    │
│         │               │           │
│  佇列   │    預覽       │   參數    │
│  列表   │    畫布       │   面板    │
│ (250px) │   (flex-1)    │  (300px)  │
│         │               │           │
└─────────┴───────────────┴───────────┘
```

## Props

| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `leftColumn` | `ReactNode` | `undefined` | 左側面板內容（佇列、列表） |
| `centerColumn` | `ReactNode` | `undefined` | 中央面板內容（預覽、畫布） |
| `rightColumn` | `ReactNode` | `undefined` | 右側面板內容（參數、資訊） |
| `leftWidth` | `number` | `250` | 左欄寬度（像素） |
| `rightWidth` | `number` | `300` | 右欄寬度（像素） |
| `title` | `string` | `undefined` | 標題列標題 |
| `headerActions` | `ReactNode` | `undefined` | 標題列右側內容 |
| `leftCollapsible` | `boolean` | `true` | 允許左欄折疊 |
| `rightCollapsible` | `boolean` | `true` | 允許右欄折疊 |
| `defaultLeftCollapsed` | `boolean` | `false` | 初始時左欄折疊 |
| `defaultRightCollapsed` | `boolean` | `false` | 初始時右欄折疊 |
| `showDividers` | `boolean` | `true` | 顯示欄分隔線 |

## 範例

### 圖片編輯器工作流程

```tsx
import { ThreeColumnTemplate } from '@/templates';

function ImageEditor() {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [params, setParams] = useState(defaultParams);
  const { items } = useEagleSelection();

  return (
    <ThreeColumnTemplate
      title="圖片編輯器"
      headerActions={
        <Button variant="primary" onClick={handleExport}>
          匯出
        </Button>
      }
      leftColumn={
        <div className="h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium">佇列 ({items.length})</h3>
          </div>
          <div className="flex-1 overflow-auto p-2">
            {items.map(item => (
              <QueueItem
                key={item.id}
                item={item}
                selected={item.id === selectedImage?.id}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </div>
        </div>
      }
      centerColumn={
        <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          {selectedImage ? (
            <PreviewCanvas image={selectedImage} params={params} />
          ) : (
            <EmptyState message="選擇一張圖片進行編輯" />
          )}
        </div>
      }
      rightColumn={
        <div className="h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium">參數</h3>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <ParameterControls
              params={params}
              onChange={setParams}
              disabled={!selectedImage}
            />
          </div>
        </div>
      }
    />
  );
}
```

### 電影截圖拼接佈局

```tsx
function MovieStitching() {
  const [images, setImages] = useState<StitchImage[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    cropTop: 0,
    cropBottom: 0,
    format: 'png',
    quality: 90,
  });

  return (
    <ThreeColumnTemplate
      title="電影截圖拼接"
      leftWidth={280}
      rightWidth={320}
      leftColumn={
        <ImageList
          images={images}
          onReorder={(newOrder) => setImages(newOrder)}
          onRemove={(id) => setImages(prev => prev.filter(i => i.id !== id))}
        />
      }
      centerColumn={
        <PreviewPanel
          preview={preview}
          onRefresh={() => generatePreview(images, settings)}
        />
      }
      rightColumn={
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          onGenerate={() => generatePreview(images, settings)}
          onExport={() => exportStitched(images, settings)}
        />
      }
    />
  );
}
```

### 帶可折疊面板

```tsx
function CollapsibleLayout() {
  return (
    <ThreeColumnTemplate
      title="精簡編輯器"
      leftCollapsible={true}
      rightCollapsible={true}
      defaultRightCollapsed={true}
      leftColumn={<NavigationPanel />}
      centerColumn={<MainEditor />}
      rightColumn={<PropertiesPanel />}
    />
  );
}
```

### 自訂欄寬度

```tsx
function WidePreview() {
  return (
    <ThreeColumnTemplate
      leftWidth={200}   // 窄佇列
      rightWidth={350}  // 寬參數
      leftColumn={<CompactQueue />}
      centerColumn={<LargePreview />}  // 取得剩餘空間
      rightColumn={<DetailedParams />}
    />
  );
}
```

### 帶欄標題

```tsx
function HeaderedColumns() {
  return (
    <ThreeColumnTemplate
      leftColumn={
        <Column title="來源檔案" icon={<FolderIcon />}>
          <FileList />
        </Column>
      }
      centerColumn={
        <Column title="預覽" actions={<ZoomControls />}>
          <Canvas />
        </Column>
      }
      rightColumn={
        <Column title="匯出設定" icon={<SettingsIcon />}>
          <ExportForm />
        </Column>
      }
    />
  );
}

// 輔助元件
function Column({ title, icon, actions, children }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        {actions}
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
```

### 可調整大小的欄

```tsx
function ResizableLayout() {
  const [leftWidth, setLeftWidth] = useState(250);
  const [rightWidth, setRightWidth] = useState(300);

  return (
    <ThreeColumnTemplate
      leftWidth={leftWidth}
      rightWidth={rightWidth}
      onLeftResize={setLeftWidth}
      onRightResize={setRightWidth}
      leftColumn={<Queue />}
      centerColumn={<Preview />}
      rightColumn={<Params />}
    />
  );
}
```

### 僅兩欄

```tsx
// 僅使用左欄 + 中央
function LeftAndCenter() {
  return (
    <ThreeColumnTemplate
      leftColumn={<Sidebar />}
      centerColumn={<MainContent />}
      rightColumn={null}  // 無右欄
    />
  );
}

// 僅使用中央 + 右欄
function CenterAndRight() {
  return (
    <ThreeColumnTemplate
      leftColumn={null}  // 無左欄
      centerColumn={<Editor />}
      rightColumn={<Properties />}
    />
  );
}
```

## 欄職責

### 左欄（佇列/導覽）
- 項目列表或佇列
- 資料夾/分類導覽
- 拖放重新排序
- 選取管理

### 中央欄（預覽/畫布）
- 主要內容區域
- 圖片/影片預覽
- 互動式畫布
- 所見即所得編輯器

### 右欄（參數/屬性）
- 設定和控制項
- 屬性檢視器
- 匯出選項
- 中繼資料顯示

## 鍵盤快捷鍵

| 按鍵 | 操作 |
|------|------|
| `[` | 折疊左面板 |
| `]` | 折疊右面板 |
| `Ctrl/Cmd + [` | 切換左面板 |
| `Ctrl/Cmd + ]` | 切換右面板 |
| `Escape` | 聚焦中央面板 |

## 最佳實踐

### ✅ 建議

```tsx
// 清晰的欄用途
<ThreeColumnTemplate
  leftColumn={<InputQueue />}      // 來源項目
  centerColumn={<Preview />}       // 結果預覽
  rightColumn={<OutputSettings />} // 配置
/>

// 處理空狀態
<ThreeColumnTemplate
  centerColumn={
    items.length === 0 
      ? <EmptyState /> 
      : <Preview items={items} />
  }
/>

// 響應式欄寬度
<ThreeColumnTemplate
  leftWidth={Math.min(280, windowWidth * 0.2)}
  rightWidth={Math.min(320, windowWidth * 0.25)}
/>
```

### ❌ 避免

```tsx
// 不要跨欄複製功能
<ThreeColumnTemplate
  leftColumn={<ImageList />}
  rightColumn={<ImageList />}  // 令人困惑的複製
/>

// 不要讓欄太窄
<ThreeColumnTemplate
  leftWidth={100}   // 內容太窄
  rightWidth={100}  // 控制項太窄
/>
```

## 欄寬度指南

| 內容類型 | 建議寬度 |
|----------|----------|
| 最小佇列/列表 | 180-220px |
| 標準佇列 | 240-280px |
| 帶縮圖的詳細列表 | 280-320px |
| 簡單控制項 | 250-300px |
| 複雜表單 | 320-380px |
| 屬性檢視器 | 300-350px |

## 使用時機

**使用 ThreeColumnTemplate 的情況：**
- 建立圖片/影片編輯器
- 需要佇列 + 預覽 + 參數模式
- 複雜的多步驟工作流程
- Eagle 原生風格介面

**考慮其他範本的情況：**
- 簡單工具 → [`SinglePanelTemplate`](./single-panel)
- 雙欄佈局 → [`SplitPanelTemplate`](./split-panel)
- 設定頁面 → [`SettingsPanelTemplate`](./settings-panel)
- 批次處理 → [`BatchProcessTemplate`](./batch-process)

## 相關資源

- [範本概覽](./overview) - 所有可用範本
- [SplitPanelTemplate](./split-panel) - 更簡單的雙欄佈局
- [BatchProcessTemplate](./batch-process) - 處理工作流程
