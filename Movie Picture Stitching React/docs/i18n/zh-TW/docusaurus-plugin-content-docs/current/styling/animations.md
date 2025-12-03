---
sidebar_position: 4
title: 動畫
description: 動態效果和過渡模式
---

# 動畫

此模板包含使用 Tailwind CSS 和 `tailwindcss-animate` 外掛預先設定的動畫。

## 動畫類別

### 內建動畫

| 類別 | 效果 | 持續時間 |
|------|------|----------|
| `animate-fade-in` | 從 0 到 1 不透明度淡入 | 200ms |
| `animate-fade-out` | 從 1 到 0 不透明度淡出 | 200ms |
| `animate-slide-up` | 帶淡入的上滑 | 300ms |
| `animate-slide-down` | 帶淡入的下滑 | 300ms |
| `animate-scale-in` | 從 95% 縮放帶淡入 | 200ms |
| `animate-spin` | 持續旋轉 | 1s |
| `animate-pulse` | 柔和脈動效果 | 2s |
| `animate-bounce` | 彈跳效果 | 1s |

### 使用方式

```tsx
// 掛載時淡入
<div className="animate-fade-in">
  內容淡入
</div>

// 上滑對話框
<div className="animate-slide-up">
  對話框內容
</div>

// 載入旋轉器
<div className="animate-spin">
  <Spinner />
</div>
```

## 關鍵影格定義

```css
/* src/styles/globals.css */

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

## Tailwind 設定

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

## 過渡效果

### 過渡工具類別

```tsx
// 顏色過渡（用於懸停狀態）
<button className="transition-colors duration-200 hover:bg-primary">

// 所有屬性
<div className="transition-all duration-300">

// 僅變換
<div className="transition-transform duration-200 hover:scale-105">

// 不透明度
<div className="transition-opacity duration-150">

// 多屬性帶延遲
<div className="transition-all duration-300 delay-100">
```

### 持續時間比例

| 類別 | 持續時間 |
|------|----------|
| `duration-75` | 75ms |
| `duration-100` | 100ms |
| `duration-150` | 150ms |
| `duration-200` | 200ms |
| `duration-300` | 300ms |
| `duration-500` | 500ms |
| `duration-700` | 700ms |
| `duration-1000` | 1000ms |

### 緩動函式

| 類別 | 曲線 |
|------|------|
| `ease-linear` | 線性 |
| `ease-in` | 慢啟動 |
| `ease-out` | 慢結束 |
| `ease-in-out` | 慢啟動和結束 |

## 元件動畫模式

### 動畫卡片

```tsx
function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(
      'bg-card rounded-lg p-4 shadow',
      'transition-all duration-200',
      'hover:shadow-lg hover:-translate-y-1'
    )}>
      {children}
    </div>
  );
}
```

### 列表項目淡入

```tsx
function AnimatedList({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

### 對話框動畫

```tsx
function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* 內容 */}
      <div className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'bg-background rounded-lg p-6 shadow-lg',
        'animate-scale-in'
      )}>
        {children}
      </div>
    </div>
  );
}
```

### 骨架載入

```tsx
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-muted rounded animate-pulse',
        className
      )}
    />
  );
}

// 使用方式
<Skeleton className="h-4 w-32" />
<Skeleton className="h-24 w-full" />
```

### 閃爍效果

```tsx
function ShimmerSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded bg-muted',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-r from-transparent via-white/20 to-transparent',
          'animate-shimmer'
        )}
        style={{
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}
```

## 載入狀態

### 旋轉器

```tsx
function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size]
      )}
    />
  );
}
```

### 載入按鈕

```tsx
function LoadingButton({ 
  isLoading, 
  children, 
  ...props 
}: ButtonProps & { isLoading?: boolean }) {
  return (
    <Button {...props} disabled={isLoading}>
      {isLoading && (
        <Spinner size="sm" className="mr-2" />
      )}
      <span className={isLoading ? 'opacity-70' : ''}>
        {children}
      </span>
    </Button>
  );
}
```

## 進入/退出動畫

使用自訂 hook 處理掛載/卸載動畫：

```tsx
function useAnimatedMount(isVisible: boolean, duration = 200) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // 小延遲以允許 DOM 更新後再執行動畫
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);
  
  return { shouldRender, isAnimating };
}

// 使用方式
function AnimatedPanel({ open }: { open: boolean }) {
  const { shouldRender, isAnimating } = useAnimatedMount(open);
  
  if (!shouldRender) return null;
  
  return (
    <div className={cn(
      'transition-all duration-200',
      isAnimating 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-2'
    )}>
      面板內容
    </div>
  );
}
```

## 減少動態效果

尊重使用者的動態偏好：

```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// 在 JavaScript 中檢查
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Tailwind 類別
<div className="motion-safe:animate-bounce motion-reduce:animate-none">
```

## 使用 CVA 的動畫變體

```tsx
import { cva } from 'class-variance-authority';

const animatedBox = cva('rounded-lg p-4', {
  variants: {
    animate: {
      fade: 'animate-fade-in',
      slide: 'animate-slide-up',
      scale: 'animate-scale-in',
      none: '',
    },
  },
  defaultVariants: {
    animate: 'fade',
  },
});

function AnimatedBox({ animate, children }) {
  return (
    <div className={animatedBox({ animate })}>
      {children}
    </div>
  );
}
```

## 最佳實踐

### ✅ 建議

```tsx
// 使用一致的持續時間
className="transition-all duration-200"  // 快速互動
className="transition-all duration-300"  // 標準動畫

// 優先使用 transform/opacity（GPU 加速）
className="hover:scale-105 hover:opacity-90"

// 為複雜動畫新增 will-change
className="will-change-transform"

// 尊重減少動態效果
className="motion-safe:animate-slide-up"
```

### ❌ 避免

```tsx
// 避免動畫昂貴的屬性
className="transition-all"  // 只變更不透明度時不要使用

// 避免過長的動畫
className="duration-[2000ms]"  // 對 UI 來說太慢

// 不要頻繁動畫佈局屬性
className="transition-[width,height]"  // 會導致佈局抖動

// 不要忘記在減少動態效果時停用
className="animate-bounce"  // 新增 motion-reduce:animate-none
```

## 相關資源

- [樣式概覽](./overview) - 架構概覽
- [設計標記](./design-tokens) - 顏色和間距
- [深色模式](./dark-mode) - 主題切換
