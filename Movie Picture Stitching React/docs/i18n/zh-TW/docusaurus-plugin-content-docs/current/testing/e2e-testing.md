# E2E 測試

端對端測試驗證完整的使用者工作流程與視覺外觀。Eagle React Template 使用 **Playwright** 進行 E2E 與視覺迴歸測試。

## 設定

### Playwright 設定

```typescript title="playwright.config.ts"
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## 執行 E2E 測試

```bash
# 執行所有 E2E 測試
npm run test:e2e

# 以有頭模式執行測試（看到瀏覽器）
npm run test:e2e -- --headed

# 執行特定測試檔案
npm run test:e2e -- e2e/navigation.spec.ts

# 在特定瀏覽器中執行測試
npm run test:e2e -- --project=chromium

# 使用檢查器的除錯模式
npm run test:e2e -- --debug

# 互動式產生測試程式碼
npx playwright codegen localhost:5173
```

## 基本 E2E 測試

### 導航測試

```typescript title="e2e/navigation.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('loads the home page', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Eagle React Template/);
    await expect(page.locator('header')).toBeVisible();
  });

  test('navigates between demo tabs', async ({ page }) => {
    await page.goto('/');
    
    // 點擊 Selection 分頁
    await page.click('button:has-text("Selection")');
    await expect(page.locator('[data-testid="selection-demo"]')).toBeVisible();
    
    // 點擊 Components 分頁
    await page.click('button:has-text("Components")');
    await expect(page.locator('[data-testid="components-demo"]')).toBeVisible();
    
    // 點擊 Forms 分頁
    await page.click('button:has-text("Forms")');
    await expect(page.locator('[data-testid="forms-demo"]')).toBeVisible();
  });

  test('preserves tab state on refresh', async ({ page }) => {
    await page.goto('/');
    
    // 導航到 Components 分頁
    await page.click('button:has-text("Components")');
    await expect(page.locator('[data-testid="components-demo"]')).toBeVisible();
    
    // 重新整理頁面
    await page.reload();
    
    // 應該仍在 Components 分頁
    await expect(page.locator('[data-testid="components-demo"]')).toBeVisible();
  });
});
```

### 元件互動測試

```typescript title="e2e/components.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Components")');
  });

  test('button click shows feedback', async ({ page }) => {
    const button = page.locator('button:has-text("Primary Button")');
    await button.click();
    
    // 驗證點擊已註冊（例如 toast 通知）
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('card expands on interaction', async ({ page }) => {
    const card = page.locator('[data-testid="expandable-card"]');
    const cardContent = card.locator('.card-content');
    
    await expect(cardContent).not.toBeVisible();
    
    await card.click();
    
    await expect(cardContent).toBeVisible();
  });
});
```

### Dialog 測試

```typescript title="e2e/dialogs.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Dialogs', () => {
  test('opens and closes dialog', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Dialogs")');
    
    // 開啟對話框
    await page.click('button:has-text("Open Dialog")');
    
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2')).toHaveText('Dialog Title');
    
    // 使用按鈕關閉
    await page.click('button:has-text("Close")');
    await expect(dialog).not.toBeVisible();
  });

  test('closes dialog with Escape key', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Dialogs")');
    await page.click('button:has-text("Open Dialog")');
    
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    await page.keyboard.press('Escape');
    
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('closes dialog by clicking overlay', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Dialogs")');
    await page.click('button:has-text("Open Dialog")');
    
    // 點擊對話框外部（覆蓋層）
    await page.click('[data-testid="dialog-overlay"]');
    
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
```

### 表單測試

```typescript title="e2e/forms.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Forms")');
  });

  test('validates required fields', async ({ page }) => {
    // 嘗試提交空表單
    await page.click('button:has-text("Submit")');
    
    // 應該顯示驗證錯誤
    await expect(page.locator('text=This field is required')).toBeVisible();
  });

  test('submits valid form', async ({ page }) => {
    // 填寫表單欄位
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.selectOption('select[name="category"]', 'option1');
    await page.check('input[name="terms"]');
    
    // 提交表單
    await page.click('button:has-text("Submit")');
    
    // 應該顯示成功訊息
    await expect(page.locator('text=Form submitted successfully')).toBeVisible();
  });

  test('slider updates value display', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    const display = page.locator('[data-testid="slider-value"]');
    
    // 取得初始值
    const initialValue = await display.textContent();
    
    // 移動滑桿
    await slider.fill('75');
    
    // 值顯示應該更新
    await expect(display).not.toHaveText(initialValue!);
    await expect(display).toHaveText('75');
  });
});
```

## 視覺迴歸測試

### 截圖比較

```typescript title="e2e/visual.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    
    // 等待動畫完成
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixels: 100,
    });
  });

  test('components demo matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Components")');
    
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('components-demo.png', {
      maxDiffPixels: 100,
    });
  });

  test('dark mode matches snapshot', async ({ page }) => {
    await page.goto('/');
    
    // 啟用深色模式
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      maxDiffPixels: 100,
    });
  });
});
```

### 元件截圖

```typescript title="e2e/component-visual.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Component Visual Tests', () => {
  test('button variants', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Components")');
    
    const buttonSection = page.locator('[data-testid="button-variants"]');
    
    await expect(buttonSection).toHaveScreenshot('button-variants.png');
  });

  test('card variants', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Components")');
    
    const cardSection = page.locator('[data-testid="card-variants"]');
    
    await expect(cardSection).toHaveScreenshot('card-variants.png');
  });

  test('form controls', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Forms")');
    
    const formSection = page.locator('[data-testid="form-controls"]');
    
    await expect(formSection).toHaveScreenshot('form-controls.png');
  });
});
```

### 更新快照

當進行有意的視覺變更時：

```bash
# 更新所有快照
npm run test:e2e -- --update-snapshots

