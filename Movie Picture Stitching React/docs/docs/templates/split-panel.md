---
sidebar_position: 3
title: SplitPanelTemplate
description: Two-column layout with collapsible sidebar
---

# SplitPanelTemplate

A two-column layout with a collapsible sidebar for navigation-based UIs, file explorers, and category-driven interfaces.

## Import

```tsx
import { SplitPanelTemplate } from '@/templates';
```

## Basic Usage

```tsx
function MyPlugin() {
  return (
    <SplitPanelTemplate
      sidebarContent={<NavigationMenu />}
    >
      <MainContent />
    </SplitPanelTemplate>
  );
}
```

## Layout Structure

```
┌─────────────────────────────────────┐
│            Header                   │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │       children           │
│  Content │                          │
│          │                          │
│  (280px) │      Main Content        │
│          │                          │
└──────────┴──────────────────────────┘

Collapsed:
┌─────────────────────────────────────┐
│            Header                   │
├─┬───────────────────────────────────┤
│◀│                                   │
│ │         children                  │
│ │                                   │
└─┴───────────────────────────────────┘
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Main content area |
| `sidebarContent` | `ReactNode` | **required** | Sidebar content |
| `sidebarWidth` | `number` | `280` | Sidebar width in pixels |
| `collapsible` | `boolean` | `true` | Allow sidebar collapse |
| `defaultCollapsed` | `boolean` | `false` | Start with sidebar collapsed |
| `title` | `string` | `undefined` | Header title |
| `headerActions` | `ReactNode` | `undefined` | Header right-side content |
| `sidebarClassName` | `string` | `''` | Additional sidebar classes |
| `contentClassName` | `string` | `''` | Additional content classes |

## Examples

### Navigation Menu

```tsx
import { SplitPanelTemplate } from '@/templates';

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'folders', label: 'Folders', icon: Folder },
];

function NavigationPlugin() {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <SplitPanelTemplate
      title="File Manager"
      sidebarContent={
        <nav className="p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
                activeItem === item.id
                  ? 'bg-emerald-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      }
    >
      <ContentForItem itemId={activeItem} />
    </SplitPanelTemplate>
  );
}
```

### Folder Tree Explorer

```tsx
function FolderExplorer() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { folders } = useFolders();

  return (
    <SplitPanelTemplate
      title="Folder Browser"
      sidebarWidth={250}
      sidebarContent={
        <FolderTree
          folders={folders}
          selected={selectedFolder}
          onSelect={setSelectedFolder}
        />
      }
    >
      {selectedFolder ? (
        <FolderContents folderId={selectedFolder} />
      ) : (
        <EmptyState message="Select a folder" />
      )}
    </SplitPanelTemplate>
  );
}
```

### Start Collapsed

```tsx
function CompactPlugin() {
  return (
    <SplitPanelTemplate
      title="Compact View"
      defaultCollapsed={true}
      sidebarContent={<QuickActions />}
    >
      <MainView />
    </SplitPanelTemplate>
  );
}
```

### Non-Collapsible Sidebar

```tsx
function FixedSidebarPlugin() {
  return (
    <SplitPanelTemplate
      title="Dashboard"
      collapsible={false}
      sidebarWidth={200}
      sidebarContent={<StaticMenu />}
    >
      <Dashboard />
    </SplitPanelTemplate>
  );
}
```

### With Header Actions

```tsx
function PluginWithActions() {
  return (
    <SplitPanelTemplate
      title="Asset Manager"
      headerActions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Import
          </Button>
          <Button variant="primary" size="sm">
            New Folder
          </Button>
        </div>
      }
      sidebarContent={<CategoryList />}
    >
      <AssetGrid />
    </SplitPanelTemplate>
  );
}
```

### Custom Styling

```tsx
function StyledPlugin() {
  return (
    <SplitPanelTemplate
      title="Styled Layout"
      sidebarClassName="bg-gray-900 text-white"
      contentClassName="bg-gray-50 dark:bg-gray-800 p-6"
      sidebarContent={<DarkSidebar />}
    >
      <LightContent />
    </SplitPanelTemplate>
  );
}
```

## Sidebar Collapse Behavior

### Programmatic Control

```tsx
function ControlledSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SplitPanelTemplate
      defaultCollapsed={collapsed}
      headerActions={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      }
      sidebarContent={<Menu />}
    >
      <Content />
    </SplitPanelTemplate>
  );
}
```

### Responsive Behavior

The template handles window resizing:

- Sidebar remains fixed width when expanded
- Content area fills remaining space
- Collapse toggle preserves state across resize

## Keyboard Navigation

When focus is in the sidebar:

| Key | Action |
|-----|--------|
| `Arrow Up/Down` | Navigate menu items |
| `Enter` | Select item |
| `Escape` | Collapse sidebar (if collapsible) |

## Best Practices

### ✅ Do

```tsx
// Clear navigation structure
<SplitPanelTemplate
  sidebarContent={
    <nav>
      <SectionTitle>Categories</SectionTitle>
      <NavItems items={categories} />
    </nav>
  }
>
  <CategoryView />
</SplitPanelTemplate>

// Use appropriate sidebar width
<SplitPanelTemplate
  sidebarWidth={200}  // Narrow for icon + text
  sidebarContent={<CompactMenu />}
>
```

### ❌ Don't

```tsx
// Don't put complex content in sidebar
<SplitPanelTemplate
  sidebarContent={
    <div>
      <ImageEditor />  {/* Too complex for sidebar */}
      <Form />
    </div>
  }
>

// Don't make sidebar too wide
<SplitPanelTemplate
  sidebarWidth={500}  // Takes too much space
>
```

## When to Use

**Use SplitPanelTemplate when:**
- Building navigation-based UIs
- Need category/folder selection
- Content changes based on sidebar selection
- Want collapsible secondary panel

**Consider other templates when:**
- Need settings with sections → [`SettingsPanelTemplate`](./settings-panel)
- Need three panels → [`ThreeColumnTemplate`](./three-column)
- Simple single-panel UI → [`SinglePanelTemplate`](./single-panel)

## Related

- [Templates Overview](./overview) - All available templates
- [ThreeColumnTemplate](./three-column) - For three-panel layouts
