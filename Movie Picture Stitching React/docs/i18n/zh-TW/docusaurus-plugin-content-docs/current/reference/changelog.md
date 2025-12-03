# 變更日誌

Eagle React Template 的所有重要變更都記錄在這裡。

本專案遵循[語意化版本](https://semver.org/)：
- **主版本** - 重大變更
- **次版本** - 新功能（向下相容）
- **修補版本** - 錯誤修復（向下相容）

## [未發布]

### 新增
- Docusaurus 文件網站
- Playwright 視覺回歸測試

### 變更
- 使用基於雜湊的變更偵測改進輪詢效能

---

## [1.0.0] - 2024-01-15

### 🎉 首次發布

Eagle React Template 首個穩定版本。

### 新增

#### 核心功能
- **雙環境模式** - 在瀏覽器中使用模擬 API 無縫開發
- **Eagle API 適配器** - 所有 Eagle Plugin API 方法的型別安全封裝
- **安全初始化** - 所有 API getter 都使用 try-catch 保護

#### 元件（共 18 個）
- **UI 元件：** Button、Card、Header、Toast
- **表單元件：** Input、Label、Select、Checkbox、Slider
- **覆蓋層元件：** Dialog、DropdownMenu、Tooltip、Popover
- **版面配置元件：** Tabs、ImageGrid、EagleImage
- **錯誤處理：** ErrorBoundary、ErrorFallback

#### Hooks（共 4 個）
- `useEagleSelection` - 基於輪詢的選取追蹤與最佳化
- `useTheme` - Eagle 主題同步
- `useLocalStorage` - 型別安全的持久化儲存
- `useLanguageSync` - 與 Eagle 的 i18n 同步

#### 模板（共 6 個）
- `SinglePanelTemplate` - 簡單聚焦版面配置
- `SplitPanelTemplate` - 側邊欄 + 內容模式
- `SettingsPanelTemplate` - 設定面板
- `BatchProcessTemplate` - 含進度的批次操作
- `ImageBrowserTemplate` - 圖片網格版面配置
- `ThreeColumnTemplate` - 複雜多欄版面配置

#### 狀態管理
- Zustand store 與切片架構
- 效能優化的記憶化選擇器
- LocalStorage 持久化中介軟體

#### 測試
- 1,040+ 個 Vitest 單元測試
- Testing Library 元件測試
- 覆蓋率閾值：60%/50%/50%/60%

#### 開發者體驗
- 完整 TypeScript 支援
- 路徑別名（@、@components、@hooks、@lib）
- 瀏覽器開發用模擬工廠
- Eagle 安裝用部署腳本

#### 國際化
- 8 種語言支援
- 從 Eagle 地區設定自動偵測
- 回退鏈處理

### 技術細節

- React 18 含並行功能
- TypeScript 5 嚴格模式
- Vite 5 建置系統
- Tailwind CSS 3 含設計令牌
- CVA 用於型別安全變體

---

## 版本歷史格式

每個版本項目遵循此結構：

```markdown
## [X.Y.Z] - YYYY-MM-DD

### 新增
- 新功能

### 變更
- 現有功能的變更

### 棄用
- 即將移除的功能

### 移除
- 已移除的功能

### 修復
- 錯誤修復

### 安全
- 安全性更新
```

---

## 貢獻變更日誌

進行變更時：

1. **在 [未發布] 區段新增項目**
2. **使用正確的類別：**
   - `新增` - 新功能
   - `變更` - 現有功能的變更
   - `棄用` - 即將移除的功能
   - `移除` - 已移除的功能
   - `修復` - 錯誤修復
   - `安全` - 安全性修補

3. **格式：**
   ```markdown
   - 變更的簡短描述 ([#123](link-to-pr))
   ```

4. **發布時：** 將 [未發布] 項目移至新版本區段

## 發布流程

1. 更新 `package.json` 中的版本
2. 更新 `manifest.json` 中的版本
3. 將 [未發布] 移至新版本區段
4. 建立 git 標籤：`git tag -a v1.0.0 -m "Release 1.0.0"`
5. 推送標籤：`git push origin v1.0.0`
6. GitHub Action 自動建立發布

## 連結

- [GitHub Releases](https://github.com/your-org/eagle-react-template/releases)
- [遷移指南](./migration-guide.md)
- [貢獻指南](./contributing.md)
