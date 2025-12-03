---
sidebar_position: 4
title: SettingsPanelTemplate
description: 具有區段導覽和操作按鈕的設定佈局
---

# SettingsPanelTemplate

專為外掛設定頁面設計的佈局，具有區段導覽、儲存/重設操作和表單驗證支援。

## 匯入

```tsx
import { SettingsPanelTemplate } from '@/templates';
```

## 基本用法

```tsx
import { SettingsPanelTemplate } from '@/templates';

const sections = [
  { id: 'general', label: '一般', icon: Settings },
  { id: 'export', label: '匯出', icon: Download },
  { id: 'advanced', label: '進階', icon: Sliders },
];

function PluginSettings() {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <SettingsPanelTemplate
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onSave={handleSave}
      onReset={handleReset}
    >
      <SettingsContent section={activeSection} />
    </SettingsPanelTemplate>
  );
}
```

## 佈局結構

```
┌─────────────────────────────────────┐
│  設定               [儲存][重設]    │  ← 帶操作的標題列
├──────────┬──────────────────────────┤
│          │                          │
│ 一般     │  區段標題                 │
│ 匯出     │  ┌─────────────────────┐ │
│ 進階     │  │ 設定項目 1          │ │
│          │  │ 設定項目 2          │ │
│          │  │ 設定項目 3          │ │
│          │  └─────────────────────┘ │
│          │                          │
└──────────┴──────────────────────────┘
```

## Props

| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `children` | `ReactNode` | **必要** | 設定內容 |
| `sections` | `Section[]` | **必要** | 導覽區段陣列 |
| `activeSection` | `string` | `undefined` | 目前啟用的區段 ID |
| `onSectionChange` | `(id: string) => void` | `undefined` | 區段變更處理器 |
| `onSave` | `() => void \| Promise<void>` | `undefined` | 儲存按鈕處理器 |
| `onReset` | `() => void` | `undefined` | 重設按鈕處理器 |
| `isSaving` | `boolean` | `false` | 在儲存時顯示載入狀態 |
| `hasChanges` | `boolean` | `false` | 為 true 時啟用儲存按鈕 |
| `showNav` | `boolean` | `true` | 顯示區段導覽 |
| `title` | `string` | `'Settings'` | 標題列標題 |
| `saveLabel` | `string` | `'Save'` | 儲存按鈕文字 |
| `resetLabel` | `string` | `'Reset'` | 重設按鈕文字 |

### Section 類型

```tsx
interface Section {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}
```

## 範例

### 完整設定頁面

```tsx
import { SettingsPanelTemplate } from '@/templates';
import { Settings, Download, Palette, Bell } from 'lucide-react';

const sections = [
  { id: 'general', label: '一般', icon: Settings },
  { id: 'export', label: '匯出', icon: Download },
  { id: 'appearance', label: '外觀', icon: Palette },
  { id: 'notifications', label: '通知', icon: Bell, badge: 3 },
];

function FullSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState(defaultSettings);
  const [originalSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings(settings);
      toast.success('設定已儲存');
    } catch (error) {
      toast.error('儲存失敗');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
  };

  return (
    <SettingsPanelTemplate
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onSave={handleSave}
      onReset={handleReset}
      isSaving={isSaving}
      hasChanges={hasChanges}
    >
      {activeSection === 'general' && (
        <GeneralSettings settings={settings} onChange={setSettings} />
      )}
      {activeSection === 'export' && (
        <ExportSettings settings={settings} onChange={setSettings} />
      )}
      {activeSection === 'appearance' && (
        <AppearanceSettings settings={settings} onChange={setSettings} />
      )}
      {activeSection === 'notifications' && (
        <NotificationSettings settings={settings} onChange={setSettings} />
      )}
    </SettingsPanelTemplate>
  );
}
```

### 區段內容元件

