# 貢獻指南

感謝您有興趣貢獻 Eagle React Template！本指南將幫助您入門。

## 行為準則

貢獻前請閱讀我們的[行為準則](../community/code-of-conduct)。

## 開發環境設定

### 先決條件

- Node.js 18+
- npm 或 pnpm
- Eagle 桌面應用程式（用於測試部署）
- Git

### 開始入門

```bash
# 複製儲存庫
git clone https://github.com/your-org/eagle-react-template.git
cd eagle-react-template

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 開發命令

```bash
# 開發
npm run dev          # 啟動帶 HMR 的開發伺服器
npm run build        # 建置生產版本
npm run preview      # 預覽生產建置

# 測試
npm test             # 執行單元測試
npm run test:watch   # 以監視模式執行測試
npm run test:coverage # 產生覆蓋率報告
npm run test:e2e     # 執行 E2E 測試
npm run test:visual  # 執行視覺回歸測試

# 程式碼品質
npm run typecheck    # TypeScript 類型檢查
npm run lint         # ESLint
npm run lint:fix     # 修復 lint 錯誤

# 部署
npm run deploy       # 部署到 Eagle 外掛程式目錄
```

## 專案結構

```
src/
├── components/      # React 元件
│   └── ui/          # UI 元件庫
├── hooks/           # 自訂 React hooks
├── lib/             # 工具函式與 Eagle API
├── stores/          # Zustand 狀態管理
├── templates/       # 版面配置模板
├── demos/           # 示範元件
├── pages/           # 頁面元件
├── styles/          # 全域樣式與令牌
├── test/            # 測試工具與模擬
└── types/           # TypeScript 類型定義
```

## 編碼標準

### TypeScript

- 啟用嚴格模式
- 優先使用明確類型而非 `any`
- 使用介面定義物件形狀
- 使用 JSDoc 記錄複雜類型

```typescript
// ✅ 良好
interface ButtonProps {
  /** 按鈕視覺樣式 */
  variant?: 'default' | 'primary' | 'destructive';
  /** 點擊處理器 */
  onClick?: () => void;
}

// ❌ 避免
const handleClick = (data: any) => { ... }
```

### React 元件

- 使用帶 hooks 的函式元件
- 使用 CVA 處理元件變體
- 從桶狀檔案匯出

```typescript
// ✅ 良好：CVA 變體模式
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-classes',
      primary: 'primary-classes',
    },
  },
});

// ✅ 良好：正確的類型定義
interface ComponentProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}
```

### CSS/Tailwind

- 使用 Tailwind 工具類別
- 在 CSS 變數中定義設計令牌
- 使用 `dark:` 前綴支援深色模式

```tsx
// ✅ 良好
<button className="bg-primary text-white hover:bg-primary/90 dark:bg-primary-dark">

// ❌ 避免內聯樣式
<button style={{ backgroundColor: '#238636' }}>
```

### 測試

- 將測試與原始檔案放在一起
- 測試行為而非實作
- 使用描述性的測試名稱

```typescript
// ✅ 良好
describe('Button', () => {
  it('calls onClick when clicked', () => { ... });
  it('disables interaction when disabled prop is true', () => { ... });
});

// ❌ 不好
it('works', () => { ... });
it('test1', () => { ... });
```

## 提交準則

我們使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <description>

[選用內文]

[選用頁尾]
```

### 類型

| 類型 | 描述 |
|------|------|
| `feat` | 新功能 |
| `fix` | 錯誤修復 |
| `docs` | 文件變更 |
| `style` | 程式碼風格（格式化，無邏輯變更） |
| `refactor` | 程式碼重構 |
| `perf` | 效能改進 |
| `test` | 新增或更新測試 |
| `chore` | 維護任務 |

### 範例

```bash
feat(components): add Slider component
fix(hooks): resolve useEagleSelection memory leak
docs(api): update item operations documentation
test(Button): add accessibility tests
```

## 分支命名

- `feature/description` - 新功能
- `fix/description` - 錯誤修復
- `docs/description` - 文件更新
- `refactor/description` - 程式碼重構

## Pull Request 流程

### 提交前

- [ ] 所有測試通過（`npm test`）
- [ ] 沒有 TypeScript 錯誤（`npm run typecheck`）
- [ ] 沒有 lint 錯誤（`npm run lint`）
- [ ] 建置成功（`npm run build`）
- [ ] 如需要則更新文件
- [ ] 重大變更已更新變更日誌

### PR 模板

```markdown
## 描述
變更的簡短描述

## 變更類型
- [ ] 錯誤修復
- [ ] 新功能
- [ ] 重大變更
- [ ] 文件更新

## 測試
- [ ] 新增/更新單元測試
- [ ] 新增/更新 E2E 測試
- [ ] 完成手動測試

## 截圖（如適用）
```

### 審查清單

審查者將檢查：
- 程式碼品質與風格
- 測試覆蓋率
- 文件
- 效能影響
- 重大變更

## 新增元件

### 元件清單

新增 UI 元件時：

1. **建立元件檔案：** `src/components/ui/NewComponent.tsx`
2. **新增類型：** 定義 props 介面
3. **使用 CVA：** 支援變體
4. **新增測試：** `src/components/ui/NewComponent.test.tsx`
5. **匯出：** 新增到 `src/components/ui/index.ts`
6. **文件：** 新增到文件

### 範例元件

```typescript title="src/components/ui/Badge.tsx"
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
```

## 新增 Hooks

### Hook 清單

1. **建立 hook 檔案：** `src/hooks/useNewHook.ts`
2. **新增測試：** `src/hooks/useNewHook.test.ts`
3. **匯出：** 新增到 `src/hooks/index.ts`
4. **文件：** 使用方式與參數

### 範例 Hook

```typescript title="src/hooks/useDebounce.ts"
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## 回報問題

### 錯誤報告

包含：
- 清楚的描述
- 重現步驟
- 預期與實際行為
- 環境（作業系統、Node 版本、Eagle 版本）
- 如適用則附截圖/日誌

### 功能請求

包含：
- 問題陳述
- 提議的解決方案
- 使用案例
- 考慮過的替代方案

## 取得協助

- 閱讀[文件](../getting-started/introduction.md)
- 檢查現有的 [issues](https://github.com/your-org/eagle-react-template/issues)
- 在 [discussions](https://github.com/your-org/eagle-react-template/discussions) 中提問

---

**感謝您的貢獻！🎉**
