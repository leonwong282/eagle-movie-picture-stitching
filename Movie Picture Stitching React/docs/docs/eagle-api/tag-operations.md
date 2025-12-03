---
sidebar_position: 4
title: Tag Operations
description: Manage tags and tag groups in the Eagle library
---

# Tag Operations

Create, retrieve, and manage tags for organizing items in the Eagle library.

## Import

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## Get All Tags

Retrieve all tags with their usage counts.

```tsx
const tags = await eagleApi.tag.getAll();
```

**Returns:** `Promise<EagleTag[]>`

### EagleTag Type

```tsx
interface EagleTag {
  id: string;              // Unique tag ID  
  name: string;            // Tag name
  color: string;           // Tag color (hex)
  count: number;           // Number of items with this tag
  groups: string[];        // Tag group IDs
}
```

### Example: Display Tags

```tsx
function TagList() {
  const [tags, setTags] = useState<EagleTag[]>([]);

  useEffect(() => {
    eagleApi.tag.getAll().then(setTags);
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span
          key={tag.id}
          className="px-2 py-1 rounded-full text-sm"
          style={{ backgroundColor: tag.color }}
        >
          {tag.name} ({tag.count})
        </span>
      ))}
    </div>
  );
}
```

## Get Tag by Name

Retrieve a specific tag by its name.

```tsx
const tag = await eagleApi.tag.get(name);
```

**Parameters:**
- `name: string` - The tag name to find

**Returns:** `Promise<EagleTag | null>`

```tsx
const tag = await eagleApi.tag.get('landscape');
if (tag) {
  console.log(`Tag "${tag.name}" used ${tag.count} times`);
}
```

## Create Tag

Create a new tag.

```tsx
const tag = await eagleApi.tag.create(options);
```

**Parameters:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | `string` | Yes | Tag name |
| `color` | `string` | No | Tag color (hex) |

**Returns:** `Promise<EagleTag>`

```tsx
const tag = await eagleApi.tag.create({
  name: 'processed',
  color: '#22c55e', // Green
});

console.log(`Created tag: ${tag.name} (${tag.id})`);
```

## Get Tag Groups

Retrieve all tag groups for organizing tags.

```tsx
const groups = await eagleApi.tag.getGroups();
```

**Returns:** `Promise<EagleTagGroup[]>`

### EagleTagGroup Type

```tsx
interface EagleTagGroup {
  id: string;
  name: string;
  tags: string[];  // Tag IDs in this group
  color: string;
}
```

```tsx
const groups = await eagleApi.tag.getGroups();
groups.forEach(group => {
  console.log(`${group.name}: ${group.tags.length} tags`);
});
```

## Common Patterns

### Ensure Tag Exists

Create a tag if it doesn't exist, otherwise return existing:

```tsx
async function ensureTag(name: string, color?: string): Promise<EagleTag> {
  const existing = await eagleApi.tag.get(name);
  if (existing) return existing;
  
  return await eagleApi.tag.create({ name, color });
}

// Usage
const tag = await ensureTag('plugin-output', '#3b82f6');
```

### Get or Create Multiple Tags

```tsx
async function ensureTags(names: string[]): Promise<EagleTag[]> {
  const allTags = await eagleApi.tag.getAll();
  const tagMap = new Map(allTags.map(t => [t.name.toLowerCase(), t]));
  
  const result: EagleTag[] = [];
  
  for (const name of names) {
    const existing = tagMap.get(name.toLowerCase());
    if (existing) {
      result.push(existing);
    } else {
      const newTag = await eagleApi.tag.create({ name });
      result.push(newTag);
    }
  }
  
  return result;
}

// Usage
const tags = await ensureTags(['processed', 'landscape', 'hdr']);
```

### Tag Statistics

```tsx
async function getTagStats() {
  const tags = await eagleApi.tag.getAll();
  
  const totalTags = tags.length;
  const totalTagged = tags.reduce((sum, t) => sum + t.count, 0);
  const mostUsed = tags.sort((a, b) => b.count - a.count)[0];
  const unused = tags.filter(t => t.count === 0);
  
  return {
    totalTags,
    totalTagged,
    mostUsed,
    unusedCount: unused.length,
  };
}
```

### Filter Tags by Color

```tsx
async function getTagsByColor(color: string) {
  const tags = await eagleApi.tag.getAll();
  return tags.filter(tag => 
    tag.color.toLowerCase() === color.toLowerCase()
  );
}
```

## Add Tags to Items

Tags are added when creating or updating items:

```tsx
// Add item with tags
await eagleApi.item.addFromPath(filePath, {
  tags: ['processed', 'landscape', 'hdr'],
});

// Add tags to existing item (via item update)
// Note: This requires the full item update API
```

## Tag Colors

Common tag colors in Eagle:

| Color | Hex | Usage |
|-------|-----|-------|
| Red | `#ef4444` | Important, urgent |
| Orange | `#f97316` | In progress |
| Yellow | `#eab308` | Review needed |
| Green | `#22c55e` | Completed, approved |
| Blue | `#3b82f6` | Reference |
| Purple | `#a855f7` | Creative |
| Pink | `#ec4899` | Personal |
| Gray | `#6b7280` | Archived |

```tsx
const TAG_COLORS = {
  important: '#ef4444',
  inProgress: '#f97316',
  review: '#eab308',
  approved: '#22c55e',
  reference: '#3b82f6',
};

await eagleApi.tag.create({
  name: 'approved',
  color: TAG_COLORS.approved,
});
```

## Browser vs Eagle Behavior

| Method | Browser (Mock) | Eagle |
|--------|----------------|-------|
| `getAll()` | Returns mock tags | Returns real tags |
| `get(name)` | Returns mock tag | Returns real tag |
| `create()` | Simulates creation | Creates real tag |
| `getGroups()` | Returns mock groups | Returns real groups |

## Best Practices

### ✅ Do

```tsx
// Cache tags when used frequently
const [tagCache, setTagCache] = useState<Map<string, EagleTag>>(new Map());

// Use consistent tag naming
const TAG_PREFIX = 'plugin:';
await eagleApi.tag.create({ name: `${TAG_PREFIX}processed` });

// Normalize tag names for comparison
const normalizedName = tagName.toLowerCase().trim();
```

### ❌ Don't

```tsx
// Don't create duplicate tags
await eagleApi.tag.create({ name: 'Landscape' });
await eagleApi.tag.create({ name: 'landscape' }); // Duplicate!

// Don't fetch all tags in a loop
for (const item of items) {
  const tags = await eagleApi.tag.getAll(); // Expensive!
}
```

## Related

- [Eagle API Overview](./overview) - API introduction
- [Item Operations](./item-operations) - Add items with tags
- [Folder Operations](./folder-operations) - Folder management
