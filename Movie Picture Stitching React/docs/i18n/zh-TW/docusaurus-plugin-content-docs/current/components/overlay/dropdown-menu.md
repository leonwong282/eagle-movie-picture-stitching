---
sidebar_position: 2
title: DropdownMenu
description: 帶有子選單、核取方塊和單選群組的上下文選單元件
---

# DropdownMenu

一個功能豐富的下拉選單元件，建立在 [Radix UI DropdownMenu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) 之上，提供無障礙選單、鍵盤導覽、子選單、核取方塊項目和單選群組。

## 匯入

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@/components';
```

## 基本用法

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">開啟選單</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>我的帳戶</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>個人資料</DropdownMenuItem>
    <DropdownMenuItem>設定</DropdownMenuItem>
    <DropdownMenuItem>登出</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 元件

DropdownMenu 系統提供 15 個複合元件：

| 元件 | 描述 |
|-----------|-------------|
| `DropdownMenu` | 管理選單狀態的根元件 |
| `DropdownMenuTrigger` | 開啟選單的元素 |
| `DropdownMenuContent` | 選單項目的容器 |
| `DropdownMenuItem` | 可點擊的選單項目 |
| `DropdownMenuCheckboxItem` | 帶有核取方塊的選單項目 |
| `DropdownMenuRadioItem` | 單選群組中的選單項目 |
| `DropdownMenuLabel` | 非互動式標籤 |
| `DropdownMenuSeparator` | 視覺分隔線 |
| `DropdownMenuShortcut` | 鍵盤快捷鍵提示 |
| `DropdownMenuGroup` | 群組相關項目 |
| `DropdownMenuPortal` | 將內容傳送到 body |
| `DropdownMenuSub` | 子選單容器 |
| `DropdownMenuSubTrigger` | 觸發子選單 |
| `DropdownMenuSubContent` | 子選單內容 |
| `DropdownMenuRadioGroup` | 群組單選項目 |

## Props

### DropdownMenu

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `open` | `boolean` | - | 受控的開啟狀態 |
| `onOpenChange` | `(open: boolean) => void` | - | 開啟狀態變更時的回呼 |
| `defaultOpen` | `boolean` | `false` | 初始開啟狀態 |
| `modal` | `boolean` | `true` | 是否渲染為模態 |
| `dir` | `'ltr' \| 'rtl'` | - | 閱讀方向 |

### DropdownMenuContent

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `className` | `string` | - | 額外的 CSS class |
| `sideOffset` | `number` | `4` | 與觸發器的距離 |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | 相對於觸發器的對齊 |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 偏好的側邊 |
| `alignOffset` | `number` | `0` | 對齊的偏移量 |
| `avoidCollisions` | `boolean` | `true` | 翻轉以避開視窗邊緣 |

### DropdownMenuItem

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | 新增左側內距以對齊圖示 |
| `disabled` | `boolean` | `false` | 停用項目 |
| `onSelect` | `(event: Event) => void` | - | 選擇項目時呼叫 |

### DropdownMenuCheckboxItem

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | - | 勾選狀態 |
| `onCheckedChange` | `(checked: boolean) => void` | - | 勾選變更時的回呼 |
| `disabled` | `boolean` | `false` | 停用項目 |

### DropdownMenuRadioItem

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `value` | `string` | 必填 | 單選群組的值 |
| `disabled` | `boolean` | `false` | 停用項目 |

## 範例

### 搭配圖示和快捷鍵

```tsx
import { Settings, User, LogOut, Plus, Folder } from 'lucide-react';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <Settings className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>操作</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      個人資料
      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Folder className="mr-2 h-4 w-4" />
      新增資料夾
      <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">
      <LogOut className="mr-2 h-4 w-4" />
      登出
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 核取方塊項目

