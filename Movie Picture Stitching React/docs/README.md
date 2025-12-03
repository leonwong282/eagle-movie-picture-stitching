# Docusaurus Website

This directory contains the documentation website built with [Docusaurus](https://docusaurus.io/).

## 📁 Documentation Structure

This template uses a **two-tier documentation approach**:

| Location | Purpose | When to Use |
|----------|---------|-------------|
| **Root level** (`/`) | GitHub community files | Standard files GitHub recognizes: `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` |
| **This directory** (`/docs/`) | Docusaurus site | Detailed guides, tutorials, API docs, and any documentation that benefits from a structured website |

### Why This Structure?

1. **GitHub Integration**: Files like `CONTRIBUTING.md` and `SECURITY.md` at the root are automatically recognized by GitHub and shown in the repository UI
2. **Rich Documentation**: Docusaurus provides search, versioning, i18n, and beautiful presentation for detailed docs
3. **No Duplication**: Root files are for GitHub, Docusaurus is for in-depth content

### Where to Add Your Documentation

```
/                           ← GitHub community files (keep these here)
├── README.md               ← Project overview (GitHub landing page)
├── CONTRIBUTING.md         ← Contribution guidelines
├── CODE_OF_CONDUCT.md      ← Community standards
├── SECURITY.md             ← Security policy
└── CHANGELOG.md            ← Version history

/docs/                      ← Docusaurus site root
├── docs/                   ← 📝 Your documentation content goes here
│   ├── intro.md           ← Getting started guide
│   ├── guides/            ← How-to guides and tutorials
│   ├── reference/         ← API reference, configuration docs
│   └── community/         ← Community guidelines (mirrors root)
├── static/                 ← Images, downloads, static assets
├── src/                    ← Custom React components, CSS
├── docusaurus.config.js    ← Site configuration
└── sidebars.js             ← Navigation structure
```

## Quick Start

```bash
# Navigate to docs directory
cd docs

# Install dependencies
npm install

# Start development server
npm start
```

The site will be available at `http://localhost:3000/awesome-project-template/`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build production static files |
| `npm run serve` | Preview production build locally |
| `npm run deploy` | Deploy to GitHub Pages |

## Project Structure

```
website/
├── docs/                    # Documentation files (Markdown/MDX)
│   ├── intro.md            # Getting Started
│   ├── guides/             # Learning guides
│   │   ├── editorconfig/   # EditorConfig deep dive
│   │   └── precommit/      # Pre-commit deep dive
│   ├── reference/          # Reference docs
│   │   ├── contributing.md
│   │   └── license-guide.md
│   └── community/          # Community docs
│       ├── code-of-conduct.md
│       └── security.md
├── static/                  # Static assets
│   └── img/                # Images and logos
├── docusaurus.config.js    # Main configuration
├── sidebars.js             # Sidebar navigation
└── package.json            # Dependencies
```

## Adding Documentation

1. Create a new `.md` or `.mdx` file in the appropriate `docs/` subdirectory
2. Add frontmatter with title and sidebar position:
   ```yaml
   ---
   sidebar_position: 1
   title: "Your Page Title"
   description: "Brief description"
   ---
   ```
3. Update `sidebars.js` if needed for custom navigation

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. See `.github/workflows/deploy-docs.yml` for the workflow configuration.

### Manual Deployment

```bash
GIT_USER=<GITHUB_USERNAME> npm run deploy
```

## Configuration

### `docusaurus.config.js`

Main site configuration including:
- Site metadata (title, URL, tagline)
- Navbar and footer
- Theme settings
- Plugin configuration

### `sidebars.js`

Controls the documentation sidebar structure. Supports:
- Auto-generated sidebars from folder structure
- Manual sidebar items
- Categories and nested items

## Learn More

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Features](https://docusaurus.io/docs/markdown-features)
- [MDX and React Components](https://docusaurus.io/docs/markdown-features/react)