# 更新特定測試的快照
npm run test:e2e -- --update-snapshots e2e/visual.spec.ts
```

## 主題測試

```typescript title="e2e/theme.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Theme', () => {
  test('toggles between light and dark mode', async ({ page }) => {
    await page.goto('/');
    
    // 檢查初始狀態（淺色模式）
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
    
    // 切換到深色模式
    await page.click('[data-testid="theme-toggle"]');
    await expect(html).toHaveClass(/dark/);
    
    // 切換回淺色模式
    await page.click('[data-testid="theme-toggle"]');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('persists theme preference', async ({ page }) => {
    await page.goto('/');
    
    // 設定深色模式
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // 重新載入頁面
    await page.reload();
    
    // 應該仍是深色模式
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('respects system preference', async ({ page }) => {
    // 模擬深色模式系統偏好
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    
    // 應該是深色模式
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
```

## i18n 測試

```typescript title="e2e/i18n.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('displays English by default', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toHaveText(/Eagle React Template/);
  });

  test('switches to Chinese', async ({ page }) => {
    await page.goto('/');
    
    // 開啟語言選擇器
    await page.click('[data-testid="language-selector"]');
    await page.click('text=中文');
    
    // 驗證出現中文文字
    await expect(page.locator('h1')).toContainText('Eagle');
    await expect(page.locator('nav')).toContainText('組件');
  });

  test('persists language preference', async ({ page }) => {
    await page.goto('/');
    
    // 設定中文
    await page.click('[data-testid="language-selector"]');
    await page.click('text=中文');
    
    // 重新載入
    await page.reload();
    
    // 應該仍是中文
    await expect(page.locator('nav')).toContainText('組件');
  });
});
```

## 無障礙測試

```typescript title="e2e/accessibility.spec.ts"
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('components demo has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Components")');
    
    const results = await new AxeBuilder({ page })
      .exclude('[data-testid="decorative-element"]') // 排除已知的裝飾性元素
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('dialogs have proper focus management', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Dialogs")');
    await page.click('button:has-text("Open Dialog")');
    
    // 焦點應該被困在對話框中
    const dialog = page.locator('[role="dialog"]');
    const focusedElement = page.locator(':focus');
    
    // 第一個可聚焦元素應該被聚焦
    await expect(focusedElement).toBeVisible();
    
    // 在對話框中按 Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // 焦點應該仍在對話框內
    const newFocused = await page.evaluate(() => 
      document.activeElement?.closest('[role="dialog"]') !== null
    );
    expect(newFocused).toBe(true);
  });

  test('supports keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // 按 Tab 瀏覽主導航
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('role', 'tab');
    
    // 方向鍵導航分頁
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    
    // 應該啟用該分頁
    await expect(page.locator('[data-testid="components-demo"]')).toBeVisible();
  });
});
```

## 效能測試

```typescript title="e2e/performance.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('homepage loads within performance budget', async ({ page }) => {
    await page.goto('/');
    
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        load: timing.loadEventEnd - timing.navigationStart,
      };
    });
    
    // 頁面應該在 3 秒內載入
    expect(performanceTiming.load).toBeLessThan(3000);
    // DOM 應該在 1.5 秒內可互動
    expect(performanceTiming.domContentLoaded).toBeLessThan(1500);
  });

  test('no layout shifts after initial load', async ({ page }) => {
    await page.goto('/');
    
    // 等待頁面穩定
    await page.waitForTimeout(1000);
    
    // 取得累積版面配置偏移
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 2000);
      });
    });
    
    // CLS 應該小於 0.1（良好分數）
    expect(cls).toBeLessThan(0.1);
  });
});
```

## Page Object Model

對於複雜測試，使用 Page Object Model 模式：

```typescript title="e2e/pages/DemoPage.ts"
import { Page, Locator } from '@playwright/test';

