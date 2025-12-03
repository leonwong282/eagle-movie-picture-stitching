---
sidebar_position: 1
title: Tabs 分頁
description: 用於將內容組織成可切換面板的分頁介面元件
---

# Tabs 分頁

基於 [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) 建構的分頁介面元件，提供具有可自訂觸發器的無障礙、可鍵盤導覽的內容面板。

## 匯入

```tsx
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components';
```

## 基本用法

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">概覽</TabsTrigger>
    <TabsTrigger value="settings">設定</TabsTrigger>
    <TabsTrigger value="export">匯出</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p>概覽內容在此處。</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>設定內容在此處。</p>
  </TabsContent>
  <TabsContent value="export">
    <p>匯出內容在此處。</p>
  </TabsContent>
</Tabs>
```

## 元件

| 元件 | 說明 |
|-----------|-------------|
| `Tabs` | 管理分頁狀態的根元件 |
| `TabsList` | 分頁觸發器的容器 |
| `TabsTrigger` | 可點擊的分頁按鈕 |
| `TabsContent` | 每個分頁的內容面板 |

## 屬性

### Tabs

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `value` | `string` | - | 受控的活動分頁值 |
| `onValueChange` | `(value: string) => void` | - | 活動分頁變更時的回呼 |
| `defaultValue` | `string` | - | 初始活動分頁（非受控） |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 分頁方向 |
| `dir` | `'ltr' \| 'rtl'` | - | 閱讀方向 |
| `activationMode` | `'automatic' \| 'manual'` | `'automatic'` | 何時啟動分頁 |

### TabsList

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `className` | `string` | - | 額外的 CSS 類別 |
| `loop` | `boolean` | `true` | 鍵盤導覽是否循環 |

### TabsTrigger

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `value` | `string` | 必填 | 分頁的唯一識別碼 |
| `disabled` | `boolean` | `false` | 停用分頁觸發器 |
| `className` | `string` | - | 額外的 CSS 類別 |

### TabsContent

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `value` | `string` | 必填 | 必須與 TabsTrigger 的值相符 |
| `className` | `string` | - | 額外的 CSS 類別 |
| `forceMount` | `boolean` | `false` | 非活動時保持內容掛載 |

## 範例

### 外掛展示分頁

Eagle React Template 廣泛使用分頁來組織展示內容：

```tsx
function DemoPage() {
  const [activeTab, setActiveTab] = useState('selection');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start">
        <TabsTrigger value="selection">選取</TabsTrigger>
        <TabsTrigger value="components">元件</TabsTrigger>
        <TabsTrigger value="forms">表單</TabsTrigger>
        <TabsTrigger value="dialogs">對話框</TabsTrigger>
        <TabsTrigger value="canvas">Canvas</TabsTrigger>
        <TabsTrigger value="storage">儲存</TabsTrigger>
        <TabsTrigger value="templates">範本</TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="selection">
          <SelectionDemo />
        </TabsContent>
        <TabsContent value="components">
          <ComponentsDemo />
        </TabsContent>
        {/* ... 更多內容 */}
      </div>
    </Tabs>
  );
}
```

### 帶圖示

```tsx
import { Image, Settings, Download, Info } from 'lucide-react';

<Tabs defaultValue="images">
  <TabsList>
    <TabsTrigger value="images" className="gap-2">
      <Image className="h-4 w-4" />
      圖片
    </TabsTrigger>
    <TabsTrigger value="settings" className="gap-2">
      <Settings className="h-4 w-4" />
      設定
    </TabsTrigger>
    <TabsTrigger value="export" className="gap-2">
      <Download className="h-4 w-4" />
      匯出
    </TabsTrigger>
    <TabsTrigger value="about" className="gap-2">
      <Info className="h-4 w-4" />
      關於
    </TabsTrigger>
  </TabsList>
  {/* ... 內容 */}
