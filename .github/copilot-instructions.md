# Copilot Instructions for Eagle Movie Picture Stitching Plugin

## Purpose

This is an Eagle desktop plugin for stitching multiple movie images into panoramic compositions. Development uses a **React 18 + TypeScript template** in the `Movie Picture Stitching React/` subdirectory.

> **Key Point**: All development happens inside `Movie Picture Stitching React/`. This directory contains the actual plugin source, build scripts, and tests.

## Quick Navigation

- **Plugin Source**: `Movie Picture Stitching React/` (use this path for all development commands)
- **Main Feature**: `Movie Picture Stitching React/src/pages/StitchingPage.tsx` + `Movie Picture Stitching React/src/components/stitching/`
- **API Adapter**: `Movie Picture Stitching React/src/lib/eagle-api.ts` (handles mock vs. real Eagle API)
- **Project Docs**: `Movie Picture Stitching React/.github/copilot-instructions.md` (detailed template guidance)

## Essential Commands (run from `Movie Picture Stitching React/`)

```bash
# Development: start Vite dev server with mocked Eagle API
npm run dev

# Build for deployment
npm run build

# Deploy to Eagle plugins directory (with manifest transformation)
npm run deploy

# Run unit and integration tests
npm run test
npm run test:coverage

# Run end-to-end and visual snapshot tests
npm run test:e2e
npm run test:visual
npm run test:visual:update

# Code quality
npm run lint
npm run lint:fix
npm run format
```

## Architecture Overview

### Dual Environment Pattern
The template implements a **dual environment architecture**:

```
┌─────────────────────────────────────────────┐
│    React Component (StitchingPage, etc.)    │
├─────────────────────────────────────────────┤
│         eagleApi Singleton Adapter          │
├──────────────────┬──────────────────────────┤
│  Browser (dev)   │    Eagle (production)    │
│  Mock API        │    Real window.eagle     │
│  isMock = true   │    isMock = false        │
└──────────────────┴──────────────────────────┘
```

**Critical Rule**: Always use `eagleApi` from `src/lib/eagle-api.ts`. Never access `window.eagle` directly—it breaks local development.

```typescript
// ✅ CORRECT
import { eagleApi } from '@/lib';
const items = await eagleApi.getSelectedItems();

// ❌ WRONG - crashes in browser dev
const items = await window.eagle.item.getSelected();
```

### Key Architectural Components

1. **StitchingPage** (`src/pages/StitchingPage.tsx`): Main plugin page orchestrating the stitching workflow.
2. **ParameterPanel** (`src/components/stitching/ParameterPanel.tsx`): UI for cropping, quality, format parameters.
3. **PreviewCanvas** (`src/components/stitching/PreviewCanvas.tsx`): Real-time preview of stitched output.
4. **ImageQueue** (`src/components/stitching/ImageQueue.tsx`): Manages selected images and drag-reordering.
5. **Stitching Engine** (`src/lib/stitching-engine.ts`): Core algorithm for image stitching.

### State Management

- **Zustand Store** (`src/stores/`): Slice-based state for stitching parameters, image queue, preview.
- **localStorage** (`src/lib/storage.ts`): Persists user settings (crop %, quality, format) across sessions.
- **Hooks** (`src/hooks/useEagleSelection.ts`): Tracks selected images from Eagle API.

## Project-Specific Patterns

### Internationalization (8 Languages)
- Translation files: `_locales/{en.json, zh_CN.json, zh_TW.json, ja_JP.json, ko_KR.json, de_DE.json, es_ES.json, ru_RU.json}`
- Configured via `src/lib/i18n.ts`
- Auto-detect Eagle's language in `src/main.tsx`
- Use `useTranslation()` hook in components (from react-i18next)

### Styling
- **Tailwind CSS** with custom Eagle design tokens (`tailwind.config.js`)
- **CVA (class-variance-authority)** for component variants (see `src/components/ui/Button.tsx`)
- **Dark mode**: Automatically synced to Eagle's theme via `useTheme` hook

### Error Handling
- App-level ErrorBoundary in `src/App.tsx`
- Errors logged to `eagleApi.log` in production (`!eagleApi.isMock`)
- Always logged to `console` in development

### Canvas Rendering
- Utility functions in `src/lib/canvas.ts` for image manipulation
- `PreviewCanvas` uses `<canvas>` for high-performance preview rendering
- Quality range: 0.1–1.0 (applies to JPG/WebP; PNG is lossless)

## Build & Deployment

