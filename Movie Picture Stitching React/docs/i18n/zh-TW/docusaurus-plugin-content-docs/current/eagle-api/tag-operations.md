---
sidebar_position: 4
title: 標籤操作
description: 管理 Eagle 素材庫中的標籤和標籤群組
---

# 標籤操作

在 Eagle 素材庫中建立、擷取和管理用於組織項目的標籤。

## 匯入

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## 取得所有標籤

擷取所有標籤及其使用次數。

```tsx
const tags = await eagleApi.tag.getAll();
```

**回傳：** `Promise<EagleTag[]>`

### EagleTag 類型

```tsx
interface EagleTag {
  id: string;              // 唯一標籤 ID  
  name: string;            // 標籤名稱
  color: string;           // 標籤顏色（十六進位）
  count: number;           // 使用此標籤的項目數量
  groups: string[];        // 標籤群組 ID
}
```

### 範例：顯示標籤

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

## 依名稱取得標籤

依名稱擷取特定標籤。

```tsx
const tag = await eagleApi.tag.get(name);
```

**參數：**
- `name: string` - 要尋找的標籤名稱

**回傳：** `Promise<EagleTag | null>`

```tsx
const tag = await eagleApi.tag.get('landscape');
if (tag) {
  console.log(`標籤「${tag.name}」已使用 ${tag.count} 次`);
}
```

## 建立標籤

建立新標籤。

```tsx
const tag = await eagleApi.tag.create(options);
```

**參數：**

| 選項 | 類型 | 必要 | 說明 |
|------|------|------|------|
| `name` | `string` | 是 | 標籤名稱 |
| `color` | `string` | 否 | 標籤顏色（十六進位） |

**回傳：** `Promise<EagleTag>`

```tsx
const tag = await eagleApi.tag.create({
  name: 'processed',
  color: '#22c55e', // 綠色
});

console.log(`已建立標籤：${tag.name}（${tag.id}）`);
```

## 取得標籤群組

擷取所有用於組織標籤的標籤群組。

```tsx
const groups = await eagleApi.tag.getGroups();
```

**回傳：** `Promise<EagleTagGroup[]>`

### EagleTagGroup 類型

```tsx
interface EagleTagGroup {
  id: string;
  name: string;
  tags: string[];  // 此群組中的標籤 ID
  color: string;
}
```

```tsx
const groups = await eagleApi.tag.getGroups();
groups.forEach(group => {
  console.log(`${group.name}：${group.tags.length} 個標籤`);
});
```

## 常見模式

### 確保標籤存在

如果標籤不存在則建立，否則回傳現有標籤：

```tsx
async function ensureTag(name: string, color?: string): Promise<EagleTag> {
  const existing = await eagleApi.tag.get(name);
  if (existing) return existing;
  
  return await eagleApi.tag.create({ name, color });
}

// 使用方式
const tag = await ensureTag('plugin-output', '#3b82f6');
```

### 取得或建立多個標籤

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

// 使用方式
const tags = await ensureTags(['processed', 'landscape', 'hdr']);
```

### 標籤統計

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

### 依顏色篩選標籤

```tsx
async function getTagsByColor(color: string) {
  const tags = await eagleApi.tag.getAll();
  return tags.filter(tag => 
    tag.color.toLowerCase() === color.toLowerCase()
  );
}
```

## 為項目新增標籤

建立或更新項目時新增標籤：

```tsx
// 新增帶有標籤的項目
await eagleApi.item.addFromPath(filePath, {
  tags: ['processed', 'landscape', 'hdr'],
});

// 為現有項目新增標籤（透過項目更新 API）
// 注意：這需要完整的項目更新 API
```

## 標籤顏色

Eagle 中常見的標籤顏色：

| 顏色 | 十六進位 | 用途 |
|------|----------|------|
| 紅色 | `#ef4444` | 重要、緊急 |
| 橙色 | `#f97316` | 進行中 |
| 黃色 | `#eab308` | 需要審核 |
| 綠色 | `#22c55e` | 已完成、已批准 |
| 藍色 | `#3b82f6` | 參考資料 |
| 紫色 | `#a855f7` | 創意 |
| 粉色 | `#ec4899` | 個人 |
| 灰色 | `#6b7280` | 已封存 |

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

## 瀏覽器 vs Eagle 行為

| 方法 | 瀏覽器（模擬） | Eagle |
|------|----------------|-------|
| `getAll()` | 回傳模擬標籤 | 回傳真實標籤 |
| `get(name)` | 回傳模擬標籤 | 回傳真實標籤 |
| `create()` | 模擬建立 | 建立真實標籤 |
| `getGroups()` | 回傳模擬群組 | 回傳真實群組 |

## 最佳實踐

### ✅ 建議

```tsx
// 頻繁使用時快取標籤
const [tagCache, setTagCache] = useState<Map<string, EagleTag>>(new Map());

// 使用一致的標籤命名
const TAG_PREFIX = 'plugin:';
await eagleApi.tag.create({ name: `${TAG_PREFIX}processed` });

// 正規化標籤名稱以便比較
const normalizedName = tagName.toLowerCase().trim();
```

### ❌ 避免

```tsx
// 不要建立重複的標籤
await eagleApi.tag.create({ name: 'Landscape' });
await eagleApi.tag.create({ name: 'landscape' }); // 重複！

// 不要在迴圈中取得所有標籤
for (const item of items) {
  const tags = await eagleApi.tag.getAll(); // 昂貴！
}
```

## 相關資源

- [Eagle API 概覽](./overview) - API 介紹
- [項目操作](./item-operations) - 新增帶有標籤的項目
- [資料夾操作](./folder-operations) - 資料夾管理