</Tabs>
```

### 受控分頁

```tsx
function ControlledTabs() {
  const [tab, setTab] = useState('first');

  const handleNext = () => {
    const tabs = ['first', 'second', 'third'];
    const currentIndex = tabs.indexOf(tab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setTab(tabs[nextIndex]);
  };

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="first">步驟 1</TabsTrigger>
        <TabsTrigger value="second">步驟 2</TabsTrigger>
        <TabsTrigger value="third">步驟 3</TabsTrigger>
      </TabsList>
      <TabsContent value="first">
        <p>第一步內容</p>
        <Button onClick={handleNext}>下一步</Button>
      </TabsContent>
      <TabsContent value="second">
        <p>第二步內容</p>
        <Button onClick={handleNext}>下一步</Button>
      </TabsContent>
      <TabsContent value="third">
        <p>第三步內容</p>
        <Button onClick={() => setTab('first')}>重新開始</Button>
      </TabsContent>
    </Tabs>
  );
}
```

### 垂直分頁

```tsx
<Tabs defaultValue="general" orientation="vertical" className="flex gap-4">
  <TabsList className="flex-col h-auto">
    <TabsTrigger value="general" className="w-full justify-start">
      一般
    </TabsTrigger>
    <TabsTrigger value="appearance" className="w-full justify-start">
      外觀
    </TabsTrigger>
    <TabsTrigger value="advanced" className="w-full justify-start">
      進階
    </TabsTrigger>
  </TabsList>
  <div className="flex-1">
    <TabsContent value="general">
      一般設定...
    </TabsContent>
    <TabsContent value="appearance">
      外觀設定...
    </TabsContent>
    <TabsContent value="advanced">
      進階設定...
    </TabsContent>
  </div>
</Tabs>
```

### 停用的分頁

```tsx
<Tabs defaultValue="available">
  <TabsList>
    <TabsTrigger value="available">可用</TabsTrigger>
    <TabsTrigger value="premium" disabled>
      進階版（需要升級）
    </TabsTrigger>
    <TabsTrigger value="beta" disabled>
      測試版（即將推出）
    </TabsTrigger>
  </TabsList>
  <TabsContent value="available">
    <p>可用功能內容</p>
  </TabsContent>
</Tabs>
```

### 帶徽章

```tsx
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all" className="gap-2">
      全部
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
        128
      </span>
    </TabsTrigger>
    <TabsTrigger value="starred" className="gap-2">
      已加星號
      <span className="rounded-full bg-yellow-500/20 text-yellow-600 px-2 py-0.5 text-xs">
        12
      </span>
    </TabsTrigger>
    <TabsTrigger value="recent" className="gap-2">
      最近
      <span className="rounded-full bg-blue-500/20 text-blue-600 px-2 py-0.5 text-xs">
        24
      </span>
    </TabsTrigger>
  </TabsList>
  {/* ... 內容 */}
</Tabs>
```

### 卡片內的分頁

```tsx
<Card>
  <CardHeader>
    <CardTitle>圖片詳情</CardTitle>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="info">
      <TabsList className="w-full">
        <TabsTrigger value="info" className="flex-1">資訊</TabsTrigger>
        <TabsTrigger value="metadata" className="flex-1">中繼資料</TabsTrigger>
        <TabsTrigger value="history" className="flex-1">歷史記錄</TabsTrigger>
      </TabsList>
      <TabsContent value="info" className="pt-4">
        <dl className="space-y-2">
          <div>
            <dt className="text-sm text-muted-foreground">名稱</dt>
            <dd>landscape-sunset.jpg</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">大小</dt>
            <dd>2.4 MB</dd>
          </div>
        </dl>
      </TabsContent>
      {/* ... 其他內容 */}
    </Tabs>
  </CardContent>
</Card>
```

### 延遲載入內容

使用 `forceMount` 控制何時渲染內容：

```tsx
<Tabs defaultValue="light">
  <TabsList>
    <TabsTrigger value="light">輕量資料</TabsTrigger>
    <TabsTrigger value="heavy">大量資料</TabsTrigger>
  </TabsList>
  
  {/* 輕量內容 - 正常卸載 */}
  <TabsContent value="light">
    <LightComponent />
  </TabsContent>
  
  {/* 大量內容 - 保持掛載以保留狀態 */}
  <TabsContent value="heavy" forceMount className="data-[state=inactive]:hidden">
    <HeavyComponent />
  </TabsContent>
