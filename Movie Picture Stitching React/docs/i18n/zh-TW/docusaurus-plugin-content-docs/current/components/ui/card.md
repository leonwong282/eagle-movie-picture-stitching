---
sidebar_position: 2
title: Card
description: 靈活的卡片容器，支援玻璃擬態變體和語意化區塊
---

# Card

一個靈活的容器元件，支援多種變體和語意化子元件，用於結構化內容。

## 匯入

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  cardVariants,
} from '@/components';
```

## 基本用法

```tsx
<Card>
  <CardHeader>
    <CardTitle>卡片標題</CardTitle>
    <CardDescription>卡片描述在這裡</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片內容...</p>
  </CardContent>
  <CardFooter>
    <Button>操作</Button>
  </CardFooter>
</Card>
```

## 變體

```tsx
// Default - 實心背景帶陰影
<Card variant="default">...</Card>

// Glass - 半透明帶背景模糊（非常適合 Eagle 外掛）
<Card variant="glass">...</Card>

// Outline - 透明帶突出邊框
<Card variant="outline">...</Card>
```

| 變體 | 效果 | 使用情境 |
|---------|--------|----------|
| `default` | 實心 `bg-card` 帶細微陰影 | 標準卡片 |
| `glass` | 80% 不透明度 + `backdrop-blur-xl` | 覆蓋層內容、Eagle 面板 |
| `outline` | 透明帶 2px 邊框 | 可選擇項目、強調 |

## 複合元件

Card 使用複合元件模式實現靈活佈局：

### CardHeader

標題區域的容器。自動排列標題、描述和操作按鈕。

```tsx
<CardHeader>
  <CardTitle>標題</CardTitle>
  <CardDescription>描述</CardDescription>
  <CardAction>
    <Button size="sm">編輯</Button>
  </CardAction>
</CardHeader>
```

### CardTitle

主要標題。渲染為帶有半粗體字型的 `<div>`。

```tsx
<CardTitle>我的卡片標題</CardTitle>

// 帶圖示
<CardTitle className="flex items-center gap-2">
  <Settings className="w-5 h-5" />
  設定
</CardTitle>
```

### CardDescription

標題下方的次要文字。

```tsx
<CardDescription>
  在這裡設定您的外掛偏好。
</CardDescription>
```

### CardAction

將操作按鈕定位在標題右上角。

```tsx
<CardHeader>
  <CardTitle>項目</CardTitle>
  <CardAction>
    <Button variant="ghost" size="icon-sm">
      <MoreHorizontal className="w-4 h-4" />
    </Button>
  </CardAction>
</CardHeader>
```

### CardContent

主要內容區域。預設有水平內距和底部內距。

```tsx
<CardContent>
  <p>您的內容在這裡...</p>
</CardContent>

// 移除預設內距
<CardContent className="p-0">
  <img src="..." className="w-full" />
</CardContent>
```

### CardFooter

操作的底部區塊。使用 flexbox 對齊。

```tsx
<CardFooter>
  <Button variant="outline">取消</Button>
  <Button className="ml-auto">儲存</Button>
</CardFooter>
```

## Props

### Card

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `variant` | `'default' \| 'glass' \| 'outline'` | `'default'` | 視覺樣式 |
| `className` | `string` | — | 額外的 CSS class |
| `children` | `ReactNode` | — | 卡片內容 |

加上所有標準的 `<div>` HTML 屬性。

### 其他元件

所有子元件（`CardHeader`、`CardTitle` 等）接受：
- `className` 用於額外樣式
- 所有標準的 `<div>` HTML 屬性
- `children` 用於內容

## 範例

### 功能卡片

```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Zap className="w-5 h-5 text-primary" />
      快速處理
    </CardTitle>
    <CardDescription>
      在幾秒內處理數千張圖片
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2 text-sm">
      <li>✓ 批次處理</li>
      <li>✓ 並行執行</li>
      <li>✓ 記憶體效率高</li>
    </ul>
  </CardContent>
</Card>
```

### 設定卡片

```tsx
<Card variant="glass">
  <CardHeader>
    <CardTitle>匯出設定</CardTitle>
    <CardAction>
      <Button variant="ghost" size="sm">重置</Button>
    </CardAction>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>格式</Label>
      <Select>...</Select>
    </div>
    <div>
      <Label>品質</Label>
      <Slider defaultValue={[80]} />
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">套用設定</Button>
  </CardFooter>
</Card>
```

### 可選擇卡片

```tsx
function SelectableCard({ selected, onSelect }) {
  return (
    <Card 
      variant={selected ? 'outline' : 'default'}
      className={cn(
        'cursor-pointer transition-all',
        selected && 'ring-2 ring-primary'
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <p>點擊選擇</p>
      </CardContent>
    </Card>
  );
}
```

### 圖片卡片

```tsx
<Card className="overflow-hidden">
  <CardContent className="p-0">
    <EagleImage 
      item={item} 
      useThumbnail 
      aspectRatio="16/9"
    />
  </CardContent>
  <CardHeader>
    <CardTitle className="text-base">{item.name}</CardTitle>
    <CardDescription>{item.ext.toUpperCase()}</CardDescription>
  </CardHeader>
</Card>
```

## 使用 cardVariants

用於自訂類卡片元素：

```tsx
import { cardVariants } from '@/components';

<section className={cardVariants({ variant: 'glass' })}>
  自訂卡片樣式區塊
</section>
```

## 樣式

Card 使用 CSS 變數進行主題設定：

```css
/* 淺色模式 */
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;

/* 深色模式 */
--card: 222.2 84% 4.9%;
--card-foreground: 210 40% 98%;
```

## 無障礙

- **語意化**：使用 `<div>` 元素；為地標區域新增 `role="region"` 和 `aria-labelledby`
- **焦點**：卡片預設不可聚焦；互動式卡片應使用 `tabIndex={0}`
- **標題**：在需要時於 `CardTitle` 中使用適當的標題層級

```tsx
// 帶有標題的無障礙卡片
<Card role="region" aria-labelledby="card-title">
  <CardHeader>
    <CardTitle>
      <h3 id="card-title">設定</h3>
    </CardTitle>
  </CardHeader>
  ...
</Card>
```