export class DemoPage {
  readonly page: Page;
  readonly selectionTab: Locator;
  readonly componentsTab: Locator;
  readonly formsTab: Locator;
  readonly dialogsTab: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.selectionTab = page.locator('button:has-text("Selection")');
    this.componentsTab = page.locator('button:has-text("Components")');
    this.formsTab = page.locator('button:has-text("Forms")');
    this.dialogsTab = page.locator('button:has-text("Dialogs")');
    this.themeToggle = page.locator('[data-testid="theme-toggle"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async switchToComponents() {
    await this.componentsTab.click();
  }

  async switchToForms() {
    await this.formsTab.click();
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }
}
```

**使用方式：**

```typescript title="e2e/demo.spec.ts"
import { test, expect } from '@playwright/test';
import { DemoPage } from './pages/DemoPage';

test('navigates using page object', async ({ page }) => {
  const demoPage = new DemoPage(page);
  
  await demoPage.goto();
  await demoPage.switchToComponents();
  
  await expect(page.locator('[data-testid="components-demo"]')).toBeVisible();
});
```

## CI/CD 整合

### GitHub Actions 設定

```yaml title=".github/workflows/e2e.yml"
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
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## 最佳實踐

### 1. 使用穩定選擇器

```typescript
// ❌ 不好：脆弱的選擇器
page.locator('.btn-primary.mt-4.shadow-lg');
page.locator('div > div > button');

// ✅ 好：穩定的選擇器
page.locator('[data-testid="submit-button"]');
page.locator('button:has-text("Submit")');
page.getByRole('button', { name: 'Submit' });
```

### 2. 正確等待元素

```typescript
// ❌ 不好：固定超時
await page.waitForTimeout(1000);

// ✅ 好：等待特定條件
await page.waitForSelector('[data-testid="loaded"]');
await expect(page.locator('.content')).toBeVisible();
```

### 3. 隔離測試

```typescript
// ❌ 不好：測試依賴前一個狀態
test('step 1', async ({ page }) => { ... });
test('step 2', async ({ page }) => { ... }); // 依賴 step 1

// ✅ 好：每個測試獨立
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // 設定全新狀態
});
```

## 相關資源

- [測試概觀](./overview.md) - 測試設定
- [元件測試](./component-testing.md) - 元件的單元測試
- [開發工作流程](../development/workflow.md) - 開發設定
