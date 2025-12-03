/**
 * Custom Test Utilities
 * Provides wrapped render function with all necessary providers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { expect } from 'vitest';
import i18n from '@/lib/i18n';
import { ToastProvider } from '@/components';

// ============================================================================
// Provider Wrapper
// ============================================================================

interface WrapperProps {
  children: React.ReactNode;
}

/**
 * All providers wrapper for component tests
 */
function AllProviders({ children }: WrapperProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <ToastProvider>{children}</ToastProvider>
    </I18nextProvider>
  );
}

// ============================================================================
// Custom Render Options
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Initial theme to apply
   */
  initialTheme?: 'light' | 'dark';

  /**
   * Whether to wrap with providers
   */
  withProviders?: boolean;
}

// ============================================================================
// Custom Render Function
// ============================================================================

/**
 * Custom render with providers and theme setup
 */
function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const { initialTheme = 'light', withProviders = true, ...renderOptions } = options;

  // Apply theme to document
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  html.classList.add(initialTheme);

  // Setup userEvent
  const user = userEvent.setup();

  // Render with or without providers
  const wrapper = withProviders ? AllProviders : undefined;

  const result = render(ui, { wrapper, ...renderOptions });

  return {
    ...result,
    user,
  };
}

// ============================================================================
// Re-export everything from testing-library
// ============================================================================

export * from '@testing-library/react';
export { customRender as render };
export { userEvent };

// ============================================================================
// Additional Test Helpers
// ============================================================================

/**
 * Wait for async operations to settle
 */
export async function waitForAsync(ms = 0): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a mock event with custom properties
 */
export function createMockEvent<T extends object>(overrides: T = {} as T) {
  return {
    preventDefault: () => {},
    stopPropagation: () => {},
    ...overrides,
  };
}

/**
 * Assert element has specific CSS classes
 */
export function expectClasses(element: HTMLElement, ...classes: string[]) {
  classes.forEach((cls) => {
    expect(element.classList.contains(cls)).toBe(true);
  });
}

/**
 * Assert element does not have specific CSS classes
 */
export function expectNoClasses(element: HTMLElement, ...classes: string[]) {
  classes.forEach((cls) => {
    expect(element.classList.contains(cls)).toBe(false);
  });
}

/**
 * Get computed style property
 */
export function getStyle(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Simulate dark mode preference change
 */
export function simulateDarkModeChange(isDark: boolean): void {
  const event = new MediaQueryListEvent('change', {
    matches: isDark,
    media: '(prefers-color-scheme: dark)',
  });

  window.matchMedia('(prefers-color-scheme: dark)').dispatchEvent(event);
}
