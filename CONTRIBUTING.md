# Contributing to Movie Picture Stitching

Thank you for your interest in contributing to Movie Picture Stitching! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Internationalization](#internationalization)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

This project follows a Code of Conduct to ensure a welcoming environment for all contributors:

- **Be respectful**: Treat all community members with respect and kindness
- **Be inclusive**: Welcome developers of all skill levels and backgrounds
- **Be constructive**: Provide helpful feedback and suggestions
- **Be collaborative**: Work together towards common goals
- **Be patient**: Help others learn and grow

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Eagle 4.0+** installed for testing
- **Modern web browser** with Canvas API support
- **Git** for version control
- **Text editor** or IDE (VS Code recommended)
- Basic knowledge of **HTML/CSS/JavaScript**

### First-time Contributors

1. **Star and Fork** the repository
2. **Read** the README.md and documentation
3. **Look for** issues labeled `good first issue` or `help wanted`
4. **Join** discussions in GitHub Discussions
5. **Ask questions** if you need help

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/leonwong282/eagle-movie-picture-stitching.git
cd eagle-movie-picture-stitching
```

### 2. Development Installation

1. Copy the `Movie Picture Stitching` folder to Eagle's plugins directory
2. Enable developer mode in Eagle (`Settings` → `Plugins` → `Developer`)
3. Click `Import Local Project` and select the plugin folder
4. Enable the plugin and restart Eagle

### 3. Project Structure

```
eagle-movie-picture-stitching/
├── Movie Picture Stitching/        # Main plugin folder
│   ├── index.html                  # Main interface
│   ├── manifest.json               # Plugin configuration
│   ├── _locales/                   # Internationalization files
│   ├── css/                        # Stylesheets
│   │   └── modules/                # Modular CSS components
│   └── js/                         # JavaScript modules
├── image/                          # Documentation assets
├── screenshots/                    # Plugin screenshots
├── README.md                       # English documentation
├── README_CN.md                    # Chinese documentation
├── CHANGELOG.md                    # Version history
└── LICENSE                         # GPL-3.0 license
```

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🌍 **Translations and localization**
- 🎨 **UI/UX improvements**
- ⚡ **Performance optimizations**
- 🧪 **Tests and testing improvements**

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Discuss major changes** in GitHub Discussions first
3. **Follow the project's coding standards**
4. **Test your changes** thoroughly

## Pull Request Process

### 1. Prepare Your Changes

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Follow the [Code Style](#code-style) guidelines
- Add/update tests if applicable
- Update documentation if needed
- Test in multiple languages if touching i18n

### 3. Commit Your Changes

Use conventional commit messages:

```bash
# Format: type(scope): description
git commit -m "feat(ui): add new glass effect animation"
git commit -m "fix(i18n): resolve Japanese translation issues"
git commit -m "docs(readme): update installation instructions"
```

**Commit Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Submit Pull Request

1. **Push** your branch to your fork
2. **Create** a pull request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Testing instructions

### 5. Review Process

- Maintainers will review your PR
- Address feedback promptly
- Keep your branch updated with main
- Be patient and respectful during reviews

## Issue Guidelines

### Bug Reports

When reporting bugs, include:

```markdown
**Environment:**
- Eagle version: 
- OS: 
- Browser: 
- Plugin version: 

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Screenshots:**
(if applicable)

**Additional Context:**

```

### Feature Requests

For new features, provide:

- **Clear description** of the feature
- **Use case** and rationale
- **Possible implementation** ideas
- **Mockups or examples** if applicable

## Internationalization

### Adding New Languages

1. **Check** if the language is supported by Eagle
2. **Create** a new file in `_locales/` (e.g., `fr_FR.json`)
3. **Translate** all keys from `en.json`
4. **Test** the translation in Eagle
5. **Update** the language list in `manifest.json`

### Translation Guidelines

- **Maintain consistency** with Eagle's official translations
- **Keep technical terms** in English when appropriate
- **Consider cultural context** for UI text
- **Test** translations in the actual interface
- **Use proper character encoding** (UTF-8)

### Language File Structure

```json
{
  "manifest": {
    "app": {
      "name": "Translated Plugin Name",
      "description": "Translated description"
    }
  },
  "ui": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel"
    },
    "messages": {
      "success": "Success message",
      "error": "Error message"
    }
  }
}
```

## Code Style

### JavaScript

- **ES6+** syntax preferred
- **Camel case** for variables and functions
- **Pascal case** for classes
- **Descriptive variable names**
- **JSDoc comments** for functions
- **Error handling** for all async operations

```javascript
/**
 * Renders the preview image with applied parameters
 * @param {Object} params - Rendering parameters
 * @param {number} params.topCrop - Top crop percentage
 * @param {number} params.bottomCrop - Bottom crop percentage
 * @returns {Promise<void>}
 */
