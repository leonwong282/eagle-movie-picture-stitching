---
sidebar_position: 1
title: Input
description: 帶有焦點狀態和驗證樣式的文字輸入框
---

# Input

一個帶有焦點狀態、驗證樣式和檔案輸入支援的樣式化文字輸入元件。

## 匯入

```tsx
import { Input } from '@/components';
import type { InputProps } from '@/components';
```

## 基本用法

```tsx
<Input type="text" placeholder="輸入您的姓名" />
```

## 輸入類型

```tsx
// 文字輸入（預設）
<Input type="text" placeholder="使用者名稱" />

// 密碼
<Input type="password" placeholder="密碼" />

// 電子郵件
<Input type="email" placeholder="email@example.com" />

// 數字
<Input type="number" min={0} max={100} />

// 搜尋
<Input type="search" placeholder="搜尋..." />

// 檔案上傳
<Input type="file" accept="image/*" />
```

## 搭配標籤

搭配 Label 元件使用以建立無障礙表單：

```tsx
import { Label, Input } from '@/components';

<div className="space-y-2">
  <Label htmlFor="email">電子郵件</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

## 狀態

### 停用

```tsx
<Input disabled placeholder="已停用的輸入框" />
```

### 無效（驗證錯誤）

使用 `aria-invalid` 顯示驗證錯誤樣式：

```tsx
<Input aria-invalid="true" placeholder="無效的輸入" />
```

輸入框在無效時會顯示紅色邊框和焦點環。

### 唯讀

```tsx
<Input readOnly value="唯讀值" />
```

## Props

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | 輸入類型（text、password、email 等） |
| `placeholder` | `string` | — | 佔位文字 |
| `disabled` | `boolean` | `false` | 停用輸入框 |
| `aria-invalid` | `boolean` | — | 顯示驗證錯誤樣式 |
| `className` | `string` | — | 額外的 CSS class |

加上所有標準的 `<input>` HTML 屬性。

## 範例

### 帶驗證的表單

```tsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <form>
      <div className="space-y-2">
        <Label htmlFor="email">電子郵件</Label>
        <Input
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          {...register('email', { required: true })}
        />
        {errors.email && (
          <p className="text-sm text-destructive">電子郵件為必填</p>
        )}
      </div>
    </form>
  );
}
```

### 搜尋輸入框

```tsx
import { Search } from 'lucide-react';

<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <Input 
    type="search" 
    placeholder="搜尋..." 
    className="pl-9"
  />
</div>
```

### 輸入框搭配按鈕

```tsx
<div className="flex gap-2">
  <Input placeholder="輸入 URL" className="flex-1" />
  <Button>新增</Button>
</div>
```

### 檔案輸入

```tsx
<Input 
  type="file" 
  accept="image/*"
  onChange={(e) => handleFileSelect(e.target.files)}
/>
```

## 樣式

Input 使用語意化顏色標記：

```css
/* 基本樣式 */
border-input        /* 邊框顏色 */
bg-transparent      /* 背景 */
text-foreground     /* 文字顏色 */
placeholder:text-muted-foreground

/* 焦點狀態 */
focus-visible:ring-1
focus-visible:ring-ring

/* 無效狀態 */
aria-invalid:border-destructive
aria-invalid:ring-destructive/20
```

### 自訂樣式

```tsx
// 全寬
<Input className="w-full" />

// 較大的輸入框
<Input className="h-12 text-lg" />

// 自訂顏色
<Input className="border-primary focus-visible:ring-primary" />
```

## 無障礙

- **標籤**：始終搭配 `<Label>` 以實現無障礙
- **ID**：使用配對的 `htmlFor` 和 `id` 屬性
- **驗證**：使用 `aria-invalid` 和 `aria-describedby` 處理錯誤
- **鍵盤**：標準輸入框鍵盤行為

```tsx
<div className="space-y-2">
  <Label htmlFor="username">使用者名稱</Label>
  <Input 
    id="username"
    aria-invalid={!!error}
    aria-describedby={error ? 'username-error' : undefined}
  />
  {error && (
    <p id="username-error" className="text-sm text-destructive">
      {error.message}
    </p>
  )}
</div>
```

## TypeScript

```tsx
import type { InputProps } from '@/components';

// 使用自訂 props 擴展
interface SearchInputProps extends InputProps {
  onSearch: (value: string) => void;
}

function SearchInput({ onSearch, ...props }: SearchInputProps) {
  return (
    <Input 
      type="search"
      onChange={(e) => onSearch(e.target.value)}
      {...props}
    />
  );
}
```
