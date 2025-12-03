---
sidebar_position: 1
title: Tabs
description: Tabbed interface component for organizing content into switchable panels
---

# Tabs

A tabbed interface component built on [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) providing accessible, keyboard-navigable content panels with customizable triggers.

## Import

```tsx
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components';
```

## Basic Usage

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="export">Export</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p>Overview content goes here.</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Settings content goes here.</p>
  </TabsContent>
  <TabsContent value="export">
    <p>Export content goes here.</p>
  </TabsContent>
</Tabs>
```

## Components

| Component | Description |
|-----------|-------------|
| `Tabs` | Root component managing tab state |
| `TabsList` | Container for tab triggers |
| `TabsTrigger` | Clickable tab button |
| `TabsContent` | Content panel for each tab |

## Props

### Tabs

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled active tab value |
| `onValueChange` | `(value: string) => void` | - | Callback when active tab changes |
| `defaultValue` | `string` | - | Initial active tab (uncontrolled) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab orientation |
| `dir` | `'ltr' \| 'rtl'` | - | Reading direction |
| `activationMode` | `'automatic' \| 'manual'` | `'automatic'` | When to activate tabs |

### TabsList

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `loop` | `boolean` | `true` | Whether keyboard navigation loops |

### TabsTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Unique identifier for the tab |
| `disabled` | `boolean` | `false` | Disable the tab trigger |
| `className` | `string` | - | Additional CSS classes |

### TabsContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Must match a TabsTrigger value |
| `className` | `string` | - | Additional CSS classes |
| `forceMount` | `boolean` | `false` | Keep content mounted when inactive |

## Examples

### Plugin Demo Tabs

The Eagle React Template uses tabs extensively for organizing demo content:

```tsx
function DemoPage() {
  const [activeTab, setActiveTab] = useState('selection');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start">
        <TabsTrigger value="selection">Selection</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
        <TabsTrigger value="forms">Forms</TabsTrigger>
        <TabsTrigger value="dialogs">Dialogs</TabsTrigger>
        <TabsTrigger value="canvas">Canvas</TabsTrigger>
        <TabsTrigger value="storage">Storage</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="selection">
          <SelectionDemo />
        </TabsContent>
        <TabsContent value="components">
          <ComponentsDemo />
        </TabsContent>
        {/* ... more content */}
      </div>
    </Tabs>
  );
}
```

### With Icons

```tsx
import { Image, Settings, Download, Info } from 'lucide-react';

<Tabs defaultValue="images">
  <TabsList>
    <TabsTrigger value="images" className="gap-2">
      <Image className="h-4 w-4" />
      Images
    </TabsTrigger>
    <TabsTrigger value="settings" className="gap-2">
      <Settings className="h-4 w-4" />
      Settings
    </TabsTrigger>
    <TabsTrigger value="export" className="gap-2">
      <Download className="h-4 w-4" />
      Export
    </TabsTrigger>
    <TabsTrigger value="about" className="gap-2">
      <Info className="h-4 w-4" />
      About
    </TabsTrigger>
  </TabsList>
  {/* ... content */}
</Tabs>
```

### Controlled Tabs

```tsx
function ControlledTabs() {
  const [tab, setTab] = useState('first');

  const handleNext = () => {
    const tabs = ['first', 'second', 'third'];
    const currentIndex = tabs.indexOf(tab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setTab(tabs[nextIndex]);
  };

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="first">Step 1</TabsTrigger>
        <TabsTrigger value="second">Step 2</TabsTrigger>
        <TabsTrigger value="third">Step 3</TabsTrigger>
      </TabsList>
      <TabsContent value="first">
        <p>First step content</p>
        <Button onClick={handleNext}>Next</Button>
      </TabsContent>
      <TabsContent value="second">
        <p>Second step content</p>
        <Button onClick={handleNext}>Next</Button>
      </TabsContent>
      <TabsContent value="third">
        <p>Third step content</p>
        <Button onClick={() => setTab('first')}>Start Over</Button>
      </TabsContent>
    </Tabs>
  );
}
```

### Vertical Tabs

```tsx
<Tabs defaultValue="general" orientation="vertical" className="flex gap-4">
  <TabsList className="flex-col h-auto">
    <TabsTrigger value="general" className="w-full justify-start">
      General
    </TabsTrigger>
    <TabsTrigger value="appearance" className="w-full justify-start">
      Appearance
    </TabsTrigger>
    <TabsTrigger value="advanced" className="w-full justify-start">
      Advanced
    </TabsTrigger>
  </TabsList>
  <div className="flex-1">
    <TabsContent value="general">
      General settings...
    </TabsContent>
    <TabsContent value="appearance">
      Appearance settings...
    </TabsContent>
    <TabsContent value="advanced">
      Advanced settings...
    </TabsContent>
  </div>
</Tabs>
```

### Disabled Tabs

```tsx
<Tabs defaultValue="available">
  <TabsList>
    <TabsTrigger value="available">Available</TabsTrigger>
    <TabsTrigger value="premium" disabled>
      Premium (Upgrade Required)
    </TabsTrigger>
    <TabsTrigger value="beta" disabled>
      Beta (Coming Soon)
    </TabsTrigger>
  </TabsList>
  <TabsContent value="available">
    <p>Available features content</p>
  </TabsContent>