```tsx
function ViewOptions() {
  const [showGrid, setShowGrid] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">檢視選項</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>顯示</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showGrid}
          onCheckedChange={setShowGrid}
        >
          顯示網格
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPreview}
          onCheckedChange={setShowPreview}
        >
          顯示預覽
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 單選群組

```tsx
function SortOptions() {
  const [sortBy, setSortBy] = useState('date');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">排序方式</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>排序順序</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
          <DropdownMenuRadioItem value="date">
            修改日期
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">
            名稱
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size">
            檔案大小
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="type">
            檔案類型
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 子選單

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>操作</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuItem>新增檔案</DropdownMenuItem>
    <DropdownMenuItem>新增資料夾</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        匯出為
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem>PNG</DropdownMenuItem>
          <DropdownMenuItem>JPEG</DropdownMenuItem>
          <DropdownMenuItem>WebP</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>原始格式</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        移動到
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem>資料夾 A</DropdownMenuItem>
          <DropdownMenuItem>資料夾 B</DropdownMenuItem>
          <DropdownMenuItem>資料夾 C</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

### 群組項目

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>選單</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuGroup>
      <DropdownMenuLabel>檔案</DropdownMenuLabel>
      <DropdownMenuItem>新增</DropdownMenuItem>
      <DropdownMenuItem>開啟</DropdownMenuItem>
      <DropdownMenuItem>儲存</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>編輯</DropdownMenuLabel>
      <DropdownMenuItem>復原</DropdownMenuItem>
      <DropdownMenuItem>重做</DropdownMenuItem>
      <DropdownMenuItem>剪下</DropdownMenuItem>
      <DropdownMenuItem>複製</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

### 右鍵選單模式

```tsx
function ImageContextMenu({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          開啟
          <DropdownMenuShortcut>⏎</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          在新視窗中開啟
          <DropdownMenuShortcut>⇧⏎</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          複製
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          剪下
          <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>新增到收藏</DropdownMenuItem>
        <DropdownMenuItem>新增標籤...</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          刪除
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 停用項目

```tsx
<DropdownMenuContent>
  <DropdownMenuItem>啟用</DropdownMenuItem>
  <DropdownMenuItem disabled>
    停用的項目
  </DropdownMenuItem>
  <DropdownMenuCheckboxItem disabled checked>
    停用的核取方塊
  </DropdownMenuCheckboxItem>
</DropdownMenuContent>
```

## 樣式

### 預設樣式

```tsx
// DropdownMenuContent
"z-50 min-w-[8rem] overflow-hidden rounded-md border"
"bg-popover p-1 text-popover-foreground shadow-md"

// DropdownMenuItem
"relative flex cursor-default select-none items-center"
"gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
"focus:bg-accent focus:text-accent-foreground"
"data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
```

### 自訂寬度

```tsx
<DropdownMenuContent className="w-56">
  {/* 固定寬度內容 */}
</DropdownMenuContent>

<DropdownMenuContent className="w-[300px]">
  {/* 自訂寬度 */}
</DropdownMenuContent>
```

### 內縮項目

使用 `inset` prop 將沒有圖示的項目與有圖示的項目對齊：

```tsx
<DropdownMenuContent>
  <DropdownMenuItem>
    <Settings className="mr-2 h-4 w-4" />
    帶圖示
  </DropdownMenuItem>
  <DropdownMenuItem inset>
    不帶圖示（已對齊）
  </DropdownMenuItem>
</DropdownMenuContent>
```

## 無障礙

DropdownMenu 實作了完整的鍵盤導覽：

- **Enter / Space**：開啟選單或選擇項目
- **Arrow Down**：移動到下一個項目
- **Arrow Up**：移動到上一個項目
- **Arrow Right**：開啟子選單
- **Arrow Left**：關閉子選單
- **Escape**：關閉選單
- **Home**：移動到第一個項目
- **End**：移動到最後一個項目
- **輸入字元**：跳到以輸入字元開頭的項目

### ARIA 屬性

- 內容上有 `role="menu"`
- 項目上有 `role="menuitem"`
- 核取方塊項目上有 `role="menuitemcheckbox"`
- 單選項目上有 `role="menuitemradio"`
- 核取方塊/單選項目有 `aria-checked` 狀態
- 停用項目有 `aria-disabled`

## 最佳實踐

### 應該

- ✅ 對觸發器使用 `asChild` 與按鈕組合
- ✅ 使用 `DropdownMenuGroup` 群組相關項目
- ✅ 使用 `DropdownMenuShortcut` 顯示鍵盤快捷鍵
- ✅ 使用分隔線劃分邏輯區塊
- ✅ 保持選單項目簡潔易掃視
- ✅ 一致地使用圖示（所有項目有或都沒有）

### 不應該

- ❌ 嵌套超過 2 層的子選單
- ❌ 放入太多項目而不分組
- ❌ 用於導覽（使用適當的導覽元件）
- ❌ 忘記處理 `onSelect` 回呼
- ❌ 混合不同項目類型而不使用分隔線

## 動畫

選單項目包含細微動畫：

```css
/* 內容動畫 */
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95
data-[state=open]:zoom-in-95

/* 基於側邊的滑動 */
data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2
```

## 相關元件

- [Dialog](./dialog) - 用於需要使用者回應的模態互動
- [Popover](./popover) - 用於非選單的覆蓋層內容
- [Select](../form/select) - 用於表單選擇輸入
- [Button](../ui/button) - 常用作選單觸發器
