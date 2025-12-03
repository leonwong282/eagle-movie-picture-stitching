---
sidebar_position: 1
title: Button
description: 多功能按鈕元件，支援 8 種變體和載入狀態
---

# Button

一個多功能按鈕元件，支援 8 種樣式變體、6 種尺寸選項和內建載入狀態支援。

## 匯入

```tsx
import { Button, buttonVariants } from '@/components';
```

## 基本用法

```tsx
<Button>點我</Button>
```

## 變體

Button 元件支援 8 種樣式變體：

```tsx
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
```

| 變體 | 使用情境 |
|---------|----------|
| `default` / `primary` | 主要操作 |
| `destructive` | 危險或不可逆的操作 |
| `outline` | 帶有邊框的次要操作 |
| `secondary` | 主要操作的替代選項 |
| `ghost` | 細微操作、工具列按鈕 |
| `link` | 導覽、內嵌連結 |
| `success` | 正向確認（Eagle 專用） |
| `warning` | 警告性操作（Eagle 專用） |

## 尺寸

```tsx
<Button size="sm">小</Button>
<Button size="default">預設</Button>
<Button size="lg">大</Button>
<Button size="icon"><Plus /></Button>
<Button size="icon-sm"><Plus /></Button>
<Button size="icon-lg"><Plus /></Button>
```

| 尺寸 | 高度 | 使用情境 |
|------|--------|----------|
| `sm` | 32px | 緊湊 UI、表格 |
| `default` | 36px | 標準按鈕 |
| `lg` | 40px | 突出的 CTA |
| `icon` | 36×36px | 僅圖示按鈕 |
| `icon-sm` | 32×32px | 緊湊圖示按鈕 |
| `icon-lg` | 40×40px | 大型圖示按鈕 |

## 載入狀態

在非同步操作期間顯示載入指示器並停用按鈕：

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  try {
    await saveData();
  } finally {
    setIsLoading(false);
  }
};

<Button isLoading={isLoading} onClick={handleSave}>
  儲存變更
</Button>
```

當 `isLoading` 為 `true` 時：
- 在文字前顯示載入指示器
- 按鈕自動停用
- 防止點擊事件

## 使用 asChild 組合

使用 `asChild` prop 將按鈕渲染為不同元素，同時保持所有樣式：

```tsx
// 渲染為連結
<Button asChild variant="link">
  <a href="/docs">閱讀文件</a>
</Button>

// 渲染為 Next.js Link
<Button asChild>
  <Link href="/settings">設定</Link>
</Button>
```

## 搭配圖示

```tsx
import { Plus, Download, Trash2 } from 'lucide-react';

// 文字前的圖示
<Button>
  <Plus className="w-4 h-4" />
  新增項目
</Button>

// 文字後的圖示
<Button>
  下載
  <Download className="w-4 h-4" />
</Button>

// 僅圖示按鈕
<Button variant="ghost" size="icon">
  <Trash2 className="w-4 h-4" />
</Button>
```

## 停用狀態

```tsx
<Button disabled>已停用</Button>
<Button disabled variant="outline">已停用 Outline</Button>
```

## Props

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' \| 'success' \| 'warning'` | `'default'` | 視覺樣式變體 |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'icon-sm' \| 'icon-lg'` | `'default'` | 按鈕尺寸 |
| `asChild` | `boolean` | `false` | 透過 Radix Slot 渲染為子元素 |
| `isLoading` | `boolean` | `false` | 顯示載入指示器並停用按鈕 |
| `disabled` | `boolean` | `false` | 停用按鈕 |
| `className` | `string` | — | 額外的 CSS class |
| `children` | `ReactNode` | — | 按鈕內容 |

加上所有標準的 `<button>` HTML 屬性。

## 使用 buttonVariants

對於需要按鈕樣式的非按鈕元素：

```tsx
import { buttonVariants } from '@/components';
import Link from 'next/link';

<Link 
  href="/docs" 
  className={buttonVariants({ variant: 'outline', size: 'lg' })}
>
  文件
</Link>
```

## 無障礙

- **鍵盤**：`Tab` 聚焦，`Enter` 或 `Space` 啟動
- **ARIA**：使用原生 `<button>` 語意
- **焦點**：可見的焦點環（`focus-visible:ring-[3px]`）
- **停用**：透過 `disabled` 屬性隱式設定 `aria-disabled`

## 範例

### 表單提交按鈕

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" isLoading={isSubmitting}>
    {isSubmitting ? '儲存中...' : '儲存'}
  </Button>
</form>
```

### 按鈕群組

```tsx
<div className="flex gap-2">
  <Button variant="outline">取消</Button>
  <Button>確認</Button>
</div>
```

### 工具列

```tsx
<div className="flex gap-1 p-1 bg-muted rounded-lg">
  <Button variant="ghost" size="icon-sm"><Bold /></Button>
  <Button variant="ghost" size="icon-sm"><Italic /></Button>
  <Button variant="ghost" size="icon-sm"><Underline /></Button>
</div>
```