</Tabs>
```

### With Badges

```tsx
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all" className="gap-2">
      All
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
        128
      </span>
    </TabsTrigger>
    <TabsTrigger value="starred" className="gap-2">
      Starred
      <span className="rounded-full bg-yellow-500/20 text-yellow-600 px-2 py-0.5 text-xs">
        12
      </span>
    </TabsTrigger>
    <TabsTrigger value="recent" className="gap-2">
      Recent
      <span className="rounded-full bg-blue-500/20 text-blue-600 px-2 py-0.5 text-xs">
        24
      </span>
    </TabsTrigger>
  </TabsList>
  {/* ... content */}
</Tabs>
```

### Card with Tabs

```tsx
<Card>
  <CardHeader>
    <CardTitle>Image Details</CardTitle>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="info">
      <TabsList className="w-full">
        <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
        <TabsTrigger value="metadata" className="flex-1">Metadata</TabsTrigger>
        <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
      </TabsList>
      <TabsContent value="info" className="pt-4">
        <dl className="space-y-2">
          <div>
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd>landscape-sunset.jpg</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Size</dt>
            <dd>2.4 MB</dd>
          </div>
        </dl>
      </TabsContent>
      {/* ... other content */}
    </Tabs>
  </CardContent>
</Card>
```

### Lazy Loading Content

Use `forceMount` to control when content is rendered:

```tsx
<Tabs defaultValue="light">
  <TabsList>
    <TabsTrigger value="light">Light Data</TabsTrigger>
    <TabsTrigger value="heavy">Heavy Data</TabsTrigger>
  </TabsList>
  
  {/* Light content - normal unmounting */}
  <TabsContent value="light">
    <LightComponent />
  </TabsContent>
  
  {/* Heavy content - keep mounted to preserve state */}
  <TabsContent value="heavy" forceMount className="data-[state=inactive]:hidden">
    <HeavyComponent />
  </TabsContent>
</Tabs>
```

## Styling

### Default Styles

```tsx
// TabsList default styling
"inline-flex h-10 items-center justify-center rounded-md"
"bg-muted p-1 text-muted-foreground"

// TabsTrigger default styling
"inline-flex items-center justify-center whitespace-nowrap"
"rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background"
"transition-all focus-visible:outline-none focus-visible:ring-2"
"focus-visible:ring-ring focus-visible:ring-offset-2"
"disabled:pointer-events-none disabled:opacity-50"
"data-[state=active]:bg-background data-[state=active]:text-foreground"
"data-[state=active]:shadow-sm"

// TabsContent default styling
"mt-2 ring-offset-background focus-visible:outline-none"
"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### Custom Styling Examples

```tsx
// Full-width tabs
<TabsList className="w-full grid grid-cols-3">
  <TabsTrigger value="a">A</TabsTrigger>
  <TabsTrigger value="b">B</TabsTrigger>
  <TabsTrigger value="c">C</TabsTrigger>
</TabsList>

// Underline style
<TabsList className="bg-transparent border-b rounded-none">
  <TabsTrigger 
    value="tab"
    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
  >
    Tab
  </TabsTrigger>
</TabsList>

// Pill style
<TabsList className="bg-transparent gap-2">
  <TabsTrigger 
    value="tab"
    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    Tab
  </TabsTrigger>
</TabsList>
```

## Accessibility

Tabs implement comprehensive keyboard navigation:

- **Tab**: Focus on tabs list, then into content
- **Arrow Left/Right**: Navigate between tabs (horizontal)
- **Arrow Up/Down**: Navigate between tabs (vertical)
- **Home**: Move to first tab
- **End**: Move to last tab
- **Enter/Space**: Activate focused tab (when `activationMode="manual"`)

### ARIA Attributes

- `role="tablist"` on TabsList
- `role="tab"` on each TabsTrigger
- `role="tabpanel"` on each TabsContent
- `aria-selected` state on triggers
- `aria-controls` linking triggers to panels
- `aria-labelledby` linking panels to triggers

### Activation Modes

```tsx
// Automatic: Tab activates on arrow key focus (default)
<Tabs activationMode="automatic">
  {/* Tab switches immediately on arrow key */}
</Tabs>

// Manual: Tab activates only on Enter/Space
<Tabs activationMode="manual">
  {/* User must press Enter to switch tabs */}
</Tabs>
```

## Best Practices

### Do

- ✅ Use clear, concise tab labels
- ✅ Put the most important tab first
- ✅ Keep tab count reasonable (2-7 tabs)
- ✅ Use controlled mode for step-by-step flows
- ✅ Maintain consistent content height when possible
- ✅ Consider `forceMount` for expensive-to-render content

### Don't

- ❌ Use tabs for navigation between pages
- ❌ Hide critical information in inactive tabs
- ❌ Make tabs too narrow for their labels
- ❌ Nest tabs within tabs
- ❌ Use tabs when content should be compared side-by-side
- ❌ Have too many tabs causing overflow

## URL Synchronization

Sync tab state with URL for shareable links:

```tsx
import { useSearchParams } from 'react-router-dom';

function URLTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      {/* ... content */}
    </Tabs>
  );
}
```

## Related Components

- [Card](../ui/card) - Often used to wrap tabbed content
- [Button](../ui/button) - Alternative for action-based navigation
- [DropdownMenu](../overlay/dropdown-menu) - For many options in limited space