</Tabs>
```

## 樣式

### 預設樣式

```tsx
// TabsList 預設樣式
"inline-flex h-10 items-center justify-center rounded-md"
"bg-muted p-1 text-muted-foreground"

// TabsTrigger 預設樣式
"inline-flex items-center justify-center whitespace-nowrap"
"rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background"
"transition-all focus-visible:outline-none focus-visible:ring-2"
"focus-visible:ring-ring focus-visible:ring-offset-2"
"disabled:pointer-events-none disabled:opacity-50"
"data-[state=active]:bg-background data-[state=active]:text-foreground"
"data-[state=active]:shadow-sm"

// TabsContent 預設樣式
"mt-2 ring-offset-background focus-visible:outline-none"
"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### 自訂樣式範例

```tsx
// 全寬分頁
<TabsList className="w-full grid grid-cols-3">
  <TabsTrigger value="a">A</TabsTrigger>
  <TabsTrigger value="b">B</TabsTrigger>
  <TabsTrigger value="c">C</TabsTrigger>
</TabsList>

// 底線樣式
<TabsList className="bg-transparent border-b rounded-none">
  <TabsTrigger 
    value="tab"
    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
  >
    分頁
  </TabsTrigger>
</TabsList>

// 膠囊樣式
<TabsList className="bg-transparent gap-2">
  <TabsTrigger 
    value="tab"
    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    分頁
  </TabsTrigger>
</TabsList>
```

## 無障礙性

分頁實作了全面的鍵盤導覽：

- **Tab**：聚焦到分頁列表，然後進入內容
- **左右箭頭**：在分頁間導覽（水平）
- **上下箭頭**：在分頁間導覽（垂直）
- **Home**：移至第一個分頁
- **End**：移至最後一個分頁
- **Enter/Space**：啟動聚焦的分頁（當 `activationMode="manual"` 時）

### ARIA 屬性

- TabsList 上有 `role="tablist"`
- 每個 TabsTrigger 上有 `role="tab"`
- 每個 TabsContent 上有 `role="tabpanel"`
- 觸發器上有 `aria-selected` 狀態
- `aria-controls` 連結觸發器和面板
- `aria-labelledby` 連結面板和觸發器

### 啟動模式

```tsx
// 自動：箭頭鍵聚焦時啟動分頁（預設）
<Tabs activationMode="automatic">
  {/* 分頁在箭頭鍵時立即切換 */}
</Tabs>

// 手動：只有在 Enter/Space 時啟動分頁
<Tabs activationMode="manual">
  {/* 使用者必須按 Enter 才能切換分頁 */}
</Tabs>
```

## 最佳實踐

### 應該做

- ✅ 使用清晰、簡潔的分頁標籤
- ✅ 將最重要的分頁放在第一位
- ✅ 保持合理的分頁數量（2-7 個）
- ✅ 對於步驟式流程使用受控模式
- ✅ 盡可能保持一致的內容高度
- ✅ 對於渲染成本高的內容考慮使用 `forceMount`

### 不應該做

- ❌ 使用分頁在頁面間導覽
- ❌ 將重要資訊隱藏在非活動分頁中
- ❌ 使分頁寬度太窄以致無法容納標籤
- ❌ 在分頁中嵌套分頁
- ❌ 當內容需要並排比較時使用分頁
- ❌ 分頁太多導致溢出

## URL 同步

將分頁狀態與 URL 同步以獲得可分享的連結：

```tsx
import { useSearchParams } from 'react-router-dom';

function URLTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="overview">概覽</TabsTrigger>
        <TabsTrigger value="details">詳情</TabsTrigger>
      </TabsList>
      {/* ... 內容 */}
    </Tabs>
  );
}
```

## 相關元件

- [Card](../ui/card) - 常用於包裹分頁內容
- [Button](../ui/button) - 用於基於動作的導覽的替代方案
- [DropdownMenu](../overlay/dropdown-menu) - 在有限空間中提供多個選項
