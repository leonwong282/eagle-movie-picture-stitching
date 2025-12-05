Purpose

This repo is a Vite + React + TypeScript template for building Eagle desktop plugins. Agents should focus on the "dual environment" architecture (browser dev with a mocked Eagle API vs deployed plugin using the real Eagle API), the `eagleApi` adapter, and the deploy/build workflow.

Quick Commands
- `npm install` – install deps
- `npm run dev` – start Vite dev server (uses mock Eagle API)
- `npm run build` – TypeScript build then Vite production build (`tsc -b && vite build`)
- `npm run deploy` – build + `node scripts/deploy.js` (copies `dist` files into Eagle plugin dir; restart Eagle after)
- `npm run test` – unit tests (Vitest)
- `npm run test:e2e` – Playwright end-to-end tests
- `npm run test:visual` / `npm run test:visual:update` – visual snapshot tests

High-level Architecture (what to know first)
- Dual Environment Pattern: code should run unchanged in browser (mocked) and inside Eagle (real API). See `src/lib/eagle-api.ts` (the adapter and `isMock` flag). Always use the `eagleApi` singleton; never access `window.eagle` directly.
- Safe initialization: the adapter provides fallbacks because Eagle API may not be ready until the `plugin-create` event. Avoid assuming `window.eagle` exists at module init.
- Demo + Template system: `src/demos/` shows interactive examples; `src/templates/` contains plugin layouts (SinglePanel, SplitPanel, etc.) used by consumers.

Key Files & Directories (inspect these first)
- `src/lib/eagle-api.ts` — critical: adapter between mock and real Eagle API
- `src/lib/mock-factory.ts` — how mock data is generated in dev
- `src/main.tsx` — app bootstrapping (i18n + theme init)
- `src/App.tsx` — top-level providers (ErrorBoundary, ToastProvider)
- `src/pages/StitchingPage.tsx` and `src/components/stitching/` — primary feature area for this plugin
- `_locales/` — i18n JSON files (eight languages)
- `scripts/deploy.js` — transforms paths and copies files into Eagle plugin directory
- `manifest.json` — development manifest (deploy script rewrites paths for deployment)
- `vite.config.*` / `tsconfig.*` — path aliases and build settings

Project Conventions and Patterns
- Styling: Tailwind CSS + class-variance-authority (CVA) for variants. Look for `cva()` usage in component files (e.g., `src/components/ui/Button.tsx`).
- Exports: components use barrel exports (e.g., `src/components/index.ts`). Follow existing export patterns.
- State: Zustand stores live in `src/stores/` (slice-based). Persisted data often goes through `src/lib/storage.ts`.
- Errors: App wraps UI with `ErrorBoundary`. In production errors are forwarded to `eagleApi.log` when `!eagleApi.isMock` (see `src/App.tsx`).
- Tests: Unit tests use Vitest; DOM tests use `@testing-library/react` + `happy-dom`.
- E2E/Visual: Playwright configured in `playwright.config.ts`. Visual tests are tagged with `@visual`.

Common Pitfalls for Agents
- Do NOT replace or bypass `eagleApi`. Direct `window.eagle` access will break local dev.
- When changing `manifest.json`, prefer leaving dev paths and rely on `scripts/deploy.js` to adapt them for deployment.
- The project uses `tsc -b` (composite build). Ensure TypeScript project references and `tsconfig` changes maintain build consistency.

Examples (copyable)
- Correct cross-environment API usage:
```ts
import { eagleApi } from '@/lib';
const items = await eagleApi.getSelectedItems();
if (!eagleApi.isMock) eagleApi.log.info('Using real Eagle API');
```
- Incorrect (do not use):
```ts
// ❌ window.eagle may be undefined in dev
const items = await window.eagle.item.getSelected();
```

Testing & Debugging Tips
- Use `npm run dev` for rapid iteration with mocked data and HMR. The demo pages (`/`) show component usage and typical flows.
- To validate integration with Eagle, run `npm run deploy` then restart Eagle; the plugin is copied to the platform-specific plugin directory. macOS path: `~/Library/Application Support/Eagle/plugins/`.
- Run `npm run test:coverage` to get coverage with Vitest.

What to add or clarify
- If anything in CI steps, environment variables for deploy, or Eagle plugin testing steps are missing from this file, please update this doc or drop specifics in repository issues so agents can act on accurate platform steps.

Feedback
- Tell me which sections are unclear or what additional examples you want (build logs, manifest transforms, or a small debug checklist) and I will iterate.
