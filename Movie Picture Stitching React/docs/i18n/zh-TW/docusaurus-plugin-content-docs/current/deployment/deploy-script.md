# 部署腳本

本指南說明用於將建置外掛程式部署到 Eagle 外掛程式目錄的 `scripts/deploy.js` 腳本。

## 概觀

部署腳本會自動化將您的外掛程式安裝到 Eagle 外掛程式目錄的過程，使其可以在 Eagle 應用程式中使用。它處理跨平台的路徑差異並在複製過程中轉換 manifest 路徑。

## 使用方式

```bash
# 建置並部署到 Eagle
npm run deploy
```

這將執行 `vite build` 然後執行部署腳本。

## 腳本運作原理

### 1. 平台偵測

腳本會偵測作業系統並解析正確的 Eagle 外掛程式目錄：

```javascript
const getEaglePluginsDir = () => {
  switch (process.platform) {
    case 'darwin':  // macOS
      return path.join(
        os.homedir(),
        'Library/Application Support/Eagle/plugins'
      );
    case 'win32':   // Windows
      return path.join(
        process.env.APPDATA || '',
        'Eagle/plugins'
      );
    default:
      throw new Error(`不支援的平台: ${process.platform}`);
  }
};
```

### 2. 目的地目錄

外掛程式會部署到以外掛程式 ID 命名的目錄：

```javascript
const pluginId = manifest.id;  // 來自 manifest.json
const destDir = path.join(eaglePluginsDir, pluginId);
```

### 3. Manifest 路徑轉換

**關鍵功能：** 腳本在複製過程中轉換 manifest.json 中的路徑：

| 開發路徑 | 部署路徑 |
|----------|----------|
| `dist/index.html` | `index.html` |
| `public/logo.png` | `logo.png` |

```javascript
const transformManifest = (manifest) => {
  const transformed = { ...manifest };
  
  // 轉換主 URL
  if (transformed.main?.url) {
    transformed.main.url = transformed.main.url.replace('dist/', '');
  }
  
  // 轉換 logo 路徑
  if (transformed.logo) {
    transformed.logo = transformed.logo.replace('public/', '');
  }
  
  return transformed;
};
```

這讓您在開發時可以保持正確的結構（`dist/` 用於建置輸出，`public/` 用於靜態資源），同時部署時有扁平化的結構。

### 4. 檔案複製

腳本複製：

1. **建置輸出** (`dist/*` → 根目錄)
2. **Manifest**（經轉換）
3. **本地化檔案** (`_locales/`)
4. **公開資源** (`public/*` → 根目錄)

```javascript
const copyFiles = async (sourceDir, destDir) => {
  // 清除舊部署
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });
  
  // 複製建置輸出
  await copyDir(path.join(sourceDir, 'dist'), destDir);
  
  // 複製轉換後的 manifest
  const manifestContent = await fs.readFile(
    path.join(sourceDir, 'manifest.json'),
    'utf-8'
  );
  const manifest = JSON.parse(manifestContent);
  const transformed = transformManifest(manifest);
  await fs.writeFile(
    path.join(destDir, 'manifest.json'),
    JSON.stringify(transformed, null, 2)
  );
  
  // 複製本地化檔案
  await copyDir(
    path.join(sourceDir, '_locales'),
    path.join(destDir, '_locales')
  );
  
  // 複製公開資源（扁平化到根目錄）
  await copyDir(
    path.join(sourceDir, 'public'),
    destDir
  );
};
```

## 完整腳本

