---
sidebar_position: 2
title: Label
description: 支援配對樣式的無障礙表單標籤
---

# Label

一個建立在 Radix UI Label 原語之上的無障礙標籤元件，具有停用狀態的自動樣式。

## 匯入

```tsx
import { Label } from '@/components';
```

## 基本用法

```tsx
<Label htmlFor="email">電子郵件</Label>
<Input id="email" type="email" />
```

## 搭配表單控制項

### Input

```tsx
<div className="space-y-2">
  <Label htmlFor="name">姓名</Label>
  <Input id="name" placeholder="輸入您的姓名" />
</div>
```

### Checkbox

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">接受條款和條件</Label>
</div>
```

### Select

```tsx
<div className="space-y-2">
  <Label htmlFor="country">國家</Label>
  <Select>
    <SelectTrigger id="country">
      <SelectValue placeholder="選擇國家" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">美國</SelectItem>
      <SelectItem value="uk">英國</SelectItem>
    </SelectContent>
  </Select>
</div>
```

## 停用狀態

當其配對輸入框被停用時，Label 會自動調整樣式：

```tsx
<div className="space-y-2">
  <Label htmlFor="disabled-input">已停用的欄位</Label>
  <Input id="disabled-input" disabled />
</div>
```

當關聯的輸入框被停用時，標籤會變為半透明並顯示 `cursor-not-allowed`。

## Props

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `htmlFor` | `string` | — | 關聯表單控制項的 ID |
| `className` | `string` | — | 額外的 CSS class |
| `children` | `ReactNode` | — | 標籤文字 |

加上透過 Radix UI 提供的所有標準 `<label>` HTML 屬性。

## 範例

### 必填欄位

```tsx
<Label htmlFor="email">
  電子郵件 <span className="text-destructive">*</span>
</Label>
<Input id="email" required />
```

### 帶描述

```tsx
<div className="space-y-2">
  <Label htmlFor="bio">自我介紹</Label>
  <p className="text-sm text-muted-foreground">
    用 160 個字元或更少來介紹您自己。
  </p>
  <Input id="bio" />
</div>
```

### 內嵌標籤

```tsx
<div className="flex items-center gap-4">
  <Label htmlFor="quantity" className="whitespace-nowrap">
    數量
  </Label>
  <Input id="quantity" type="number" className="w-20" />
</div>
```

### 表單群組元件

```tsx
interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, name, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}

// 使用方式
<FormField label="電子郵件" name="email" required>
  <Input id="email" type="email" />
</FormField>
```

## 樣式

預設樣式：

```css
text-sm           /* 字型大小 */
font-medium       /* 字型粗細 */
leading-none      /* 行高 */
peer-disabled:cursor-not-allowed
peer-disabled:opacity-70
```

### 自訂樣式

```tsx
// 較大的標籤
<Label className="text-base">大標籤</Label>

// 粗體標籤
<Label className="font-bold">粗體標籤</Label>

// 帶圖示
<Label className="flex items-center gap-2">
  <Mail className="w-4 h-4" />
  電子郵件
</Label>
```

## 無障礙

- **語意化**：透過 Radix UI 使用原生 `<label>` 元素
- **關聯**：使用 `htmlFor` 與表單控制項關聯
- **可點擊**：點擊標籤會聚焦關聯的輸入框

```tsx
// ✅ 正確 - 標籤已關聯
<Label htmlFor="email">電子郵件</Label>
<Input id="email" />

// ❌ 錯誤 - 無關聯
<Label>電子郵件</Label>
<Input />
```

## Radix UI Label

此元件建立在 [@radix-ui/react-label](https://www.radix-ui.com/primitives/docs/components/label) 之上，提供：

- 原生標籤語意
- 點擊聚焦行為
- 正確的無障礙屬性
