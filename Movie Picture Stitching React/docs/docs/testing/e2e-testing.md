# E2E Testing

End-to-end testing validates complete user workflows and visual appearance. The Eagle React Template uses **Playwright** for E2E and visual regression testing.

## Configuration

### Playwright Setup

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

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test file
npm run test:e2e -- e2e/navigation.spec.ts

# Run tests in specific browser
npm run test:e2e -- --project=chromium

# Debug mode with inspector
npm run test:e2e -- --debug

# Generate test code interactively
npx playwright codegen localhost:5173
```

## Basic E2E Tests

### Navigation Tests

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
    
    // Click Selection tab
    await page.click('button:has-text("Selection")');
    await expect(page.locator('[data-testid="selection-demo"]')).toBeVisible();
    
    // Click Components tab
    await page.click('button:has-text("Components")');
    await expect(page.locator('[data-testid="components-demo"]')).toBeVisible();
    
    // Click Forms tab
    await page.click('button:has-text("Forms")');
    await expect(page.locator('[data-testid="forms-demo"]')).toBeVisible();
  });

  test('preserves tab state on refresh', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Components tab
    await page.click('button:has-text("Components")');
    await expect(page.locator('[data-testid="components-demo"]')).toBeVisible();
    
    // Refresh page
    await page.reload();
    
    // Should still be on Components tab
    await expect(page.locator('[data-testid="components-demo"]')).toBeVisible();
  });
});
```

### Component Interaction Tests

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
    
    // Verify click was registered (e.g., toast notification)
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

### Dialog Tests

```typescript title="e2e/dialogs.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Dialogs', () => {
  test('opens and closes dialog', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Dialogs")');
    
    // Open dialog
    await page.click('button:has-text("Open Dialog")');
    
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2')).toHaveText('Dialog Title');
    
    // Close with button
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
    
    // Click outside dialog (on overlay)
    await page.click('[data-testid="dialog-overlay"]');
    
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
```

### Form Tests

```typescript title="e2e/forms.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Forms")');
  });

  test('validates required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button:has-text("Submit")');
    
    // Should show validation errors
    await expect(page.locator('text=This field is required')).toBeVisible();
  });

  test('submits valid form', async ({ page }) => {
    // Fill in form fields
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.selectOption('select[name="category"]', 'option1');
    await page.check('input[name="terms"]');
    
    // Submit form
    await page.click('button:has-text("Submit")');
    
    // Should show success message
    await expect(page.locator('text=Form submitted successfully')).toBeVisible();
  });

  test('slider updates value display', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    const display = page.locator('[data-testid="slider-value"]');
    
    // Get initial value
    const initialValue = await display.textContent();
    
    // Move slider
    await slider.fill('75');
    
    // Value display should update
    await expect(display).not.toHaveText(initialValue!);
    await expect(display).toHaveText('75');
  });
});
```

## Visual Regression Testing

### Screenshot Comparison

```typescript title="e2e/visual.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for animations to complete
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
    
    // Enable dark mode
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      maxDiffPixels: 100,
    });
  });
});
```

### Component Screenshots

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

### Updating Snapshots

When intentional visual changes are made:

```bash
# Update all snapshots
npm run test:e2e -- --update-snapshots

# Update specific test snapshots
npm run test:e2e -- --update-snapshots e2e/visual.spec.ts
```

## Theme Testing

```typescript title="e2e/theme.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Theme', () => {
  test('toggles between light and dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state (light mode)
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
    
    // Toggle to dark mode
    await page.click('[data-testid="theme-toggle"]');
    await expect(html).toHaveClass(/dark/);
    
    // Toggle back to light mode
    await page.click('[data-testid="theme-toggle"]');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('persists theme preference', async ({ page }) => {
    await page.goto('/');
    
    // Set dark mode
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Reload page
    await page.reload();
    
    // Should still be dark mode
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('respects system preference', async ({ page }) => {
    // Emulate dark mode system preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    
    // Should be in dark mode
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
```

## i18n Testing

```typescript title="e2e/i18n.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('displays English by default', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toHaveText(/Eagle React Template/);
  });

  test('switches to Chinese', async ({ page }) => {
    await page.goto('/');
    
    // Open language selector
    await page.click('[data-testid="language-selector"]');
    await page.click('text=中文');
    
    // Verify Chinese text appears
    await expect(page.locator('h1')).toContainText('Eagle');
    await expect(page.locator('nav')).toContainText('組件');
  });

  test('persists language preference', async ({ page }) => {
    await page.goto('/');
    
    // Set Chinese
    await page.click('[data-testid="language-selector"]');
    await page.click('text=中文');
    
    // Reload
    await page.reload();
    
    // Should still be Chinese
    await expect(page.locator('nav')).toContainText('組件');
  });
});
```

## Accessibility Testing

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
      .exclude('[data-testid="decorative-element"]') // Exclude known decorative elements
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('dialogs have proper focus management', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Dialogs")');
    await page.click('button:has-text("Open Dialog")');
    
    // Focus should be trapped in dialog
    const dialog = page.locator('[role="dialog"]');
    const focusedElement = page.locator(':focus');
    
    // First focusable element should be focused
    await expect(focusedElement).toBeVisible();
    
    // Tab through dialog
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Focus should still be within dialog
    const newFocused = await page.evaluate(() => 
      document.activeElement?.closest('[role="dialog"]') !== null
    );
    expect(newFocused).toBe(true);
  });

  test('supports keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through main navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('role', 'tab');
    
    // Arrow keys to navigate tabs
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    
    // Should activate the tab
    await expect(page.locator('[data-testid="components-demo"]')).toBeVisible();
  });
});
```

## Performance Testing

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
    
    // Page should load within 3 seconds
    expect(performanceTiming.load).toBeLessThan(3000);
    // DOM should be interactive within 1.5 seconds
    expect(performanceTiming.domContentLoaded).toBeLessThan(1500);
  });

  test('no layout shifts after initial load', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to stabilize
    await page.waitForTimeout(1000);
    
    // Get cumulative layout shift
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
    
    // CLS should be less than 0.1 (good score)
    expect(cls).toBeLessThan(0.1);
  });
});
```

## Page Object Model

For complex tests, use the Page Object Model pattern:

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

**Usage:**

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

## CI/CD Integration

### GitHub Actions Configuration

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

## Best Practices

### 1. Use Stable Selectors

```typescript
// ❌ Bad: Fragile selectors
page.locator('.btn-primary.mt-4.shadow-lg');
page.locator('div > div > button');

// ✅ Good: Stable selectors
page.locator('[data-testid="submit-button"]');
page.locator('button:has-text("Submit")');
page.getByRole('button', { name: 'Submit' });
```

### 2. Wait for Elements Properly

```typescript
// ❌ Bad: Fixed timeouts
await page.waitForTimeout(1000);

// ✅ Good: Wait for specific conditions
await page.waitForSelector('[data-testid="loaded"]');
await expect(page.locator('.content')).toBeVisible();
```

### 3. Isolate Tests

```typescript
// ❌ Bad: Tests depend on previous state
test('step 1', async ({ page }) => { ... });
test('step 2', async ({ page }) => { ... }); // Depends on step 1

// ✅ Good: Each test is independent
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Setup fresh state
});
```

## Related

- [Testing Overview](./overview.md) - Test configuration
- [Component Testing](./component-testing.md) - Unit tests for components
- [Development Workflow](../development/workflow.md) - Development setup
