import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to be fully loaded
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });
  });

  test('homepage renders correctly @visual', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
    });
  });

  test('header component @visual', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot('header.png');
  });

  test('card component @visual', async ({ page }) => {
    const card = page.locator('[class*="card"]').first();
    if (await card.isVisible()) {
      await expect(card).toHaveScreenshot('card.png');
    }
  });

  test('button variants @visual', async ({ page }) => {
    // Find buttons and screenshot them
    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count > 0) {
      // Screenshot the first button container area
      const buttonContainer = buttons.first().locator('..');
      await expect(buttonContainer).toHaveScreenshot('button-container.png');
    }
  });

  test('form controls @visual', async ({ page }) => {
    // Look for form elements
    const inputs = page.locator('input, select');
    const count = await inputs.count();

    if (count > 0) {
      const formArea = inputs.first().locator('..').locator('..');
      await expect(formArea).toHaveScreenshot('form-controls.png');
    }
  });
});

test.describe('Interactive States @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });
  });

  test('button hover state @visual', async ({ page }) => {
    const button = page.locator('button').first();
    if (await button.isVisible()) {
      await button.hover();
      await expect(button).toHaveScreenshot('button-hover.png');
    }
  });

  test('button focus state @visual', async ({ page }) => {
    const button = page.locator('button').first();
    if (await button.isVisible()) {
      await button.focus();
      await expect(button).toHaveScreenshot('button-focus.png');
    }
  });

  test('input focus state @visual', async ({ page }) => {
    const input = page.locator('input').first();
    if (await input.isVisible()) {
      await input.focus();
      await expect(input).toHaveScreenshot('input-focus.png');
    }
  });
});

test.describe('Theme Consistency @visual', () => {
  test('light theme consistency @visual', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });

    // Ensure light theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });

    await expect(page).toHaveScreenshot('theme-light.png', {
      fullPage: true,
    });
  });

  test('dark theme consistency @visual', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });

    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    await expect(page).toHaveScreenshot('theme-dark.png', {
      fullPage: true,
    });
  });
});

test.describe('Toast Notifications @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });
  });

  test('success toast appearance @visual', async ({ page }) => {
    // Trigger a success toast if there's a button for it
    const successButton = page.locator('button:has-text("success")').first();
    if (await successButton.isVisible()) {
      await successButton.click();
      await page.waitForTimeout(300); // Wait for animation
      const toast = page.locator('[class*="toast"]').first();
      if (await toast.isVisible()) {
        await expect(toast).toHaveScreenshot('toast-success.png');
      }
    }
  });

  test('error toast appearance @visual', async ({ page }) => {
    // Trigger an error toast if there's a button for it
    const errorButton = page.locator('button:has-text("error")').first();
    if (await errorButton.isVisible()) {
      await errorButton.click();
      await page.waitForTimeout(300); // Wait for animation
      const toast = page.locator('[class*="toast"]').first();
      if (await toast.isVisible()) {
        await expect(toast).toHaveScreenshot('toast-error.png');
      }
    }
  });
});

test.describe('Responsive Layout @visual', () => {
  test('mobile viewport @visual', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('responsive-mobile.png', {
      fullPage: true,
    });
  });

  test('tablet viewport @visual', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('responsive-tablet.png', {
      fullPage: true,
    });
  });

  test('desktop viewport @visual', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('responsive-desktop.png', {
      fullPage: true,
    });
  });
});
