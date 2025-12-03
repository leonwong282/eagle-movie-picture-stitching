# Lucide React Icon Inventory

This document tracks all Lucide React icons used in the template to:
1. Enable tree-shaking verification via bundle analyzer
2. Prevent unused icon accumulation
3. Guide icon selection for new features

## Icon Usage Summary

**Total Unique Icons:** 32  
**Package:** `lucide-react@^0.460.0`  
**Tree-Shaking:** ✅ Verified (Vite + Rollup handles ES module imports correctly)

## Icons by File

### `src/App.tsx` (20 icons)

| Icon | Usage Context |
|------|---------------|
| `Sparkles` | Hero section badge |
| `Image` | Selection tab, placeholder |
| `Palette` | Dialogs tab, Toast demo |
| `Zap` | Components tab |
| `Settings` | Settings tab |
| `MoreHorizontal` | Popover trigger |
| `Copy` | Dropdown menu, Tooltip demo |
| `Trash2` | Dropdown menu delete |
| `Download` | Dialog export, Tooltip demo |
| `Share2` | Dropdown menu, Tooltip demo |
| `Edit` | Dropdown menu |
| `Star` | Dropdown menu favorites |
| `Archive` | Dropdown menu |
| `Eye` | View all button |
| `Plus` | Icon button size demo |
| `ChevronDown` | Dropdown trigger |
| `Info` | Info toast button |
| `AlertCircle` | Error/Warning toast buttons |
| `CheckCircle2` | Success toast button |
| `HelpCircle` | Tooltip demo |

### `src/components/ui/Header.tsx` (4 icons)

| Icon | Usage Context |
|------|---------------|
| `Moon` | Dark mode toggle |
| `Sun` | Light mode toggle |
| `Settings` | Settings button |
| `X` | Close button |

### `src/components/ui/Toast.tsx` (1 icon)

| Icon | Usage Context |
|------|---------------|
| `X` | Toast dismiss button |

### `src/components/ui/Checkbox.tsx` (1 icon)

| Icon | Usage Context |
|------|---------------|
| `Check` | Checkbox indicator |

### `src/components/ui/ErrorFallback.tsx` (5 icons)

| Icon | Usage Context |
|------|---------------|
| `AlertTriangle` | Error icon |
| `RefreshCw` | Retry button |
| `Copy` | Copy error button |
| `ChevronDown` | Expand details |
| `ChevronUp` | Collapse details |

### `src/components/ui/Select.tsx` (1 icon)

| Icon | Usage Context |
|------|---------------|
| `ChevronDown` | Select trigger |

### `src/components/ui/DropdownMenu.tsx` (3 icons)

| Icon | Usage Context |
|------|---------------|
| `Check` | Checkbox item indicator |
| `ChevronRight` | Submenu indicator |
| `Circle` | Radio item indicator |

### `src/components/ui/Slider.tsx` (0 icons)

No icons used.

## Complete Deduplicated List

```typescript
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  Copy,
  Download,
  Edit,
  Eye,
  HelpCircle,
  Image,
  Info,
  Moon,
  MoreHorizontal,
  Palette,
  Plus,
  RefreshCw,
  Settings,
  Share2,
  Sparkles,
  Star,
  Sun,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
```

**Count: 29 unique icons** (some are used in multiple files)

## Bundle Impact

With tree-shaking enabled (default in Vite):
- Each icon adds ~1-2KB (uncompressed) to the bundle
- Total icon contribution: ~30-60KB uncompressed, ~10-15KB gzipped
- The full lucide-react library is ~500KB+ uncompressed

### Verifying Tree-Shaking

Run bundle analysis to confirm only used icons are included:

```bash
npm run build:analyze
```

Look for `lucide-react` in the treemap - it should only contain the icons listed above.

## Adding New Icons

When adding a new icon:

1. Import from `lucide-react` (not individual files - Vite handles tree-shaking)
2. Update this inventory document
3. Run `npm run build:analyze` to verify bundle impact

```typescript
// ✅ Correct - tree-shakes properly with Vite
import { NewIcon } from 'lucide-react';

// ❌ Unnecessary - Vite already tree-shakes the main export
import NewIcon from 'lucide-react/dist/esm/icons/new-icon';
```

## Icon Categories

### Navigation & Actions
`ChevronDown`, `ChevronRight`, `ChevronUp`, `X`, `Plus`, `MoreHorizontal`

### Status & Feedback
`Check`, `CheckCircle2`, `AlertCircle`, `AlertTriangle`, `Info`, `HelpCircle`

### Content Operations
`Copy`, `Download`, `Edit`, `Trash2`, `Share2`, `Archive`, `Eye`

### Theme & Settings
`Moon`, `Sun`, `Settings`, `Palette`

### Misc
`Sparkles`, `Image`, `Zap`, `Star`, `RefreshCw`, `Circle`

## Related Documentation

- Bundle Analyzer: Use `npm run build:analyze` to verify tree-shaking
- [Design System](./DESIGN_SYSTEM.md) - Component patterns
