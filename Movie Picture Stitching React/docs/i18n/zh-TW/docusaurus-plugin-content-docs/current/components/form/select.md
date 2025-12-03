```markdown
---
sidebar_position: 3
title: Select
description: 下拉選擇元件，支援搜尋、分組和鍵盤導航
---

# Select

基於 Radix UI Select 原生元件構建的下拉選擇元件，支援完整的鍵盤導航、分組和動畫效果。

## 匯入

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components';
```

## 基本用法

```tsx
<Select>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="選擇一個水果" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">蘋果</SelectItem>
    <SelectItem value="banana">香蕉</SelectItem>
    <SelectItem value="orange">橘子</SelectItem>
  </SelectContent>
</Select>
```

## 受控選擇

```tsx
const [value, setValue] = useState('');

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="選擇格式" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="jpg">JPEG</SelectItem>
    <SelectItem value="png">PNG</SelectItem>
    <SelectItem value="webp">WebP</SelectItem>
  </SelectContent>
</Select>
```

## 帶分組

```tsx
<Select>
  <SelectTrigger className="w-64">
    <SelectValue placeholder="選擇時區" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>北美洲</SelectLabel>
      <SelectItem value="est">東部時間 (ET)</SelectItem>
      <SelectItem value="cst">中部時間 (CT)</SelectItem>
      <SelectItem value="pst">太平洋時間 (PT)</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>歐洲</SelectLabel>
      <SelectItem value="gmt">格林威治標準時間 (GMT)</SelectItem>
      <SelectItem value="cet">中歐時間 (CET)</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## 帶標籤

```tsx
<div className="space-y-2">
  <Label htmlFor="format">匯出格式</Label>
  <Select>
    <SelectTrigger id="format">
      <SelectValue placeholder="選擇格式" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="jpg">JPEG (.jpg)</SelectItem>
      <SelectItem value="png">PNG (.png)</SelectItem>
      <SelectItem value="webp">WebP (.webp)</SelectItem>
    </SelectContent>
  </Select>
</div>
```

## 禁用狀態

```tsx
// 整個選擇器禁用
<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="已禁用" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">選項 A</SelectItem>
  </SelectContent>
</Select>

// 個別選項禁用
<Select>
  <SelectTrigger>
    <SelectValue placeholder="選擇" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="free">免費方案</SelectItem>
    <SelectItem value="pro" disabled>專業方案（即將推出）</SelectItem>
    <SelectItem value="enterprise">企業方案</SelectItem>
  </SelectContent>
</Select>
```

## 元件

### SelectTrigger

用於開啟下拉選單的按鈕。

```tsx
<SelectTrigger className="w-full">
  <SelectValue placeholder="選擇..." />
</SelectTrigger>
```

| Prop | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `className` | `string` | — | 額外的 CSS 類別 |
| `children` | `ReactNode` | — | 通常為 `<SelectValue>` |

### SelectValue

顯示已選擇的值或占位符。

```tsx
<SelectValue placeholder="選擇一個選項" />
```

| Prop | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `placeholder` | `string` | — | 未選擇時顯示的文字 |

### SelectContent

包含選項的下拉面板。

```tsx
<SelectContent position="popper">
  {/* 選項 */}
</SelectContent>
```

| Prop | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `position` | `'popper' \| 'item-aligned'` | `'popper'` | 定位策略 |
| `className` | `string` | — | 額外的 CSS 類別 |

### SelectItem

單個選項。

```tsx
<SelectItem value="unique-value">顯示文字</SelectItem>
```

| Prop | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `value` | `string` | — | 唯一值（必填） |
| `disabled` | `boolean` | `false` | 禁用此選項 |
| `children` | `ReactNode` | — | 顯示內容 |

### SelectGroup 與 SelectLabel

將相關選項分組並加上標籤。

```tsx
<SelectGroup>
  <SelectLabel>類別</SelectLabel>
  <SelectItem value="a">選項 A</SelectItem>
  <SelectItem value="b">選項 B</SelectItem>
</SelectGroup>
```

### SelectSeparator

分組之間的視覺分隔線。

```tsx
<SelectGroup>...</SelectGroup>
<SelectSeparator />
<SelectGroup>...</SelectGroup>
```

## 範例

### 圖片格式選擇器

```tsx
function FormatSelector({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="jpg">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            JPEG
          </span>
        </SelectItem>
        <SelectItem value="png">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            PNG
          </span>
        </SelectItem>
        <SelectItem value="webp">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            WebP
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### 表單整合

```tsx
import { useForm, Controller } from 'react-hook-form';

function MyForm() {
  const { control } = useForm();

  return (
    <Controller
      name="category"
      control={control}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder="選擇類別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="photos">照片</SelectItem>
            <SelectItem value="videos">影片</SelectItem>
            <SelectItem value="documents">文件</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  );
}
```

## 鍵盤導航

| 按鍵 | 動作 |
|-----|--------|
| `Space` / `Enter` | 開啟下拉選單 / 選擇項目 |
| `↑` / `↓` | 導航選項 |
| `Home` / `End` | 跳至第一個/最後一個選項 |
| `Escape` | 關閉下拉選單 |
| 輸入字元 | 跳至符合的選項 |

## 無障礙

- **ARIA**：正確的 `role="listbox"` 和 `role="option"` 屬性
- **鍵盤**：完整的鍵盤導航支援
- **焦點**：開啟時焦點陷阱，關閉時返回焦點
- **標籤**：使用相符的 ID 與 `<Label>` 關聯

## 動畫

選擇內容在開啟/關閉時會有動畫效果：

- `fade-in` / `fade-out` 用於透明度
- `zoom-in-95` / `zoom-out-95` 用於縮放
- 根據下拉位置的方向感知滑動動畫

```
