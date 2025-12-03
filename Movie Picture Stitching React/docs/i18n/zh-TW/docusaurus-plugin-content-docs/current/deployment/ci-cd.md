# CI/CD 管線

本指南說明如何為 Eagle 外掛程式設定持續整合和持續部署（CI/CD）管線。

## 概觀

CI/CD 管線自動化測試、建置和發布流程，確保程式碼品質並簡化部署工作流程。

## GitHub Actions 設定

### 目錄結構

```
.github/
└── workflows/
    ├── ci.yml           # 持續整合
    ├── release.yml      # 發布自動化
    └── docs.yml         # 文件部署
```

## 持續整合管線

### 基本 CI 工作流程

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Unit tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
  
  build:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7
```

### 矩陣測試策略

測試多個 Node.js 版本和作業系統：

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm test
```

## 發布工作流程

### 自動化版本發布

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    
    permissions:
      contents: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Create release package
        run: |
          # 創建發布目錄
          mkdir -p release
          
          # 複製建置檔案
          cp -r dist/* release/
          
          # 複製並轉換 manifest
          node -e "
            const manifest = require('./manifest.json');
            manifest.main.url = manifest.main.url.replace('dist/', '');
            if (manifest.logo) manifest.logo = manifest.logo.replace('public/', '');
            require('fs').writeFileSync('release/manifest.json', JSON.stringify(manifest, null, 2));
          "
          
          # 複製本地化和資源
          cp -r _locales release/
          cp -r public/* release/
          
          # 創建 ZIP 檔案
          cd release && zip -r ../plugin.zip .
      
      - name: Get version
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT
      
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: plugin.zip
          name: v${{ steps.version.outputs.VERSION }}
          body: |
            ## 變更內容
            
            請參閱 [CHANGELOG.md](CHANGELOG.md) 了解詳細變更。
            
            ## 安裝方式
            
            1. 下載 `plugin.zip`
            2. 解壓縮到 Eagle 外掛程式目錄
            3. 重新啟動 Eagle
          draft: false
          prerelease: ${{ contains(github.ref, '-beta') || contains(github.ref, '-alpha') }}
```

### 語意化發布

使用 semantic-release 自動化版本管理：

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release
```

**semantic-release 設定：**

```json
// package.json
{
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      ["@semantic-release/npm", { "npmPublish": false }],
      "@semantic-release/git",
      "@semantic-release/github"
    ]
  }
}
```

## 文件部署

### Docusaurus 到 GitHub Pages

```yaml
# .github/workflows/docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '.github/workflows/docs.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    defaults:
      run:
        working-directory: docs
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
          cache-dependency-path: docs/package-lock.json
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/build
          cname: your-docs-domain.com  # 選用
```

## E2E 測試管線

### Playwright 測試

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 視覺回歸測試

```yaml
# .github/workflows/visual.yml
name: Visual Regression

on:
  pull_request:
    branches: [main]

jobs:
  visual:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      
      - name: Run visual tests
        run: npm run test:visual
      
      - name: Upload diff images
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diff
          path: |
            **/*-diff.png
            **/*-actual.png
```

## 快取策略

### npm 依賴快取

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    cache: 'npm'  # 自動快取 node_modules
```

### Playwright 瀏覽器快取

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      playwright-${{ runner.os }}-
```

### 建置快取

```yaml
- name: Cache build
  uses: actions/cache@v4
  with:
    path: |
      dist
      .vite
    key: build-${{ runner.os }}-${{ hashFiles('src/**', 'package-lock.json') }}
```

## 環境變數與秘密

### 設定秘密

在 GitHub 儲存庫設定中添加秘密：
- `CODECOV_TOKEN` - 覆蓋率報告
- `NPM_TOKEN` - npm 發布（如適用）

### 使用環境變數

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    env:
      CI: true
      NODE_ENV: production
    
    steps:
      - run: npm run build
        env:
          VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
```

## 條件執行

### 路徑過濾

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - '.github/workflows/ci.yml'
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

### 分支保護

```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

### 手動觸發

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: '部署環境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```

## 完整 CI/CD 範例

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  release:
    types: [published]

env:
  NODE_VERSION: '20.x'

jobs:
  # 程式碼品質檢查
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
  
  # 單元測試
  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
  
  # 建置
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
  
  # E2E 測試
  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      - run: npm run test:e2e
  
  # 發布（僅限標籤）
  release:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest
    needs: [build, e2e]
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      - name: Package release
        run: |
          mkdir release
          cp -r dist/* release/
          node scripts/transform-manifest.js > release/manifest.json
          cp -r _locales release/
          cp -r public/* release/
          cd release && zip -r ../plugin.zip .
      - uses: softprops/action-gh-release@v1
        with:
          files: plugin.zip
```

## 疑難排解

### 常見問題

**npm ci 失敗**
- 確保 `package-lock.json` 已提交
- 檢查 Node.js 版本相容性

**測試在 CI 中失敗但本地通過**
- 檢查時區差異
- 驗證環境變數設定
- 確認 CI 環境與本地環境一致

**快取無效**
- 更新快取鍵的雜湊來源
- 手動清除 Actions 快取

### 除錯技巧

```yaml
- name: Debug info
  run: |
    echo "Node: $(node --version)"
    echo "npm: $(npm --version)"
    echo "PWD: $PWD"
    ls -la
```

## 相關資源

- [部署腳本](./deploy-script.md) - 手動部署
- [Manifest 設定](./manifest-config.md) - 外掛程式設定
- [E2E 測試](../testing/e2e-testing.md) - Playwright 測試
