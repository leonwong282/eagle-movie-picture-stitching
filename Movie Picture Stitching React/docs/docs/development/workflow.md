---
sidebar_position: 1
title: Development Workflow
description: Overview of development modes and npm scripts
---

# Development Workflow

The template supports two development modes: **Browser Development** with mock data for rapid iteration, and **Eagle Watch Mode** for testing with real Eagle data.

## Quick Reference

| Command | Purpose | Use When |
|---------|---------|----------|
| `npm run dev` | Browser dev server | UI development, rapid prototyping |
| `npm run build:watch` | Eagle watch mode | Testing with real Eagle data |
| `npm run deploy` | Production deployment | Ready to publish |
| `npm test` | Run unit tests | After code changes |
| `npm run typecheck` | Type checking | Before committing |

## Development Modes

### Browser Development (Recommended for UI)

```bash
npm run dev
```

- Opens `http://localhost:5173` with hot module replacement
- Uses mock Eagle API with configurable data
- Instant feedback on UI changes
- No Eagle app required

**Best for:** Component development, styling, layout, rapid iteration

### Eagle Watch Mode (Recommended for Integration)

```bash
npm run build:watch
```

Then import the project in Eagle:
1. Eagle → Settings → Plugins → Developer
2. Click "Import Local Project"
3. Select project root folder
4. Press `Cmd+R` to reload after changes

**Best for:** Testing real Eagle integration, API behavior, file operations

### Production Build

```bash
npm run build
```

Creates optimized production build in `dist/`:
- Minified JavaScript bundle
- Optimized assets with hashed filenames
- Ready for Eagle deployment

## npm Scripts Reference

### Development

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start development server |
| `build` | `tsc -b && vite build` | Production build |
| `build:watch` | `tsc && vite build --watch` | Watch mode for Eagle |
| `preview` | `vite preview` | Preview production build |

### Quality

| Script | Command | Description |
|--------|---------|-------------|
| `typecheck` | `tsc --noEmit` | Type checking without emit |
| `lint` | `eslint .` | Run ESLint |
| `lint:fix` | `eslint . --fix` | Fix ESLint issues |
| `format` | `prettier --write "src/**/*"` | Format code |
| `format:check` | `prettier --check "src/**/*"` | Check formatting |

### Testing

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `vitest` | Run tests in watch mode |
| `test:run` | `vitest run` | Single test run |
| `test:coverage` | `vitest run --coverage` | With coverage report |
| `test:ui` | `vitest --ui` | Visual test UI |
| `test:e2e` | `playwright test` | End-to-end tests |

### Deployment

| Script | Command | Description |
|--------|---------|-------------|
| `deploy` | `npm run build && node scripts/deploy.js` | Deploy to Eagle |
| `create-plugin` | `npx tsx scripts/create-plugin.ts` | Scaffold new plugin |

## Recommended Workflow

### Daily Development

```bash
# 1. Start dev server
npm run dev

# 2. Make changes, see instant updates

# 3. Run tests before committing
npm test

# 4. Type check
npm run typecheck

# 5. Format and lint
npm run format && npm run lint:fix
```

### Before Committing

```bash
# Run all checks
npm run typecheck && npm run lint && npm run test:run
```

### Testing in Eagle

```bash
# 1. Build with watch
npm run build:watch

# 2. Import in Eagle (first time only)
# Eagle → Settings → Plugins → Developer → Import Local Project

# 3. After code changes, reload plugin
# Press Cmd+R in plugin window
```

### Production Release

```bash
# 1. Run all tests
npm run test:run

# 2. Build and deploy
npm run deploy

# 3. Restart Eagle to load new version
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Build environment |
| `VITE_*` | - | Client-side env vars |

Access in code:
```tsx
if (import.meta.env.DEV) {
  console.log('Development mode');
}

if (import.meta.env.PROD) {
  console.log('Production mode');
}
```

## File Watchers

### Vite Dev Server
- Watches `src/**/*` for HMR
- Instant updates without full reload
- Preserves React state when possible

### Build Watch Mode
- Watches `src/**/*` for rebuilds
- Full rebuild on changes (~1-2s)
- Requires manual plugin reload in Eagle

## Related

- [Browser Development](./browser-dev) - Mock system details
- [Eagle Watch Mode](./eagle-watch) - Eagle integration
- [Build Configuration](./build-config) - Vite setup
