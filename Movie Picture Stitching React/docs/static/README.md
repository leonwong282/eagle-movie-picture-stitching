# Static Assets

This directory contains static assets for the Docusaurus documentation website.

## Structure

```
static/
├── img/
│   ├── logo.png          # Site logo (navbar) - REQUIRED
│   ├── logo-dark.png     # Dark mode logo (optional)
│   ├── favicon.svg       # Browser tab icon - REQUIRED
│   └── social-card.svg   # OG/Twitter card image (1200x630) - REQUIRED
└── README.md
```

## Current Assets

| File | Status | Description |
|------|--------|-------------|
| `logo.png` | ✅ Exists | Main logo for navbar (light mode) |
| `logo-dark.svg` | ✅ Exists | Dark mode logo variant |
| `favicon.svg` | ✅ Exists | SVG favicon for browser tabs |
| `social-card.svg` | ✅ Exists | Social media preview image |

## Usage

- Place images in `img/` folder
- Reference in docs: `![Alt text](/img/filename.png)`
- Configured in `docusaurus.config.js` for navbar/footer

## Creating Your Own Assets

### Favicon

The favicon uses SVG format (modern approach). To customize:

1. Edit `img/favicon.svg` with your branding
2. Or convert your logo to ICO format and update `docusaurus.config.js`:
   ```js
   favicon: 'img/favicon.ico',
   ```

### Social Card

The social card appears when links are shared on social media. Requirements:

- **Dimensions**: 1200×630 pixels (optimal for Open Graph)
- **Format**: SVG, PNG, or JPG
- **Content**: Project name, tagline, branding

### Dark Mode Logo

To add a dark mode logo variant:

1. Create `logo-dark.png` with appropriate colors for dark backgrounds
2. Update `docusaurus.config.js`:
   ```js
   logo: {
     src: 'img/logo.png',
     srcDark: 'img/logo-dark.png',
   },
   ```

## Logo Requirements

- **Format**: PNG, SVG, or JPG
- **Size**: Navbar logo should be ~32-40px height
- **Variants**: Consider light/dark mode versions for better accessibility
