# Changelog

All notable changes to the Eagle React Template are documented here.

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

## [Unreleased]

### Added
- Documentation website with Docusaurus
- Visual regression testing with Playwright

### Changed
- Improved polling performance with hash-based change detection

---

## [1.0.0] - 2024-01-15

### 🎉 Initial Release

First stable release of the Eagle React Template.

### Added

#### Core Features
- **Dual Environment Pattern** - Seamless development in browser with mock API
- **Eagle API Adapter** - Type-safe wrapper for all Eagle Plugin API methods
- **Safe Initialization** - All API getters protected with try-catch

#### Components (18 total)
- **UI Components:** Button, Card, Header, Toast
- **Form Components:** Input, Label, Select, Checkbox, Slider
- **Overlay Components:** Dialog, DropdownMenu, Tooltip, Popover
- **Layout Components:** Tabs, ImageGrid, EagleImage
- **Error Handling:** ErrorBoundary, ErrorFallback

#### Hooks (4 total)
- `useEagleSelection` - Polling-based selection tracking with optimization
- `useTheme` - Eagle theme synchronization
- `useLocalStorage` - Type-safe persistent storage
- `useLanguageSync` - i18n synchronization with Eagle

#### Templates (6 total)
- `SinglePanelTemplate` - Simple focused layouts
- `SplitPanelTemplate` - Sidebar + content pattern
- `SettingsPanelTemplate` - Configuration panels
- `BatchProcessTemplate` - Bulk operations with progress
- `ImageBrowserTemplate` - Image grid layouts
- `ThreeColumnTemplate` - Complex multi-column layouts

#### State Management
- Zustand store with slice architecture
- Memoized selectors for performance
- LocalStorage persistence middleware

#### Testing
- 1,040+ unit tests with Vitest
- Component testing with Testing Library
- Coverage thresholds: 60%/50%/50%/60%

#### Developer Experience
- Full TypeScript support
- Path aliases (@, @components, @hooks, @lib)
- Mock factory for browser development
- Deploy script for Eagle installation

#### Internationalization
- 8 language support
- Auto-detection from Eagle locale
- Fallback chain handling

### Technical Details

- React 18 with concurrent features
- TypeScript 5 strict mode
- Vite 5 build system
- Tailwind CSS 3 with design tokens
- CVA for type-safe variants

---

## Version History Format

Each version entry follows this structure:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security updates
```

---

## Contributing to Changelog

When making changes:

1. **Add entry to [Unreleased]** section
2. **Use correct category:**
   - `Added` - New features
   - `Changed` - Changes to existing features
   - `Deprecated` - Features to be removed
   - `Removed` - Removed features
   - `Fixed` - Bug fixes
   - `Security` - Security patches

3. **Format:**
   ```markdown
   - Brief description of change ([#123](link-to-pr))
   ```

4. **On release:** Move [Unreleased] items to new version section

## Release Process

1. Update version in `package.json`
2. Update version in `manifest.json`
3. Move [Unreleased] to new version section
4. Create git tag: `git tag -a v1.0.0 -m "Release 1.0.0"`
5. Push tag: `git push origin v1.0.0`
6. GitHub Action creates release automatically

## Links

- [GitHub Releases](https://github.com/your-org/eagle-react-template/releases)
- [Migration Guide](./migration-guide.md)
- [Contributing](./contributing.md)
