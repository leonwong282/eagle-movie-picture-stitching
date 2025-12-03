---
sidebar_position: 2
title: SinglePanelTemplate
description: 專注工具的簡單單面板佈局
---

# SinglePanelTemplate

最簡單的範本，適用於單一用途工具和專注任務。提供簡潔的標題列、可捲動內容區域和可選的頁尾。

## 匯入

```tsx
import { SinglePanelTemplate } from '@/templates';
```

## 基本用法

```tsx
function MyPlugin() {
  return (
    <SinglePanelTemplate title="圖片轉換器">
      <div className="p-4">
        <p>您的內容在這裡</p>
      </div>
    </SinglePanelTemplate>
  );
}
```

## 佈局結構

```
┌─────────────────────────────────────┐
│  標題               [標題列操作]     │  ← 標題列（拖曳區域）
├─────────────────────────────────────┤
│                                     │
│           children                  │  ← 可捲動內容
│                                     │
├─────────────────────────────────────┤
│            footer                   │  ← 可選頁尾
└─────────────────────────────────────┘
```

## Props

| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `title` | `string` | `undefined` | 標題列標題文字 |
| `children` | `ReactNode` | **必要** | 主要內容 |
| `headerActions` | `ReactNode` | `undefined` | 標題列右側的按鈕/圖示 |
| `footer` | `ReactNode` | `undefined` | 固定頁尾內容 |
| `showSettings` | `boolean` | `false` | 在標題列顯示設定圖示 |
| `onSettingsClick` | `() => void` | `undefined` | 設定按鈕處理器 |
| `contentClassName` | `string` | `''` | 內容區域的額外類別 |
| `className` | `string` | `''` | 根容器的額外類別 |

## 範例

### 帶標題列操作

```tsx
import { SinglePanelTemplate } from '@/templates';
import { Button } from '@/components/ui';
import { Settings, HelpCircle } from 'lucide-react';

function ConverterPlugin() {
  return (
    <SinglePanelTemplate
      title="格式轉換器"
      headerActions={
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <ConversionForm />
    </SinglePanelTemplate>
  );
}
```

### 帶頁尾

```tsx
function ExportPlugin() {
  const [isExporting, setIsExporting] = useState(false);

  return (
    <SinglePanelTemplate
      title="快速匯出"
      footer={
        <div className="flex justify-end gap-2 p-3 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline">取消</Button>
          <Button 
            variant="primary" 
            isLoading={isExporting}
            onClick={() => setIsExporting(true)}
          >
            匯出
          </Button>
        </div>
      }
    >
      <ExportOptions />
    </SinglePanelTemplate>
  );
}
```

### 帶設定按鈕

```tsx
function ToolPlugin() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <SinglePanelTemplate
      title="圖片工具"
      showSettings
      onSettingsClick={() => setShowSettings(true)}
    >
      {showSettings ? (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      ) : (
        <MainTool />
      )}
    </SinglePanelTemplate>
  );
}
```

### 全高內容

```tsx
function PreviewPlugin() {
  return (
    <SinglePanelTemplate
      title="預覽"
      contentClassName="flex flex-col"
    >
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <img src={imageUrl} alt="預覽" className="max-w-full max-h-full" />
      </div>
    </SinglePanelTemplate>
  );
}
```

### 極簡（無標題列）

```tsx
function MinimalPlugin() {
  return (
    <SinglePanelTemplate contentClassName="p-0">
      <div className="h-full flex flex-col">
        <CustomHeader />
        <MainContent />
      </div>
    </SinglePanelTemplate>
  );
}
```

## 樣式設定

### 內容區域

內容區域預設可捲動。使用 `contentClassName` 進行自訂樣式：

```tsx
<SinglePanelTemplate
  contentClassName="p-6 bg-gray-50 dark:bg-gray-900"
>
  {/* 帶自訂內距和背景的內容 */}
</SinglePanelTemplate>
```

### 深色模式

範本自動支援深色模式：

```tsx
// 背景顏色自動適應
<SinglePanelTemplate title="我的工具">
  <div className="text-gray-900 dark:text-gray-100">
    自動主題化內容
  </div>
</SinglePanelTemplate>
```

## 最佳實踐

### ✅ 建議

```tsx
// 清晰、專注的用途
<SinglePanelTemplate title="調整圖片大小">
  <ResizeForm />
</SinglePanelTemplate>

// 使用頁尾放置主要操作
<SinglePanelTemplate
  title="匯出"
  footer={<ActionButtons />}
>
  <Options />
</SinglePanelTemplate>
```

### ❌ 避免

```tsx
// 不要用於複雜的多面板 UI
<SinglePanelTemplate>
  <div className="grid grid-cols-3"> {/* 改用 ThreeColumnTemplate */}
    <Sidebar />
    <Main />
    <Panel />
  </div>
</SinglePanelTemplate>

// 不要巢狀範本
<SinglePanelTemplate>
  <SinglePanelTemplate> {/* 永遠不要巢狀範本 */}
    <Content />
  </SinglePanelTemplate>
</SinglePanelTemplate>
```

## 使用時機

**使用 SinglePanelTemplate 的情況：**
- 建立簡單、專注的工具
- 內容適合單一可捲動區域
- 不需要側邊欄導覽
- 具有最小 UI 的快速操作

**考慮其他範本的情況：**
- 需要側邊欄導覽 → [`SplitPanelTemplate`](./split-panel)
- 建立設定頁面 → [`SettingsPanelTemplate`](./settings-panel)
- 處理多個項目 → [`BatchProcessTemplate`](./batch-process)

## 相關資源

- [範本概覽](./overview) - 所有可用範本
- [Button 元件](../components/ui/button) - 操作按鈕
