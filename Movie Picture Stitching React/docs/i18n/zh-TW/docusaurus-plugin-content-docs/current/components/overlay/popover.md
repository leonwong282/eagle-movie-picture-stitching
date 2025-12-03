---
sidebar_position: 4
title: Popover 彈出框
description: 用於互動式覆蓋層和表單的浮動內容面板
---

# Popover 彈出框

基於 [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover) 建構的浮動內容面板，為互動內容、表單和補充資訊提供無障礙的覆蓋層。

## 匯入

```tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
  PopoverClose,
} from '@/components';
```

## 基本用法

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">開啟彈出框</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-2">
      <h4 className="font-medium">彈出框標題</h4>
      <p className="text-sm text-muted-foreground">
        這是一些彈出框內容。
      </p>
    </div>
  </PopoverContent>
</Popover>
```

## 元件

| 元件 | 說明 |
|-----------|-------------|
| `Popover` | 管理彈出框狀態的根元件 |
| `PopoverTrigger` | 開啟彈出框的元素 |
| `PopoverContent` | 浮動內容容器 |
| `PopoverAnchor` | 可選的自訂錨點 |
| `PopoverClose` | 關閉彈出框的按鈕 |

## 屬性

### Popover

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `open` | `boolean` | - | 受控的開啟狀態 |
| `onOpenChange` | `(open: boolean) => void` | - | 開啟狀態變更時的回呼 |
| `defaultOpen` | `boolean` | `false` | 初始開啟狀態 |
| `modal` | `boolean` | `false` | 是否以模態方式渲染 |

### PopoverContent

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `className` | `string` | - | 額外的 CSS 類別 |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | 相對於錨點的對齊方式 |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 偏好的位置方向 |
| `sideOffset` | `number` | `4` | 與錨點的距離 |
| `alignOffset` | `number` | `0` | 對齊的偏移量 |
| `avoidCollisions` | `boolean` | `true` | 翻轉以避免超出視窗邊緣 |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | `0` | 與視窗邊緣的間距 |
| `sticky` | `'partial' \| 'always'` | `'partial'` | 捲動時的黏附行為 |
| `hideWhenDetached` | `boolean` | `false` | 當錨點離開螢幕時隱藏 |

### PopoverTrigger / PopoverClose

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | 將屬性合併到子元素上 |

## 範例

### 設定彈出框

```tsx
function SettingsPopover() {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">設定</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">通知</Label>
              <Checkbox
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autosave">自動儲存</Label>
              <Checkbox
                id="autosave"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### 表單彈出框

```tsx
function QuickAddPopover() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 處理提交
    setOpen(false);
    setName('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          快速新增
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">新增項目</h4>
            <p className="text-sm text-muted-foreground">
              輸入新項目的名稱。
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">名稱</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="項目名稱..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <PopoverClose asChild>
              <Button type="button" variant="outline" size="sm">
                取消
              </Button>
            </PopoverClose>
            <Button type="submit" size="sm">
              新增
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
```

### 顏色選擇器彈出框

```tsx
function ColorPickerPopover() {
  const [color, setColor] = useState('#3b82f6');
  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[140px] justify-start">
          <div
            className="mr-2 h-4 w-4 rounded"
            style={{ backgroundColor: color }}
          />
          選擇顏色
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((c) => (
            <button
              key={c}
              className="h-8 w-8 rounded-md border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: c,
                borderColor: c === color ? 'white' : 'transparent',
              }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### 自訂錨點

```tsx
function AnchoredPopover() {
  return (
    <Popover>
      <PopoverAnchor asChild>
        <div className="w-full border-b p-4">
          彈出框將錨定到此區域
        </div>
      </PopoverAnchor>
      <PopoverTrigger asChild>
        <Button>顯示資訊</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>內容相對於錨點定位，而非觸發器</p>
      </PopoverContent>
    </Popover>
  );
}
```

### 定位範例

```tsx
<div className="flex gap-4">
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">下方（預設）</Button>
    </PopoverTrigger>
    <PopoverContent side="bottom">
      <p>在觸發器下方</p>
    </PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">上方</Button>
    </PopoverTrigger>
    <PopoverContent side="top">
      <p>在觸發器上方</p>
    </PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">右側</Button>
    </PopoverTrigger>
    <PopoverContent side="right">
      <p>在右側</p>
    </PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">左側</Button>
    </PopoverTrigger>
    <PopoverContent side="left">
      <p>在左側</p>
    </PopoverContent>
  </Popover>
</div>
```

### 受控彈出框

```tsx
function ControlledPopover() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleSave = () => {
    // 儲存邏輯
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>編輯數值</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="輸入數值..."
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              取消
            </Button>
            <Button size="sm" onClick={handleSave}>
              儲存
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### 個人資料卡片彈出框

```tsx
function UserPopover({ user }: { user: User }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-full"
          />
          <div className="space-y-1">
            <h4 className="font-semibold">{user.name}</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              加入於 {user.joinDate}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            檢視個人資料
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            傳送訊息
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

## 樣式

### 預設樣式

```tsx
// PopoverContent 預設樣式
"z-50 w-72 rounded-md border bg-popover p-4"
"text-popover-foreground shadow-md outline-none"
"data-[state=open]:animate-in data-[state=closed]:animate-out"
"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
```

### 自訂尺寸

```tsx
// 小型彈出框
<PopoverContent className="w-48 p-2">
  <p className="text-sm">小型內容</p>
</PopoverContent>

// 大型彈出框
<PopoverContent className="w-96 p-6">
  <div className="space-y-4">
    {/* 更多內容 */}
  </div>
</PopoverContent>

// 自動寬度
<PopoverContent className="w-auto">
  <div>內容決定寬度</div>
</PopoverContent>
```

### 自訂樣式

```tsx
// 主題彈出框
<PopoverContent className="bg-primary text-primary-foreground">
  <p>主題樣式的內容</p>
</PopoverContent>

// 簡約彈出框
<PopoverContent className="border-0 shadow-lg">
  <p>無邊框，強陰影</p>
</PopoverContent>
```

## 無障礙性

Popover 實作了全面的無障礙功能：

- **焦點管理**：開啟時焦點移至內容
- **焦點恢復**：關閉時焦點返回觸發器
- **Escape 鍵**：關閉彈出框
- **點擊外部**：關閉彈出框
- **ARIA**：正確的 `aria-haspopup`、`aria-expanded`、`aria-controls`

### 模態模式

```tsx
// 模態彈出框會阻止與頁面其餘部分的互動
<Popover modal>
  <PopoverTrigger asChild>
    <Button>開啟模態彈出框</Button>
  </PopoverTrigger>
  <PopoverContent>
    {/* 焦點被限制在內部 */}
  </PopoverContent>
</Popover>
```

## Popover vs Dialog vs Tooltip

| 功能 | Popover | Dialog | Tooltip |
|---------|---------|--------|---------|
| 互動方式 | 點擊開啟 | 點擊開啟 | 懸停顯示 |
| 焦點陷阱 | 可選（模態） | 是 | 否 |
| 阻斷式 | 否（預設） | 是 | 否 |
| 內容 | 互動式 | 互動式 | 資訊性 |
| 持續性 | 保持開啟 | 保持開啟 | 離開時消失 |
| 使用場景 | 表單、選項 | 確認 | 提示、標籤 |

## 最佳實踐

### 應該做

- ✅ 用於不需要完整模態的互動內容
- ✅ 保持內容專注和相關
- ✅ 提供清楚的關閉機制
- ✅ 對表單提交使用受控模式
- ✅ 考慮行動裝置的觸控目標
- ✅ 定位以避免遮蓋重要內容

### 不應該做

- ❌ 用於簡單文字提示（使用 Tooltip）
- ❌ 放置複雜的多步驟表單（使用 Dialog）
- ❌ 在彈出框中嵌套彈出框
- ❌ 使內容過大
- ❌ 忘記適當處理外部點擊
- ❌ 用於導覽選單（使用 DropdownMenu）

## 動畫

Popover 包含平滑的進入/退出動畫：

```css
/* 進入動畫 */
data-[state=open]:animate-in
data-[state=open]:fade-in-0
data-[state=open]:zoom-in-95

/* 退出動畫 */
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=closed]:zoom-out-95

/* 根據方向滑動 */
data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2
```

## 相關元件

- [Tooltip](./tooltip) - 用於非互動式提示
- [Dialog](./dialog) - 用於模態互動
- [DropdownMenu](./dropdown-menu) - 用於操作選單
