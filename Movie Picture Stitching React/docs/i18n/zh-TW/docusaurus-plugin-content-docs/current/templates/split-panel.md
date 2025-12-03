---
sidebar_position: 3
title: SplitPanelTemplate
description: 具有可折疊側邊欄的雙欄佈局
---

# SplitPanelTemplate

具有可折疊側邊欄的雙欄佈局，適用於導覽式 UI、檔案總管和分類驅動的介面。

## 匯入

```tsx
import { SplitPanelTemplate } from '@/templates';
```

## 基本用法

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

## 佈局結構

```
┌─────────────────────────────────────┐
│            標題列                    │
├──────────┬──────────────────────────┤
│          │                          │
│   側邊欄  │        children          │
│   內容   │                          │
│          │                          │
│  (280px) │       主要內容           │
│          │                          │
└──────────┴──────────────────────────┘

折疊時：
┌─────────────────────────────────────┐
│            標題列                    │
├─┬───────────────────────────────────┤
│◀│                                   │
│ │         children                  │
│ │                                   │
└─┴───────────────────────────────────┘
```

## Props

| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `children` | `ReactNode` | **必要** | 主要內容區域 |
| `sidebarContent` | `ReactNode` | **必要** | 側邊欄內容 |
| `sidebarWidth` | `number` | `280` | 側邊欄寬度（像素） |
| `collapsible` | `boolean` | `true` | 允許側邊欄折疊 |
| `defaultCollapsed` | `boolean` | `false` | 初始為折疊狀態 |
| `title` | `string` | `undefined` | 標題列標題 |
| `headerActions` | `ReactNode` | `undefined` | 標題列右側內容 |
| `sidebarClassName` | `string` | `''` | 側邊欄額外類別 |
| `contentClassName` | `string` | `''` | 內容額外類別 |

## 範例

### 導覽選單

```tsx
import { SplitPanelTemplate } from '@/templates';

const menuItems = [
  { id: 'home', label: '首頁', icon: Home },
  { id: 'images', label: '圖片', icon: Image },
  { id: 'folders', label: '資料夾', icon: Folder },
];

function NavigationPlugin() {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <SplitPanelTemplate
      title="檔案管理員"
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

### 資料夾樹狀瀏覽器

```tsx
function FolderExplorer() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { folders } = useFolders();

  return (
    <SplitPanelTemplate
      title="資料夾瀏覽器"
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
        <EmptyState message="選擇一個資料夾" />
      )}
    </SplitPanelTemplate>
  );
}
```

### 初始折疊

```tsx
function CompactPlugin() {
  return (
    <SplitPanelTemplate
      title="精簡檢視"
      defaultCollapsed={true}
      sidebarContent={<QuickActions />}
    >
      <MainView />
    </SplitPanelTemplate>
  );
}
```

### 不可折疊側邊欄

```tsx
function FixedSidebarPlugin() {
  return (
    <SplitPanelTemplate
      title="儀表板"
      collapsible={false}
      sidebarWidth={200}
      sidebarContent={<StaticMenu />}
    >
      <Dashboard />
    </SplitPanelTemplate>
  );
}
```

### 帶標題列操作

```tsx
function PluginWithActions() {
  return (
    <SplitPanelTemplate
      title="素材管理員"
      headerActions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            匯入
          </Button>
          <Button variant="primary" size="sm">
            新增資料夾
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

### 自訂樣式

```tsx
function StyledPlugin() {
  return (
    <SplitPanelTemplate
      title="風格化佈局"
      sidebarClassName="bg-gray-900 text-white"
      contentClassName="bg-gray-50 dark:bg-gray-800 p-6"
      sidebarContent={<DarkSidebar />}
    >
      <LightContent />
    </SplitPanelTemplate>
  );
}
```

## 側邊欄折疊行為

### 程式化控制

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

### 響應式行為

範本處理視窗大小調整：

- 展開時側邊欄保持固定寬度
- 內容區域填滿剩餘空間
- 折疊切換跨大小調整保留狀態

## 鍵盤導覽

當焦點在側邊欄時：

| 按鍵 | 操作 |
|------|------|
| `上下箭頭` | 導覽選單項目 |
| `Enter` | 選擇項目 |
| `Escape` | 折疊側邊欄（如果可折疊） |

## 最佳實踐

### ✅ 建議

```tsx
// 清晰的導覽結構
<SplitPanelTemplate
  sidebarContent={
    <nav>
      <SectionTitle>分類</SectionTitle>
      <NavItems items={categories} />
    </nav>
  }
>
  <CategoryView />
</SplitPanelTemplate>

// 使用適當的側邊欄寬度
<SplitPanelTemplate
  sidebarWidth={200}  // 圖示 + 文字的窄寬度
  sidebarContent={<CompactMenu />}
>
```

### ❌ 避免

```tsx
// 不要在側邊欄放複雜內容
<SplitPanelTemplate
  sidebarContent={
    <div>
      <ImageEditor />  {/* 對側邊欄太複雜 */}
      <Form />
    </div>
  }
>

// 不要讓側邊欄太寬
<SplitPanelTemplate
  sidebarWidth={500}  {/* 佔用太多空間 */}
>
```

## 使用時機

**使用 SplitPanelTemplate 的情況：**
- 建立導覽式 UI
- 需要分類/資料夾選擇
- 內容基於側邊欄選擇而變化
- 想要可折疊的次要面板

**考慮其他範本的情況：**
- 需要有區段的設定 → [`SettingsPanelTemplate`](./settings-panel)
- 需要三個面板 → [`ThreeColumnTemplate`](./three-column)
- 簡單單面板 UI → [`SinglePanelTemplate`](./single-panel)

## 相關資源

- [範本概覽](./overview) - 所有可用範本
- [ThreeColumnTemplate](./three-column) - 三面板佈局