async function renderPreview(params) {
    try {
        // Implementation
    } catch (error) {
        console.error('Preview rendering failed:', error);
        showErrorMessage(error.message);
    }
}
```

### CSS

- **BEM methodology** for class naming
- **CSS custom properties** for theming
- **Mobile-first** responsive design
- **Consistent spacing** using variables

```css
/* Component */
.image-preview {
    /* Properties */
}

/* Modifier */
.image-preview--loading {
    /* Loading state */
}

/* Element */
.image-preview__canvas {
    /* Canvas styles */
}
```

### HTML

- **Semantic markup**
- **Accessibility attributes**
- **Internationalization attributes**

```html
<button 
    class="btn btn--primary" 
    data-i18n="ui.buttons.save"
    aria-label="Save image"
    type="button">
    Save
</button>
```

## Testing

### Manual Testing Checklist

- [ ] Test with various image formats (JPG, PNG, WebP, etc.)
- [ ] Test with different image sizes and quantities
- [ ] Test all parameter ranges and edge cases
- [ ] Test in all supported languages
- [ ] Test UI responsiveness on different screen sizes
- [ ] Test error handling scenarios
- [ ] Test plugin restart and memory cleanup

### Performance Testing

- [ ] Test with large image batches (up to 50 images)
- [ ] Monitor memory usage during processing
- [ ] Test processing speed benchmarks
- [ ] Verify smooth UI interactions

### Browser Compatibility

- [ ] Test in Chrome/Chromium
- [ ] Test in Safari (macOS)
- [ ] Test in Firefox
- [ ] Verify Canvas API functionality

## Documentation

### Code Documentation

- **JSDoc comments** for all public functions
- **Inline comments** for complex logic
- **README updates** for new features
- **CHANGELOG updates** for releases

### User Documentation

- Update **README.md** for English users
- Update **README_CN.md** for Chinese users
- Add **screenshots** for UI changes
- Update **user manual** sections

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (1.x.0): New features, backward compatible
- **PATCH** (1.1.x): Bug fixes, backward compatible

### Release Checklist

1. **Update version** in `manifest.json`
2. **Update CHANGELOG.md** with new features/fixes
3. **Test thoroughly** in clean Eagle installation
4. **Update documentation** if needed
5. **Create release tag** and GitHub release
6. **Submit to Eagle Plugin Store** if major update

## Getting Help

### Community Support

- **GitHub Discussions**: For general questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check README and wiki first

### Maintainer Contact

- **Response time**: 24-48 hours for urgent issues
- **Languages**: English, 简体中文, 繁體中文, 日本語
- **Time zone**: Primarily Asia/Pacific

## Recognition

Contributors will be:

- **Listed** in CHANGELOG.md for their contributions
- **Mentioned** in release notes
- **Credited** in project acknowledgments
- **Invited** to join as maintainers for significant contributions

## License

By contributing to this project, you agree that your contributions will be licensed under the [GPL-3.0 License](LICENSE).

---

Thank you for contributing to Movie Picture Stitching! Your efforts help make this plugin better for the entire Eagle community. 🚀

## Quick Links

- [Project Homepage](https://github.com/leonwong282/eagle-movie-picture-stitching)
- [Issue Tracker](https://github.com/leonwong282/eagle-movie-picture-stitching/issues)
- [Discussions](https://github.com/leonwong282/eagle-movie-picture-stitching/discussions)
- [Latest Release](https://github.com/leonwong282/eagle-movie-picture-stitching/releases/latest)
