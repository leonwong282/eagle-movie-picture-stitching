---
sidebar_position: 2
title: Installation
description: Prerequisites and setup instructions for Eagle React Template
---

# Installation

Get your development environment ready for building Eagle plugins.

## Prerequisites

Before you begin, make sure you have:

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | 18.0+ | [Download](https://nodejs.org/) |
| **npm** or **pnpm** | Latest | Comes with Node.js |
| **Eagle** | 4.0+ | [Download](https://eagle.cool) (for deployment testing) |
| **Git** | Latest | Optional, for version control |

:::tip Verify Installation
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
```
:::

## Quick Install

### Option 1: Clone the Template

```bash
# Clone the repository
git clone https://github.com/leonwong282/eagle-react-template.git my-eagle-plugin

# Navigate to the project
cd my-eagle-plugin

# Install dependencies
npm install
```

### Option 2: Use the CLI Scaffolding

If you already have the template, use the interactive CLI:

```bash
npm run create-plugin
```

This will prompt you for:
- Project directory name
- Plugin display name
- Description
- Author name
- Languages to include

## Verify Installation

Start the development server to verify everything works:

```bash
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser. You'll see the demo page with interactive tabs showcasing all features.

## Project Scripts

Here are the essential npm scripts:

### Development

| Script | Description |
|--------|-------------|
| `npm run dev` | Start browser dev server with hot reload |
| `npm run build` | Build for production |
| `npm run build:watch` | Build in watch mode (for Eagle development) |

### Testing

| Script | Description |
|--------|-------------|
| `npm run test` | Run unit tests with Vitest |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |

### Code Quality

| Script | Description |
|--------|-------------|
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript type checking |

### Deployment

| Script | Description |
|--------|-------------|
| `npm run deploy` | Build and copy to Eagle plugins directory |

## IDE Setup

### VS Code (Recommended)

The template includes VS Code configuration in `.vscode/`:

1. **Install recommended extensions** when prompted, or manually:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin (Volar)

2. **Settings are pre-configured** for:
   - Format on save
   - ESLint auto-fix on save
   - Tailwind CSS class sorting

### Other IDEs

For WebStorm, Neovim, or other editors:

1. Enable ESLint integration
2. Configure Prettier as the formatter
3. Add TypeScript support for `.tsx` files

## Troubleshooting

### Node.js Version Too Old

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Permission Errors on macOS/Linux

```bash
# If you see EACCES errors
sudo chown -R $(whoami) ~/.npm
```

### Port 5173 Already in Use

```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Not Installing

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Next Steps

Now that you're set up:

1. **[Quick Start](./quick-start)** — Run your first plugin in Eagle
2. **[Project Structure](./project-structure)** — Understand the codebase