```tsx
function GeneralSettings({ settings, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">一般設定</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">自動儲存</label>
              <p className="text-sm text-gray-500">
                自動儲存變更
              </p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => 
                onChange({ ...settings, autoSave: checked })
              }
            />
          </div>

          <div>
            <label className="font-medium block mb-2">預設格式</label>
            <Select
              value={settings.defaultFormat}
              onValueChange={(value) =>
                onChange({ ...settings, defaultFormat: value })
              }
            >
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 無導覽

```tsx
function SimpleSettings() {
  return (
    <SettingsPanelTemplate
      showNav={false}
      onSave={handleSave}
      onReset={handleReset}
      hasChanges={true}
    >
      <div className="space-y-4 p-4">
        <SettingItem label="品質" />
        <SettingItem label="格式" />
        <SettingItem label="輸出路徑" />
      </div>
    </SettingsPanelTemplate>
  );
}
```

### 帶表單驗證

```tsx
import { useForm } from 'react-hook-form';

function ValidatedSettings() {
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: loadSettings(),
  });

  return (
    <SettingsPanelTemplate
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onSave={handleSubmit(onSubmit)}
      onReset={() => reset()}
      hasChanges={formState.isDirty}
      isSaving={formState.isSubmitting}
    >
      <form className="space-y-4">
        <Input
          {...register('name', { required: true })}
          error={formState.errors.name?.message}
        />
        <Input
          {...register('email', { 
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
          })}
          error={formState.errors.email?.message}
        />
      </form>
    </SettingsPanelTemplate>
  );
}
```

### 帶區段徽章

```tsx
const sections = [
  { id: 'general', label: '一般', icon: Settings },
  { id: 'updates', label: '更新', icon: RefreshCw, badge: 2 },
  { id: 'issues', label: '問題', icon: AlertCircle, badge: '!' },
];

function SettingsWithBadges() {
  return (
    <SettingsPanelTemplate
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {/* 徽章顯示通知數量或狀態 */}
    </SettingsPanelTemplate>
  );
}
```

## 操作按鈕狀態

### 儲存按鈕

| 狀態 | `hasChanges` | `isSaving` | 按鈕狀態 |
|------|--------------|------------|----------|
| 無變更 | `false` | `false` | 停用 |
| 有變更 | `true` | `false` | 啟用 |
| 儲存中 | `true` | `true` | 載入動畫 |

### 重設按鈕

| 狀態 | `hasChanges` | 按鈕狀態 |
|------|--------------|----------|
| 無變更 | `false` | 停用 |
| 有變更 | `true` | 啟用 |

## 鍵盤導覽

| 按鍵 | 操作 |
|------|------|
| `Ctrl/Cmd + S` | 觸發儲存（當 hasChanges 時） |
| `Escape` | 觸發重設確認 |
| `上下箭頭` | 導覽區段 |

## 最佳實踐

### ✅ 建議

```tsx
// 群組相關設定
<SettingsPanelTemplate sections={[
  { id: 'general', label: '一般' },
  { id: 'export', label: '匯出' },
]}>
  <SettingsGroup title="輸出">
    <Setting label="格式" />
    <Setting label="品質" />
  </SettingsGroup>
</SettingsPanelTemplate>

// 正確追蹤變更
const hasChanges = useMemo(
  () => JSON.stringify(current) !== JSON.stringify(original),
  [current, original]
);
```

### ❌ 避免

```tsx
// 不要放無關內容
<SettingsPanelTemplate>
  <ImageEditor />  {/* 與設定無關 */}
</SettingsPanelTemplate>

// 不要在沒有變更時啟用儲存
<SettingsPanelTemplate
  hasChanges={true}  // 永遠為 true = 令人困惑的 UX
>
```

## 使用時機

**使用 SettingsPanelTemplate 的情況：**
- 建立外掛偏好設定/設定
- 需要區段式導覽
- 需要儲存/重設功能
- 有多個設定分類

**考慮其他範本的情況：**
- 無區段的簡單表單 → [`SinglePanelTemplate`](./single-panel)
- 檔案/資料夾導覽 → [`SplitPanelTemplate`](./split-panel)
- 處理操作 → [`BatchProcessTemplate`](./batch-process)

## 相關資源

- [範本概覽](./overview) - 所有可用範本
- [表單元件](../components/form/input) - 表單輸入
- [useLocalStorage](../hooks/use-local-storage) - 持久化設定
