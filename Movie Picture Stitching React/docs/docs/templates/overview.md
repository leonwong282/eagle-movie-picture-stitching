---
sidebar_position: 1
title: Templates Overview
description: Ready-to-use plugin layout templates
---

# Templates Overview

The Eagle React Template provides **6 ready-to-use layout templates** designed for common Eagle plugin patterns. Each template is fully responsive, supports dark mode, and follows Eagle's design language.

## Quick Reference

| Template | Use Case | Columns | Complexity |
|----------|----------|---------|------------|
| [`SinglePanelTemplate`](./single-panel) | Simple utilities | 1 | Low |
| [`SplitPanelTemplate`](./split-panel) | Navigation + content | 2 | Low |
| [`SettingsPanelTemplate`](./settings-panel) | Plugin settings | 2 | Medium |
| [`BatchProcessTemplate`](./batch-process) | Bulk operations | 2-3 | High |
| [`ImageBrowserTemplate`](./image-browser) | Asset browsers | 1-2 | Medium |
| [`ThreeColumnTemplate`](./three-column) | Complex workflows | 3 | High |

## Import

All templates are exported from the `@/templates` barrel:

```tsx
import { 
  SinglePanelTemplate,
  SplitPanelTemplate,
  SettingsPanelTemplate,
  BatchProcessTemplate,
  ImageBrowserTemplate,
  ThreeColumnTemplate,
} from '@/templates';
```

## Visual Guide

### SinglePanelTemplate

```
┌─────────────────────────────────────┐
│            Header                   │
├─────────────────────────────────────┤
│                                     │
│           Main Content              │
│                                     │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

**Best for:** Simple tools, single-purpose utilities, quick actions

### SplitPanelTemplate

```
┌─────────────────────────────────────┐
│            Header                   │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │       Main Content       │
│  (280px) │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

**Best for:** Navigation-based UIs, file explorers, settings with categories

### SettingsPanelTemplate

```
┌─────────────────────────────────────┐
│     Settings        [Save] [Reset]  │
├──────────┬──────────────────────────┤
│ General  │  Section Title           │
│ Advanced │  ┌─────────────────────┐ │
│ Export   │  │ Setting 1           │ │
│          │  │ Setting 2           │ │
│          │  └─────────────────────┘ │
└──────────┴──────────────────────────┘
```

**Best for:** Plugin configuration, preferences, multi-section settings

### BatchProcessTemplate

```
┌─────────────────────────────────────┐
│  Batch Process         [▶ Start]   │
├──────────────────────────────────────┤
│  Progress: ████████░░ 80% (8/10)   │
├──────────┬──────────────────────────┤
│ Queue    │  Current Item Preview    │
│ ✓ item1  │  ┌─────────────────────┐ │
│ ✓ item2  │  │                     │ │
│ → item3  │  │    Processing...    │ │
│ ○ item4  │  │                     │ │
│ ○ item5  │  └─────────────────────┘ │
└──────────┴──────────────────────────┘
```

**Best for:** Bulk operations, export workflows, batch conversions

### ImageBrowserTemplate

```
┌─────────────────────────────────────┐
│  🔍 Search...    [Grid] [Sort ▼]   │
├─────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ img │ │ img │ │ img │ │ img │   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ img │ │ img │ │ img │ │ img │   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
├─────────────────────────────────────┤
│  Selected: 3 items                  │
└─────────────────────────────────────┘
```

**Best for:** Asset browsers, image galleries, file pickers

### ThreeColumnTemplate

```
┌─────────────────────────────────────┐
│            Header                   │
├─────────┬───────────────┬───────────┤
│  Left   │    Center     │   Right   │
│ Column  │    Column     │  Column   │
│         │               │           │
│  Queue  │   Preview     │  Params   │
│  List   │   Canvas      │  Panel    │
│         │               │           │
└─────────┴───────────────┴───────────┘
```

**Best for:** Complex editing workflows, Eagle-style layouts, preview-based tools

## Choosing a Template

### Decision Tree

```
Need settings/preferences?
├── Yes → SettingsPanelTemplate
└── No ↓
    
Need to process multiple items?
├── Yes → BatchProcessTemplate
└── No ↓
    
Displaying image grid?
├── Yes → ImageBrowserTemplate
└── No ↓
    
Need sidebar navigation?
├── Yes → SplitPanelTemplate
└── No ↓
    
Need 3 distinct panels?
├── Yes → ThreeColumnTemplate
└── No → SinglePanelTemplate
```

## Common Features

All templates share these features:

### Header with Window Controls

```tsx
<SinglePanelTemplate
  title="My Plugin"
  headerActions={
    <Button variant="ghost" size="icon">
      <Settings className="w-4 h-4" />
    </Button>
  }
>
```

### Dark Mode Support

Templates automatically adapt to the theme:

```tsx
// Themed backgrounds and borders are built-in
<SplitPanelTemplate>
  {/* Content automatically uses dark mode colors */}
</SplitPanelTemplate>
```

### Responsive Behavior

Templates handle window resizing gracefully:

- Collapsible sidebars on narrow windows
- Responsive grids in ImageBrowserTemplate
- Scrollable panels with proper overflow

## Composition Example

Templates can be composed for complex UIs:

```tsx
import { SplitPanelTemplate, ImageBrowserTemplate } from '@/templates';

function AdvancedBrowser() {
  return (
    <SplitPanelTemplate
      sidebarContent={<FolderTree />}
    >
      <ImageBrowserTemplate
        items={images}
        onSelectionChange={handleSelect}
      />
    </SplitPanelTemplate>
  );
}
```

## Related

- [Getting Started](../getting-started/installation) - Project setup
- [Components: Button](../components/ui/button) - UI components used in templates
