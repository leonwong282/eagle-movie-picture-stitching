---
sidebar_position: 3
title: 資料夾操作
description: 管理 Eagle 素材庫中的資料夾
---

# 資料夾操作

在 Eagle 素材庫中建立、擷取和管理資料夾。

## 匯入

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## 取得所有資料夾

擷取素材庫中的所有資料夾。

```tsx
const folders = await eagleApi.folder.getAll();
```

**回傳：** `Promise<EagleFolder[]>`

### EagleFolder 類型

```tsx
interface EagleFolder {
  id: string;              // 唯一資料夾 ID
  name: string;            // 資料夾名稱
  description: string;     // 資料夾描述
  icon: string;            // 圖示識別碼
  iconColor: string;       // 圖示顏色（十六進位）
  children: EagleFolder[]; // 巢狀子資料夾
  modificationTime: number; // 最後修改時間（Unix 毫秒）
  tags: string[];          // 關聯標籤
  password: string;        // 資料夾密碼（如有保護）
  passwordTips: string;    // 密碼提示
}
```

### 範例：建立資料夾樹

```tsx
function FolderTree() {
  const [folders, setFolders] = useState<EagleFolder[]>([]);

  useEffect(() => {
    eagleApi.folder.getAll().then(setFolders);
  }, []);

  const renderFolder = (folder: EagleFolder, depth = 0) => (
    <div key={folder.id} style={{ marginLeft: depth * 16 }}>
      <span style={{ color: folder.iconColor }}>{folder.icon}</span>
      {folder.name}
      {folder.children.map(child => renderFolder(child, depth + 1))}
    </div>
  );

  return <div>{folders.map(f => renderFolder(f))}</div>;
}
```

## 取得選取的資料夾

取得 Eagle 側邊欄中目前選取的資料夾。

```tsx
const folder = await eagleApi.folder.getSelected();
```

**回傳：** `Promise<EagleFolder | null>`

```tsx
async function addToCurrentFolder(filePath: string) {
  const selectedFolder = await eagleApi.folder.getSelected();
  
  await eagleApi.item.addFromPath(filePath, {
    folders: selectedFolder ? [selectedFolder.id] : [],
  });
}
```

## 依 ID 取得資料夾

依 ID 擷取特定資料夾。

```tsx
const folder = await eagleApi.folder.getById(folderId);
```

**回傳：** `Promise<EagleFolder | null>`

```tsx
const folder = await eagleApi.folder.getById('FOLDER123');
if (folder) {
  console.log(`資料夾：${folder.name}`);
  console.log(`子資料夾：${folder.children.length}`);
}
```

## 取得最近資料夾

取得最近存取的資料夾。

```tsx
const recentFolders = await eagleApi.folder.getRecent();
```

**回傳：** `Promise<EagleFolder[]>`

```tsx
function RecentFolders() {
  const [folders, setFolders] = useState<EagleFolder[]>([]);

  useEffect(() => {
    eagleApi.folder.getRecent().then(setFolders);
  }, []);

  return (
    <div>
      <h3>最近資料夾</h3>
      {folders.map(folder => (
        <div key={folder.id}>{folder.name}</div>
      ))}
    </div>
  );
}
```

## 建立資料夾

在素材庫中建立新資料夾。

```tsx
const folder = await eagleApi.folder.create(options);
```

**參數：**

| 選項 | 類型 | 必要 | 說明 |
|------|------|------|------|
| `name` | `string` | 是 | 資料夾名稱 |
| `parent` | `string` | 否 | 父資料夾 ID |
| `description` | `string` | 否 | 資料夾描述 |
| `icon` | `string` | 否 | 圖示識別碼 |
| `iconColor` | `string` | 否 | 圖示顏色（十六進位） |

**回傳：** `Promise<EagleFolder>`

### 範例：建立輸出資料夾

```tsx
async function createOutputFolder() {
  const folder = await eagleApi.folder.create({
    name: `外掛輸出 - ${new Date().toLocaleDateString()}`,
    description: '由我的外掛產生',
    icon: 'folder',
    iconColor: '#22c55e', // 綠色
  });
  
  return folder.id;
}
```