```javascript
// scripts/deploy.js
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 平台特定的外掛程式目錄
const getEaglePluginsDir = () => {
  switch (process.platform) {
    case 'darwin':
      return path.join(os.homedir(), 'Library/Application Support/Eagle/plugins');
    case 'win32':
      return path.join(process.env.APPDATA || '', 'Eagle/plugins');
    default:
      throw new Error(`不支援的平台: ${process.platform}`);
  }
};

// 轉換 manifest 路徑用於部署
const transformManifest = (manifest) => {
  const transformed = { ...manifest };
  
  if (transformed.main?.url) {
    transformed.main.url = transformed.main.url.replace('dist/', '');
  }
  
  if (transformed.logo) {
    transformed.logo = transformed.logo.replace('public/', '');
  }
  
  return transformed;
};

// 遞迴複製目錄
const copyDir = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
};

// 主部署函數
const deploy = async () => {
  try {
    // 讀取 manifest 取得外掛程式 ID
    const manifestPath = path.join(projectRoot, 'manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    
    // 取得目的地路徑
    const eaglePluginsDir = getEaglePluginsDir();
    const destDir = path.join(eaglePluginsDir, manifest.id);
    
    console.log(`正在部署 ${manifest.name} 到 ${destDir}...`);
    
    // 清除舊部署
    await fs.rm(destDir, { recursive: true, force: true });
    await fs.mkdir(destDir, { recursive: true });
    
    // 複製建置輸出
    const distDir = path.join(projectRoot, 'dist');
    await copyDir(distDir, destDir);
    console.log('✓ 已複製建置輸出');
    
    // 複製轉換後的 manifest
    const transformed = transformManifest(manifest);
    await fs.writeFile(
      path.join(destDir, 'manifest.json'),
      JSON.stringify(transformed, null, 2)
    );
    console.log('✓ 已複製轉換後的 manifest');
    
    // 複製本地化檔案
    const localesDir = path.join(projectRoot, '_locales');
    await copyDir(localesDir, path.join(destDir, '_locales'));
    console.log('✓ 已複製本地化檔案');
    
    // 複製公開資源
    const publicDir = path.join(projectRoot, 'public');
    const publicEntries = await fs.readdir(publicDir, { withFileTypes: true });
    for (const entry of publicEntries) {
      const srcPath = path.join(publicDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
    console.log('✓ 已複製公開資源');
    
    console.log(`\n✅ 成功部署到 ${destDir}`);
    console.log('\n請重新啟動 Eagle 以載入外掛程式。');
    
  } catch (error) {
    console.error('部署失敗:', error.message);
    process.exit(1);
  }
};

deploy();
```

## 部署後結構

部署後，外掛程式目錄結構：

```
~/Library/Application Support/Eagle/plugins/
└── your-plugin-id/
    ├── manifest.json       # 轉換後的路徑
    ├── index.html          # 來自 dist/
    ├── assets/             # 來自 dist/assets/
    │   ├── index-xxx.js
    │   └── index-xxx.css
    ├── logo.png            # 來自 public/
    └── _locales/
        ├── en.json
        ├── zh_CN.json
        └── ...
```

## 已知限制

### 平台支援

- ✅ macOS（`darwin`）
- ✅ Windows（`win32`）
- ❌ Linux（Eagle 不支援）

### 需要重新啟動

部署後，您必須**重新啟動 Eagle** 才能載入新的外掛程式檔案。簡單地重新載入外掛程式可能無法取得更新的 JavaScript 模組。

### 快取注意事項

Eagle 會積極地快取外掛程式資源。如果更新沒有出現：

1. 完全關閉 Eagle
2. 重新啟動 Eagle
3. 在外掛程式設定中停用/重新啟用外掛程式

## 自訂腳本

您可以修改腳本以滿足您的需求：

### 添加額外檔案

```javascript
// 複製額外目錄
const additionalDirs = ['assets', 'data'];
for (const dir of additionalDirs) {
  const srcDir = path.join(projectRoot, dir);
  if (await fs.access(srcDir).then(() => true).catch(() => false)) {
    await copyDir(srcDir, path.join(destDir, dir));
    console.log(`✓ 已複製 ${dir}`);
  }
}
```

### 部署前驗證

```javascript
// 在部署前驗證建置
const validateBuild = async () => {
  const requiredFiles = ['dist/index.html', 'dist/assets'];
  
  for (const file of requiredFiles) {
    const filePath = path.join(projectRoot, file);
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`缺少必要檔案: ${file}`);
    }
  }
};

// 在 deploy() 函數中
await validateBuild();
```

### 備份先前部署

```javascript
// 在覆蓋前備份
const backupDir = `${destDir}-backup-${Date.now()}`;
try {
  await fs.access(destDir);
  await fs.rename(destDir, backupDir);
  console.log(`✓ 已備份先前部署到 ${backupDir}`);
} catch {
  // 沒有先前部署
}
```

## 疑難排解

### 權限被拒絕

如果您遇到權限錯誤：

```bash
# macOS
chmod -R u+w ~/Library/Application\ Support/Eagle/plugins/

# Windows（以管理員身份執行）
icacls "%APPDATA%\Eagle\plugins" /grant %USERNAME%:F
```

### 找不到外掛程式目錄

確保 Eagle 已經執行至少一次以創建外掛程式目錄。您也可以手動創建：

```bash
# macOS
mkdir -p ~/Library/Application\ Support/Eagle/plugins/

# Windows
mkdir "%APPDATA%\Eagle\plugins"
```

### 建置輸出遺失

確保在部署前執行了建置步驟：

```bash
npm run build    # 先建置
npm run deploy   # 然後部署
```

## 相關資源

- [Manifest 設定](./manifest-config.md) - manifest.json 選項
- [CI/CD 管線](./ci-cd.md) - 自動化部署
- [建置設定](../development/build-config.md) - Vite 建置選項
