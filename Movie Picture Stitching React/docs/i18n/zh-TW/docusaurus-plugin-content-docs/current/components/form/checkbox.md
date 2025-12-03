```markdown
---
sidebar_position: 4
title: Checkbox
description: 無障礙核取方塊，支援可選標籤和動畫效果
---

# Checkbox

基於 Radix UI Checkbox 原生元件構建的無障礙核取方塊元件，支援可選的行內標籤和勾選動畫。

## 匯入

```tsx
import { Checkbox } from '@/components';
import type { CheckboxProps } from '@/components';
```

## 基本用法

```tsx
<Checkbox />
```

## 帶標籤

核取方塊支援可選的 `label` prop 用於行內標籤：

```tsx
<Checkbox label="接受條款與條件" />
```

或使用獨立的 Label 元件：

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">接受條款與條件</Label>
</div>
```

## 受控核取方塊

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  label="啟用通知"
/>
```

## 核取方塊狀態

### 未勾選（預設）

```tsx
<Checkbox label="未勾選" />
```

### 已勾選

```tsx
<Checkbox checked label="已勾選" />
```

### 不確定狀態

用於「全選」模式：

```tsx
<Checkbox checked="indeterminate" label="全選" />
```

### 禁用

```tsx
<Checkbox disabled label="禁用未勾選" />
<Checkbox disabled checked label="禁用已勾選" />
```

## Props

| Prop | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | — | 受控的勾選狀態 |
| `defaultChecked` | `boolean` | `false` | 預設勾選狀態（非受控） |
| `onCheckedChange` | `(checked: boolean) => void` | — | 勾選狀態變更時呼叫 |
| `label` | `string` | — | 可選的行內標籤文字 |
| `disabled` | `boolean` | `false` | 禁用核取方塊 |
| `id` | `string` | 自動產生 | 用於標籤關聯的核取方塊 ID |
| `className` | `string` | — | 額外的 CSS 類別 |

加上所有 Radix UI Checkbox props。

## 範例

### 帶多個核取方塊的表單

```tsx
const [selected, setSelected] = useState<string[]>([]);

const handleChange = (value: string, checked: boolean) => {
  setSelected(prev => 
    checked 
      ? [...prev, value]
      : prev.filter(v => v !== value)
  );
};

<div className="space-y-3">
  <Checkbox
    label="照片"
    checked={selected.includes('photos')}
    onCheckedChange={(checked) => handleChange('photos', checked)}
  />
  <Checkbox
    label="影片"
    checked={selected.includes('videos')}
    onCheckedChange={(checked) => handleChange('videos', checked)}
  />
  <Checkbox
    label="文件"
    checked={selected.includes('documents')}
    onCheckedChange={(checked) => handleChange('documents', checked)}
  />
</div>
```

### 全選模式

```tsx
function SelectAllExample({ items }) {
  const [selected, setSelected] = useState<string[]>([]);
  
  const allSelected = selected.length === items.length;
  const someSelected = selected.length > 0 && !allSelected;
  
  return (
    <div className="space-y-3">
      <Checkbox
        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
        onCheckedChange={(checked) => {
          setSelected(checked ? items.map(i => i.id) : []);
        }}
        label="全選"
      />
      <div className="ml-6 space-y-2">
        {items.map(item => (
          <Checkbox
            key={item.id}
            label={item.name}
            checked={selected.includes(item.id)}
            onCheckedChange={(checked) => {
              setSelected(prev =>
                checked
                  ? [...prev, item.id]
                  : prev.filter(id => id !== item.id)
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### 帶表單驗證

```tsx
import { useForm } from 'react-hook-form';

function TermsForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Checkbox
          {...register('terms', { required: '您必須接受條款' })}
          label="我接受條款與條件"
          aria-invalid={!!errors.terms}
        />
        {errors.terms && (
          <p className="text-sm text-destructive">{errors.terms.message}</p>
        )}
      </div>
      <Button type="submit" className="mt-4">提交</Button>
    </form>
  );
}
```

### 核取方塊卡片

```tsx
function CheckboxCard({ title, description, checked, onChange }) {
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all',
        checked && 'ring-2 ring-primary'
      )}
      onClick={() => onChange(!checked)}
    >
      <CardContent className="flex items-start gap-4 p-4">
        <Checkbox checked={checked} onCheckedChange={onChange} />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 樣式

預設樣式包括：

- **尺寸**：20×20px（`size-5`）
- **邊框**：2px 實線加圓角
- **已勾選**：主色背景配白色勾選標記
- **動畫**：勾選時的縮放效果

### 自訂樣式

```tsx
// 較大的核取方塊
<Checkbox className="size-6" label="大" />

// 自訂顏色
<Checkbox 
  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
  label="勾選時為綠色"
/>
```

## 無障礙

- **ARIA**：正確的 `role="checkbox"` 和 `aria-checked` 狀態
- **鍵盤**：`Space` 切換，`Tab` 導航
- **焦點**：可見的焦點環
- **標籤**：點擊標籤可切換核取方塊

## 動畫

勾選時勾選圖示會以動畫方式出現：

```css
animate-in zoom-in-50 duration-150
```

```
