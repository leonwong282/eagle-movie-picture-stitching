# 遷移指南

本指南涵蓋 Eagle React Template 版本間的升級以及從其他設定遷移的方法。

## 版本升級

### 從 v1.x 升級到 v2.x

#### 重大變更

1. **Store 結構變更**

```typescript
// v1.x - 扁平 store
const useStore = create((set) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
}));

// v2.x - 基於切片的 store
import { usePluginStore, useSelection } from '@/stores';

// 使用便利 hooks
const { items, isLoading } = useSelection();

// 或直接存取
const items = usePluginStore((state) => state.selection.items);
```

2. **Hook API 變更**

```typescript
// v1.x
const { selected, refresh } = useEagleSelection();

// v2.x - 增強選項
const { 
  items,           // 從 'selected' 重新命名
  isLoading, 
  isPaused,        // 新增：可見性感知
  refresh,
  startPolling,    // 新增：手動控制
  stopPolling,     // 新增：手動控制
} = useEagleSelection({
  pollingInterval: 500,
  autoStart: true,
  pauseOnHidden: true, // 新選項
});
```

3. **元件匯入路徑**

```typescript
// v1.x
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// v2.x - 桶狀匯出
import { Button, Card, Toast } from '@/components';
```

#### 遷移步驟

1. **更新依賴：**
```bash
npm install
```

2. **更新 store 使用：**
```typescript
// 將扁平 store 存取替換為切片存取
// 之前
const items = useStore(state => state.items);

// 之後
import { useSelection } from '@/stores';
const { items } = useSelection();
```

3. **更新 hook 使用：**
```typescript
// 將 'selected' 重新命名為 'items'
const { items } = useEagleSelection();
```

4. **更新匯入：**
```typescript
// 使用桶狀匯出
import { Button, Card, Input } from '@/components';
```

### 從 v1.4 升級到 v1.5

#### 變更

1. **Toast API 更新**

```typescript
// v1.4
toast('Message');
toast.success('Success');

// v1.5 - 基於 Context
import { useToast, toast } from '@/components';

const { addToast } = useToast();
addToast(toast.success('Success'));
```

2. **主題 Hook 增強**

```typescript
// v1.4
const { theme, setTheme } = useTheme();

// v1.5 - 額外工具
const { 
  theme, 
  isDarkMode,     // 新增：計算布林值
  setTheme, 
  toggleTheme     // 新增：便利方法
} = useTheme();
```

## 從 Create React App 遷移

### 專案結構

```bash
# CRA 結構
src/
├── App.js
├── index.js
├── components/
└── ...

# Eagle Template 結構
src/
├── App.tsx
├── main.tsx
├── components/
├── hooks/
├── lib/
│   └── eagle-api.ts  # 新增：Eagle 整合
├── stores/
└── templates/
```

### 設定變更

1. **將 react-scripts 替換為 Vite：**

```json title="package.json"
{
  "scripts": {
    // CRA
    "start": "react-scripts start",
    "build": "react-scripts build",
    
    // Vite (Eagle Template)
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

2. **更新進入點：**

```typescript title="src/main.tsx"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

3. **新增 Eagle API 整合：**

```typescript title="src/lib/eagle-api.ts"
// 從模板複製或初始化
import { EagleAPIAdapter } from './eagle-api';
export const eagleApi = new EagleAPIAdapter();
```

### 環境變數

```bash
# CRA
REACT_APP_API_URL=https://api.example.com

# Vite
VITE_API_URL=https://api.example.com
```

```typescript
// CRA
process.env.REACT_APP_API_URL

// Vite
import.meta.env.VITE_API_URL
```

## 從 Next.js 遷移

### 主要差異

| 功能 | Next.js | Eagle Template |
|------|---------|----------------|
| 路由 | 檔案式 | 不需要路由器 |
| SSR | 內建 | 僅客戶端 |
| API 路由 | 內建 | 使用 Eagle API |
| 建置 | next build | vite build |

### 遷移步驟

1. **移除 Next.js 特定程式碼：**
   - 移除 `pages/` 或 `app/` 目錄
   - 移除 `getServerSideProps`、`getStaticProps`
   - 移除 API 路由