### 範例：建立巢狀資料夾

```tsx
async function createSubfolder(parentId: string, name: string) {
  const folder = await eagleApi.folder.create({
    name,
    parent: parentId,
  });
  
  return folder;
}
```

## 更新資料夾

修改資料夾屬性。

```tsx
await eagleApi.folder.update(folderId, updates);
```

**參數：**

| 參數 | 類型 | 說明 |
|------|------|------|
| `folderId` | `string` | 要更新的資料夾 ID |
| `updates.name` | `string` | 新名稱 |
| `updates.description` | `string` | 新描述 |
| `updates.icon` | `string` | 新圖示 |
| `updates.iconColor` | `string` | 新顏色 |

```tsx
await eagleApi.folder.update('FOLDER123', {
  name: '重新命名的資料夾',
  iconColor: '#3b82f6', // 藍色
});
```

## 導覽到資料夾

在 Eagle 主視窗中開啟資料夾。

```tsx
await eagleApi.folder.open(folderId);
```

```tsx
// 建立後導覽到資料夾
const folder = await eagleApi.folder.create({ name: '新資料夾' });
await eagleApi.folder.open(folder.id);
```

## 資料夾工具

### 扁平化資料夾樹

```tsx
function flattenFolders(folders: EagleFolder[]): EagleFolder[] {
  return folders.reduce((acc, folder) => {
    return [...acc, folder, ...flattenFolders(folder.children)];
  }, [] as EagleFolder[]);
}

// 使用方式
const allFolders = await eagleApi.folder.getAll();
const flatList = flattenFolders(allFolders);
console.log(`總資料夾數：${flatList.length}`);
```

### 依名稱尋找資料夾

```tsx
function findFolderByName(
  folders: EagleFolder[],
  name: string
): EagleFolder | undefined {
  for (const folder of folders) {
    if (folder.name === name) return folder;
    const found = findFolderByName(folder.children, name);
    if (found) return found;
  }
  return undefined;
}

// 使用方式
const allFolders = await eagleApi.folder.getAll();
const outputFolder = findFolderByName(allFolders, '外掛輸出');
```

### 取得資料夾路徑

```tsx
function getFolderPath(
  folders: EagleFolder[],
  targetId: string,
  path: string[] = []
): string[] | null {
  for (const folder of folders) {
    const currentPath = [...path, folder.name];
    if (folder.id === targetId) return currentPath;
    const found = getFolderPath(folder.children, targetId, currentPath);
    if (found) return found;
  }
  return null;
}

// 使用方式
const allFolders = await eagleApi.folder.getAll();
const path = getFolderPath(allFolders, 'FOLDER123');
// ['根資料夾', '子資料夾', '目標資料夾']
```

## 瀏覽器 vs Eagle 行為

| 方法 | 瀏覽器（模擬） | Eagle |
|------|----------------|-------|
| `getAll()` | 回傳模擬資料夾 | 回傳真實資料夾 |
| `getSelected()` | 回傳 null 或模擬 | 回傳選取的資料夾 |
| `create()` | 模擬建立 | 建立真實資料夾 |
| `open()` | 無操作 | 導覽到資料夾 |

## 最佳實踐

### ✅ 建議

```tsx
// 如果需要多次使用則快取資料夾列表
const folders = await eagleApi.folder.getAll();
const folderMap = new Map(flattenFolders(folders).map(f => [f.id, f]));

// 建立描述性資料夾名稱
await eagleApi.folder.create({
  name: `匯出 ${format.toUpperCase()} - ${date}`,
  description: '由外掛自動產生',
});
```

### ❌ 避免

```tsx
// 不要在迴圈中重複呼叫 getAll()
for (const item of items) {
  const folders = await eagleApi.folder.getAll(); // 昂貴！
  // ...
}

// 不要建立重複名稱的資料夾而不檢查
await eagleApi.folder.create({ name: '輸出' }); // 可能衝突
```

## 相關資源

- [Eagle API 概覽](./overview) - API 介紹
- [項目操作](./item-operations) - 將項目加入資料夾
- [標籤操作](./tag-operations) - 標籤管理
