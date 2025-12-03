```markdown
---
sidebar_position: 5
title: Slider
description: 範圍滑桿，支援數值顯示和標籤
---

# Slider

基於 Radix UI Slider 原生元件構建的範圍滑桿元件，支援可選的標籤和數值顯示。

## 匯入

```tsx
import { Slider } from '@/components';
import type { SliderProps } from '@/components';
```

## 基本用法

```tsx
<Slider defaultValue={[50]} max={100} />
```

## 受控滑桿

```tsx
const [value, setValue] = useState([75]);

<Slider
  value={value}
  onValueChange={setValue}
  max={100}
/>
```

## 帶標籤

```tsx
<Slider
  label="品質"
  defaultValue={[80]}
  max={100}
/>
```

## 帶數值顯示

顯示目前的數值：

```tsx
<Slider
  label="音量"
  showValue
  defaultValue={[50]}
  max={100}
/>
```

這會在左側顯示標籤，右側顯示數值。

## 範圍滑桿

使用包含兩個值的陣列來進行範圍選擇：

```tsx
const [range, setRange] = useState([25, 75]);

<Slider
  label="價格範圍"
  showValue
  value={range}
  onValueChange={setRange}
  max={100}
/>
```

## Props

| Prop | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `value` | `number[]` | — | 受控的數值 |
| `defaultValue` | `number[]` | — | 預設數值 |
| `onValueChange` | `(value: number[]) => void` | — | 數值變更時呼叫 |
| `min` | `number` | `0` | 最小值 |
| `max` | `number` | `100` | 最大值 |
| `step` | `number` | `1` | 步進增量 |
| `label` | `string` | — | 滑桿上方的標籤文字 |
| `showValue` | `boolean` | `false` | 顯示目前數值 |
| `disabled` | `boolean` | `false` | 禁用滑桿 |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 滑桿方向 |
| `className` | `string` | — | 額外的 CSS 類別 |

加上所有 Radix UI Slider props。

## 範例

### 品質滑桿

```tsx
function QualitySlider() {
  const [quality, setQuality] = useState([80]);

  return (
    <div className="space-y-4">
      <Slider
        label="匯出品質"
        showValue
        value={quality}
        onValueChange={setQuality}
        min={10}
        max={100}
        step={5}
      />
      <p className="text-sm text-muted-foreground">
        {quality[0] < 50 ? '低品質，檔案較小' :
         quality[0] < 80 ? '品質與大小平衡' :
         '高品質，檔案較大'}
      </p>
    </div>
  );
}
```

### 圖片縮放滑桿

```tsx
function ResizeSlider({ onResize }) {
  const [scale, setScale] = useState([100]);

  return (
    <Slider
      label="縮放"
      showValue
      value={scale}
      onValueChange={(v) => {
        setScale(v);
        onResize(v[0] / 100);
      }}
      min={10}
      max={200}
      step={10}
    />
  );
}
```

### 顏色選擇器滑桿

```tsx
function RGBSliders() {
  const [r, setR] = useState([128]);
  const [g, setG] = useState([128]);
  const [b, setB] = useState([128]);

  return (
    <div className="space-y-4">
      <Slider
        label="紅色"
        showValue
        value={r}
        onValueChange={setR}
        max={255}
        className="[&_[data-slot=slider-range]]:bg-red-500"
      />
      <Slider
        label="綠色"
        showValue
        value={g}
        onValueChange={setG}
        max={255}
        className="[&_[data-slot=slider-range]]:bg-green-500"
      />
      <Slider
        label="藍色"
        showValue
        value={b}
        onValueChange={setB}
        max={255}
        className="[&_[data-slot=slider-range]]:bg-blue-500"
      />
      <div 
        className="h-16 rounded-lg"
        style={{ backgroundColor: `rgb(${r[0]}, ${g[0]}, ${b[0]})` }}
      />
    </div>
  );
}
```

### 帶刻度標記

```tsx
function SliderWithMarks() {
  const marks = [0, 25, 50, 75, 100];
  
  return (
    <div className="space-y-2">
      <Slider defaultValue={[50]} max={100} step={25} />
      <div className="flex justify-between text-xs text-muted-foreground">
        {marks.map(mark => (
          <span key={mark}>{mark}%</span>
        ))}
      </div>
    </div>
  );
}
```

### 表單整合

```tsx
import { Controller, useForm } from 'react-hook-form';

function SettingsForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { quality: [80] }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="quality"
        control={control}
        render={({ field }) => (
          <Slider
            label="品質"
            showValue
            value={field.value}
            onValueChange={field.onChange}
            max={100}
          />
        )}
      />
      <Button type="submit" className="mt-4">儲存</Button>
    </form>
  );
}
```

## 樣式

### 軌道
軌道是完整的滑桿背景：
```css
bg-muted rounded-full h-2
```

### 範圍
已填充的部分：
```css
bg-primary
```

### 滑塊
可拖曳的把手：
```css
size-4 rounded-full bg-background border-primary/50 shadow-sm
```

### 自訂顏色

```tsx
// 綠色滑桿
<Slider 
  className="[&_[data-slot=slider-range]]:bg-green-500"
  defaultValue={[50]}
/>

// 較大的滑塊
<Slider
  className="[&_[data-slot=slider-thumb]]:size-6"
  defaultValue={[50]}
/>
```

## 鍵盤導航

| 按鍵 | 動作 |
|-----|--------|
| `→` / `↑` | 按步進增加 |
| `←` / `↓` | 按步進減少 |
| `Home` | 設為最小值 |
| `End` | 設為最大值 |
| `Page Up` | 增加 10% |
| `Page Down` | 減少 10% |

## 無障礙

- **ARIA**：`role="slider"` 加上 `aria-valuemin`、`aria-valuemax`、`aria-valuenow`
- **鍵盤**：完整的鍵盤導航支援
- **焦點**：滑塊上可見的焦點環
- **標籤**：使用 `label` prop 或與 `<Label>` 關聯

## 垂直方向

```tsx
<div className="h-48">
  <Slider
    orientation="vertical"
    defaultValue={[50]}
    max={100}
  />
</div>
```

注意：垂直滑桿需要在容器上設定高度限制。

```
