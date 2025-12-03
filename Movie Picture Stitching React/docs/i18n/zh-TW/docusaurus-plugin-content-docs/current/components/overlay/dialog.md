---
sidebar_position: 1
title: Dialog
description: 帶有焦點陷阱和無障礙覆蓋層的模態對話框元件
---

# Dialog

一個建立在 [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) 之上的模態對話框元件，提供無障礙覆蓋層、焦點管理、鍵盤導覽和可自訂動畫。

## 匯入

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components';
```

## 基本用法

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>開啟對話框</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>編輯個人資料</DialogTitle>
      <DialogDescription>
        在這裡修改您的個人資料。完成後點擊儲存。
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <Input placeholder="輸入您的姓名" />
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">取消</Button>
      </DialogClose>
      <Button>儲存變更</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 元件

Dialog 系統使用複合元件以提供最大靈活性：

| 元件 | 描述 |
|-----------|-------------|
| `Dialog` | 管理開啟狀態的根元件 |
| `DialogTrigger` | 開啟對話框的按鈕 |
| `DialogPortal` | 將內容傳送到 document body |
| `DialogOverlay` | 半透明背景 |
| `DialogContent` | 帶有焦點陷阱的主要內容容器 |
| `DialogHeader` | 標題和描述的容器 |
| `DialogFooter` | 操作按鈕的容器 |
| `DialogTitle` | 無障礙對話框標題 |
| `DialogDescription` | 無障礙對話框描述 |
| `DialogClose` | 關閉對話框的按鈕 |

## Props

### Dialog

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `open` | `boolean` | - | 受控的開啟狀態 |
| `onOpenChange` | `(open: boolean) => void` | - | 開啟狀態變更時的回呼 |
| `defaultOpen` | `boolean` | `false` | 初始開啟狀態（非受控） |
| `modal` | `boolean` | `true` | 是否渲染為模態 |

### DialogContent

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `className` | `string` | - | 額外的 CSS class |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | 按下 Escape 時呼叫 |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` | - | 點擊外部時呼叫 |
| `onInteractOutside` | `(event: Event) => void` | - | 任何外部互動時呼叫 |

### DialogTrigger / DialogClose

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | 將 props 合併到子元素 |

## 範例

### 受控對話框

```tsx
function ControlledDialog() {
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    await saveData();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>開啟設定</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>設定</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* 設定表單 */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>儲存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 確認對話框

```tsx
function DeleteConfirmation({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">刪除項目</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>您確定嗎？</DialogTitle>
          <DialogDescription>
            此操作無法復原。這將永久從您的資料庫中刪除該項目。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              刪除
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 表單對話框

```tsx
function CreateFolderDialog() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 建立資料夾邏輯
    setOpen(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>新增資料夾</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>建立新資料夾</DialogTitle>
            <DialogDescription>
              輸入您新資料夾的名稱。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name">資料夾名稱</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="我的資料夾"
              autoFocus
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                取消
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!name.trim()}>
              建立
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 防止點擊外部關閉

```tsx
<DialogContent
  onPointerDownOutside={(e) => e.preventDefault()}
  onEscapeKeyDown={(e) => e.preventDefault()}
>
  {/* 需要明確關閉操作的內容 */}
</DialogContent>
```

### 自訂覆蓋層

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>開啟</Button>
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay className="bg-black/80" />
    <DialogContent>
      {/* 內容 */}
    </DialogContent>
  </DialogPortal>
</Dialog>
```

## 樣式

對話框使用語意化顏色標記進行主題設定：

```tsx
// DialogOverlay 預設樣式
"fixed inset-0 z-50 bg-black/80"
"data-[state=open]:animate-in data-[state=closed]:animate-out"
"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"

// DialogContent 預設樣式
"fixed left-[50%] top-[50%] z-50"
"translate-x-[-50%] translate-y-[-50%]"
"bg-background border rounded-lg shadow-lg"
"duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out"
```

### 尺寸變體

```tsx
// 小型對話框
<DialogContent className="sm:max-w-[425px]">

// 中型對話框（預設）
<DialogContent className="sm:max-w-lg">

// 大型對話框
<DialogContent className="sm:max-w-2xl">

// 全寬
<DialogContent className="sm:max-w-[90vw]">
```

## 無障礙

Dialog 元件實作了完整的無障礙功能：

- **焦點管理**：開啟時焦點被限制在對話框內
- **焦點恢復**：關閉時焦點返回觸發元素
- **Escape 鍵**：關閉對話框（可以防止）
- **點擊外部**：關閉對話框（可以防止）
- **ARIA 屬性**：正確的 `role="dialog"`、`aria-modal`、`aria-labelledby`、`aria-describedby`
- **螢幕閱讀器**：DialogTitle 和 DialogDescription 會被播報

### 必要元素

為了正確的無障礙，始終包含：

```tsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      {/* 必要：提供 aria-labelledby */}
      <DialogTitle>標題</DialogTitle>
      
      {/* 建議：提供 aria-describedby */}
      <DialogDescription>描述</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 視覺上隱藏標題

如果您需要視覺上隱藏標題但保持無障礙：

```tsx
<DialogTitle className="sr-only">隱藏的標題</DialogTitle>
```

## 最佳實踐

### 應該

- ✅ 始終提供 `DialogTitle` 以實現無障礙
- ✅ 使用 `DialogDescription` 解釋對話框的目的
- ✅ 將主要操作放在 `DialogFooter` 的右側
- ✅ 對取消按鈕使用 `DialogClose` 搭配 `asChild`
- ✅ 保持對話框內容聚焦和簡潔
- ✅ 在需要防止關閉時使用受控模式

### 不應該

- ❌ 在對話框內嵌套對話框
- ❌ 用於簡單確認（考慮內嵌確認）
- ❌ 放入需要捲動的過多內容
- ❌ 忘記正確處理表單提交
- ❌ 在不提供替代退出方式的情況下防止關閉

## 動畫

對話框包含使用 Tailwind animate 工具的內建動畫：

```css
/* 進入動畫 */
data-[state=open]:animate-in
data-[state=open]:fade-in-0
data-[state=open]:zoom-in-95

/* 退出動畫 */
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=closed]:zoom-out-95
```

## 相關元件

- [Button](../ui/button) - 常用於觸發器和操作
- [DropdownMenu](./dropdown-menu) - 用於上下文選單而非對話框
- [Toast](../ui/toast) - 用於非阻塞通知