### Build Process
```bash
npm run build  # runs: tsc -b && vite build
```
- `tsc -b`: TypeScript composite build (checks types)
- `vite build`: Production bundle to `dist/`

### Deployment
```bash
npm run deploy  # runs: npm run build && node scripts/deploy.js
```

The `scripts/deploy.js` script:
1. Validates build output
2. Transforms `manifest.json` paths:
   - `dist/index.html` → `index.html`
   - `public/logo.png` → `logo.png`
3. Copies files to Eagle plugin directory:
   - **macOS**: `~/Library/Application Support/Eagle/plugins/`
   - **Windows**: `%APPDATA%\Eagle\plugins/`

> **Note**: Keep `manifest.json` with development paths. The deploy script handles transformation automatically.

## Testing Strategy

- **Unit Tests**: Vitest (`src/**/*.test.ts[x]`)
- **Component Tests**: React Testing Library + happy-dom
- **E2E Tests**: Playwright (`e2e/`)
- **Visual Snapshots**: Playwright with `@visual` tag

Run tests before deployment:
```bash
npm run test:run          # Fast unit/component test run
npm run test:coverage     # With coverage report
npm run test:e2e          # Full E2E suite
npm run test:visual       # Visual snapshot validation
```

## Common Development Tasks

### Adding a New UI Component
1. Create in `src/components/ui/YourComponent.tsx`
2. Use Tailwind + CVA for styling
3. Export from `src/components/ui/index.ts`
4. Add unit test: `src/components/ui/YourComponent.test.tsx`

### Modifying Stitching Logic
1. Update `src/lib/stitching-engine.ts`
2. Add tests in `src/lib/stitching-engine.test.ts`
3. Update `PreviewCanvas` if new parameters added

### Changing Internationalization
1. Edit translation files in `_locales/`
2. Keys used in code via `useTranslation()` hook
3. Test with `npm run dev`, switch Eagle's language in Settings

### Persisting Settings
1. Use `src/lib/storage.ts` utilities (namespaced localStorage)
2. Save to Zustand store slice in `src/stores/`
3. Hydrate store on app init via `useLocalStorage` hook

## Debugging & Validation

### Local Development
```bash
npm run dev
```
- Opens http://localhost:5173
- Mock Eagle API with sample images
- HMR (hot module reload) enabled
- Inspect mock data in `src/lib/mock-factory.ts`

### Plugin Installation in Eagle
```bash
npm run deploy
# Restart Eagle
# Plugin auto-loads from platform-specific plugin directory
```

### Verify Deployment
After `npm run deploy`:
- Check that `dist/` files exist
- Verify `manifest.json` was transformed (paths should not have `dist/` prefix)
- Restart Eagle and check Settings → Plugins for the plugin

### Troubleshooting
- **Build fails**: Run `npm install` and ensure TypeScript types are valid (`npm run typecheck`)
- **Plugin doesn't load**: Verify manifest paths don't have `dist/` prefix; check Eagle logs
- **Eagle API undefined**: Confirm you're using `eagleApi` singleton, not direct `window.eagle`
- **Styles broken**: Check Tailwind build (`npm run build` regenerates CSS)

## Common Pitfalls

1. **Accessing `window.eagle` directly** – Use `eagleApi` instead; mock won't work otherwise.
2. **Modifying `manifest.json` paths manually** – Let `deploy.js` handle transformation.
3. **Breaking TypeScript build** – Always run `npm run typecheck` before committing.
4. **Forgetting to persist settings** – Use `src/lib/storage.ts` + Zustand for user preferences.
5. **Not handling Eagle API initialization** – Use fallback defaults in adapters (see `src/lib/eagle-api.ts`).

## Template & Architecture Reference

For deeper architectural details, see the template's dedicated instructions:
**`Movie Picture Stitching React/.github/copilot-instructions.md`**

Topics covered there:
- Detailed dual-environment pattern explanation
- CVA styling examples
- Zustand store structure
- i18n integration steps
- Mock API factory behavior
- E2E/visual test patterns

## When to Ask for Help

- **Eagle API questions**: Check `src/types/eagle.d.ts` for full type definitions
- **Component questions**: Inspect similar components in `src/components/`
- **Test patterns**: Review existing tests in `src/**/*.test.ts[x]`
- **Build/deploy issues**: See `scripts/deploy.js` or `README.md` troubleshooting

---

**Last Updated**: December 2024  
**Template Version**: React 18 + TypeScript 5 + Vite 5  
**Node Version**: 18+ recommended
