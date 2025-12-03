---
sidebar_position: 5
title: Build Configuration
description: Vite and build system configuration
---

# Build Configuration

The template uses Vite for development and production builds, configured for Eagle plugin requirements.

## Vite Configuration

### Core Settings

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // CRITICAL: Must be relative for Eagle
  base: './',
  
  plugins: [react()],
  
  build: {
    outDir: 'dist',
    sourcemap: false,  // Disable for production
    minify: true,
    rollupOptions: {
      output: {
        // Single bundle (Eagle requirement)
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  
  server: {
    port: 5173,
    open: true,
  },
});
```

### Critical Settings Explained

#### `base: './'`

**MUST be relative** for Eagle to load assets correctly:

```typescript
// ✅ Correct - relative paths
base: './'
// Results in: <script src="./assets/index-abc123.js">

// ❌ Wrong - absolute paths break in Eagle
base: '/'
// Results in: <script src="/assets/index-abc123.js">
```

#### `manualChunks: undefined`

Eagle loads plugins as a single entry point. Code splitting can cause issues:

```typescript
rollupOptions: {
  output: {
    // Disable code splitting
    manualChunks: undefined,
  },
}
```

## Path Aliases

Configure import aliases for cleaner imports:

| Alias | Path | Usage |
|-------|------|-------|
| `@` | `src/` | `import { App } from '@/App'` |
| `@components` | `src/components/` | `import { Button } from '@components/ui'` |
| `@hooks` | `src/hooks/` | `import { useTheme } from '@hooks'` |
| `@lib` | `src/lib/` | `import { eagleApi } from '@lib/eagle-api'` |
| `@styles` | `src/styles/` | `import '@styles/globals.css'` |

### TypeScript Alias Configuration

Must also configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@lib/*": ["src/lib/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

## Development Server

```typescript
server: {
  port: 5173,           // Default port
  open: true,           // Auto-open browser
  host: true,           // Listen on all addresses
  strictPort: false,    // Try next port if busy
  
  // Proxy API requests (if needed)
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  
  // Watch options
  watch: {
    // Ignore patterns
    ignored: ['**/node_modules/**', '**/dist/**'],
  },
},
```

## Build Optimization

### Bundle Analysis

The template includes `rollup-plugin-visualizer`:

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({
    filename: 'dist/bundle-stats.html',
    gzipSize: true,
    brotliSize: true,
    template: 'treemap',  // or 'sunburst', 'network'
  }),
],
```

After build, open `dist/bundle-stats.html` to analyze bundle composition.

### Minification

```typescript
build: {
  minify: 'esbuild',  // Fast, default
  // or
  minify: 'terser',   // More aggressive, slower
  
  terserOptions: {
    compress: {
      drop_console: true,  // Remove console.* in production
      drop_debugger: true,
    },
  },
},
```

### Target Browsers

```typescript
build: {
  target: 'es2020',  // Eagle uses modern Chromium
  
  // Or specify explicitly
  target: ['chrome90', 'safari14'],
},
```

## Environment Variables

### Definition

Create `.env` files:

```bash
# .env - All environments
VITE_APP_NAME=Eagle Plugin

# .env.development - Dev only
VITE_DEBUG=true

# .env.production - Prod only
VITE_DEBUG=false
```

### Usage

```typescript
// Access in code (must be prefixed with VITE_)
const appName = import.meta.env.VITE_APP_NAME;
const isDebug = import.meta.env.VITE_DEBUG === 'true';

// Built-in variables
import.meta.env.DEV      // true in development
import.meta.env.PROD     // true in production
import.meta.env.MODE     // 'development' or 'production'
```

### Type Definitions

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## CSS Configuration

### PostCSS

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

## TypeScript Configuration

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `tsconfig.node.json`

For Vite config and Node.js scripts:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "scripts/**/*"]
}
```

## Output Structure

After `npm run build`:

```
dist/
├── index.html              # Entry point
├── assets/
│   ├── index-[hash].js     # Main bundle
│   ├── index-[hash].css    # Styles
│   └── [asset]-[hash].*    # Other assets
└── bundle-stats.html       # Bundle analysis (if enabled)
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run build:watch` | Watch mode for Eagle |
| `npm run preview` | Preview production build |

### Watch Mode Details

```bash
npm run build:watch
# Runs: tsc && vite build --watch
```

- Compiles TypeScript first
- Rebuilds on file changes
- Output to `dist/`
- ~1-2 seconds per rebuild

## Related

- [Development Workflow](./workflow) - Overall workflow
- [Deploy Script](../deployment/deploy-script) - Deployment
- [Manifest Config](../deployment/manifest-config) - Plugin manifest