2. **轉換為單頁應用程式：**
```typescript title="src/App.tsx"
function App() {
  // 所有路由邏輯在一個元件中
  // 使用分頁或條件渲染
  return (
    <Tabs>
      <TabsContent value="home"><HomePage /></TabsContent>
      <TabsContent value="settings"><SettingsPage /></TabsContent>
    </Tabs>
  );
}
```

3. **更新匯入：**
```typescript
// Next.js
import Image from 'next/image';
import Link from 'next/link';

// Eagle Template
import { EagleImage } from '@/components';
// 沒有路由 - 使用狀態管理
```

## 從 Vue 遷移到 React

### 元件語法

```vue
<!-- Vue SFC -->
<template>
  <button @click="handleClick">{{ label }}</button>
</template>

<script setup>
const props = defineProps(['label']);
const emit = defineEmits(['click']);
const handleClick = () => emit('click');
</script>
```

```tsx
// React 等價
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### 狀態管理

```typescript
// Vue Composition API
const count = ref(0);
const doubled = computed(() => count.value * 2);
watch(count, (newVal) => console.log(newVal));

// React Hooks
const [count, setCount] = useState(0);
const doubled = useMemo(() => count * 2, [count]);
useEffect(() => console.log(count), [count]);
```

### 生命週期

```typescript
// Vue
onMounted(() => { /* ... */ });
onUnmounted(() => { /* ... */ });

// React
useEffect(() => {
  // onMounted
  return () => {
    // onUnmounted
  };
}, []);
```

## 將 Eagle 支援新增到現有 React 應用程式

### 最小整合

1. **新增 manifest.json：**
```json title="manifest.json"
{
  "id": "your-uuid-here",
  "name": "Your Plugin",
  "main": {
    "url": "dist/index.html"
  }
}
```

2. **新增 Eagle API 適配器：**
```bash
# 從模板複製
cp eagle-react-template/src/lib/eagle-api.ts your-project/src/lib/
cp eagle-react-template/src/types/eagle.d.ts your-project/src/types/
```

3. **更新 Vite 設定：**
```typescript title="vite.config.ts"
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
```

4. **新增部署腳本：**
```bash
cp eagle-react-template/scripts/deploy.js your-project/scripts/
```

### 完整整合

要獲得完整的功能對等：

1. 複製 hooks：`useEagleSelection`、`useTheme`、`useLocalStorage`
2. 複製 stores：Zustand 設定與切片
3. 依需要複製元件：UI 程式庫
4. 複製模板：版面配置模板
5. 新增 i18n 支援

## 更新依賴

### 安全更新流程

```bash
# 檢查過時的套件
npm outdated

# 更新修補版本（安全）
npm update

# 更新到最新（可能有重大變更）
npm install package@latest

# 全部更新到最新
npx npm-check-updates -u
npm install
```

### 主要依賴

| 套件 | 更新注意事項 |
|------|--------------|
| `react` | 主要版本可能有重大變更 |
| `vite` | 通常可以安全更新 |
| `tailwindcss` | 檢查主要版本間的設定變更 |
| `@radix-ui/*` | 檢查元件 API 變更 |
| `zustand` | API 穩定 |

### 更新後測試

```bash
# 執行完整測試套件
npm test

# 檢查類型錯誤
npm run typecheck

# 建置並測試
npm run build
npm run preview
```

## 遷移疑難排解

### 常見問題

**1. 遷移後的匯入錯誤：**
```typescript
// 檢查 tsconfig.json 中的路徑別名
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**2. 樣式不起作用：**
```typescript
// 確保在 main.tsx 中匯入 globals.css
import './styles/globals.css';
```

**3. Eagle API 不可用：**
```typescript
// 檢查環境偵測
if (isEagleEnvironment()) {
  // Eagle 程式碼
} else {
  // 瀏覽器回退
}
```

**4. 建置失敗：**
```bash
# 清除快取並重新建置
rm -rf dist node_modules/.vite
npm run build
```

## 相關資源

- [快速入門](../getting-started/quick-start.md) - 全新開始指南
- [專案結構](../getting-started/project-structure.md) - 檔案組織
- [已知限制](./known-limitations.md) - 當前約束
