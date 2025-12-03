# Migration Guide

This guide covers upgrading between versions of the Eagle React Template and migrating from other setups.

## Version Upgrades

### Upgrading to v2.x from v1.x

#### Breaking Changes

1. **Store Structure Changed**

```typescript
// v1.x - Flat store
const useStore = create((set) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
}));

// v2.x - Slice-based store
import { usePluginStore, useSelection } from '@/stores';

// Use convenience hooks
const { items, isLoading } = useSelection();

// Or direct access
const items = usePluginStore((state) => state.selection.items);
```

2. **Hook API Changes**

```typescript
// v1.x
const { selected, refresh } = useEagleSelection();

// v2.x - Enhanced options
const { 
  items,           // Renamed from 'selected'
  isLoading, 
  isPaused,        // New: visibility-aware
  refresh,
  startPolling,    // New: manual control
  stopPolling,     // New: manual control
} = useEagleSelection({
  pollingInterval: 500,
  autoStart: true,
  pauseOnHidden: true, // New option
});
```

3. **Component Import Paths**

```typescript
// v1.x
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// v2.x - Barrel exports
import { Button, Card, Toast } from '@/components';
```

#### Migration Steps

1. **Update dependencies:**
```bash
npm install
```

2. **Update store usage:**
```typescript
// Replace flat store access with slice access
// Before
const items = useStore(state => state.items);

// After
import { useSelection } from '@/stores';
const { items } = useSelection();
```

3. **Update hook usage:**
```typescript
// Rename 'selected' to 'items'
const { items } = useEagleSelection();
```

4. **Update imports:**
```typescript
// Use barrel exports
import { Button, Card, Input } from '@/components';
```

### Upgrading to v1.5 from v1.4

#### Changes

1. **Toast API Updated**

```typescript
// v1.4
toast('Message');
toast.success('Success');

// v1.5 - Context-based
import { useToast, toast } from '@/components';

const { addToast } = useToast();
addToast(toast.success('Success'));
```

2. **Theme Hook Enhanced**

```typescript
// v1.4
const { theme, setTheme } = useTheme();

// v1.5 - Additional utilities
const { 
  theme, 
  isDarkMode,     // New: computed boolean
  setTheme, 
  toggleTheme     // New: convenience method
} = useTheme();
```

## Migrating from Create React App

### Project Structure

```bash
# CRA structure
src/
├── App.js
├── index.js
├── components/
└── ...

# Eagle Template structure
src/
├── App.tsx
├── main.tsx
├── components/
├── hooks/
├── lib/
│   └── eagle-api.ts  # NEW: Eagle integration
├── stores/
└── templates/
```

### Configuration Changes

1. **Replace react-scripts with Vite:**

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

2. **Update entry point:**

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

3. **Add Eagle API integration:**

```typescript title="src/lib/eagle-api.ts"
// Copy from template or initialize
import { EagleAPIAdapter } from './eagle-api';
export const eagleApi = new EagleAPIAdapter();
```

### Environment Variables

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

## Migrating from Next.js

### Key Differences

| Feature | Next.js | Eagle Template |
|---------|---------|----------------|
| Routing | File-based | No router needed |
| SSR | Built-in | Client-only |
| API Routes | Built-in | Use Eagle API |
| Build | next build | vite build |

### Migration Steps

1. **Remove Next.js specific code:**
   - Remove `pages/` or `app/` directory
   - Remove `getServerSideProps`, `getStaticProps`
   - Remove API routes

2. **Convert to single-page app:**
```typescript title="src/App.tsx"
function App() {
  // All routing logic in one component
  // Use tabs or conditional rendering
  return (
    <Tabs>
      <TabsContent value="home"><HomePage /></TabsContent>
      <TabsContent value="settings"><SettingsPage /></TabsContent>
    </Tabs>
  );
}
```

3. **Update imports:**
```typescript
// Next.js
import Image from 'next/image';
import Link from 'next/link';

// Eagle Template
import { EagleImage } from '@/components';
// No routing - use state management
```

## Migrating from Vue to React

### Component Syntax

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
// React equivalent
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### State Management

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

### Lifecycle

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

## Adding Eagle Support to Existing React App

### Minimal Integration

1. **Add manifest.json:**
```json title="manifest.json"
{
  "id": "your-uuid-here",
  "name": "Your Plugin",
  "main": {
    "url": "dist/index.html"
  }
}
```

2. **Add Eagle API adapter:**
```bash
# Copy from template
cp eagle-react-template/src/lib/eagle-api.ts your-project/src/lib/
cp eagle-react-template/src/types/eagle.d.ts your-project/src/types/
```

3. **Update Vite config:**
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

4. **Add deployment script:**
```bash
cp eagle-react-template/scripts/deploy.js your-project/scripts/
```

### Full Integration

For complete feature parity:

1. Copy hooks: `useEagleSelection`, `useTheme`, `useLocalStorage`
2. Copy stores: Zustand setup with slices
3. Copy components: UI library as needed
4. Copy templates: Layout templates
5. Add i18n support

## Updating Dependencies

### Safe Update Process

```bash
# Check for outdated packages
npm outdated

# Update patch versions (safe)
npm update

# Update to latest (may have breaking changes)
npm install package@latest

# Update all to latest
npx npm-check-updates -u
npm install
```

### Key Dependencies

| Package | Update Notes |
|---------|--------------|
| `react` | Major versions may have breaking changes |
| `vite` | Usually safe to update |
| `tailwindcss` | Check config changes between majors |
| `@radix-ui/*` | Check component API changes |
| `zustand` | API is stable |

### Testing After Update

```bash
# Run full test suite
npm test

# Check for type errors
npm run typecheck

# Build and test
npm run build
npm run preview
```

## Troubleshooting Migration

### Common Issues

**1. Import errors after migration:**
```typescript
// Check path aliases in tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**2. Styles not working:**
```typescript
// Ensure globals.css is imported in main.tsx
import './styles/globals.css';
```

**3. Eagle API not available:**
```typescript
// Check environment detection
if (isEagleEnvironment()) {
  // Eagle code
} else {
  // Browser fallback
}
```

**4. Build fails:**
```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm run build
```

## Related

- [Quick Start](../getting-started/quick-start.md) - Fresh start guide
- [Project Structure](../getting-started/project-structure.md) - File organization
- [Known Limitations](./known-limitations.md) - Current constraints
