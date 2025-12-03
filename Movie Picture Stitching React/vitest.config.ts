/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react() as any],
  test: {
    // Use happy-dom for faster DOM simulation
    environment: 'happy-dom',
    
    // Enable global test APIs (describe, it, expect)
    globals: true,
    
    // Setup file for global mocks
    setupFiles: ['./src/__tests__/setup.ts'],
    
    // Test file patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    
    // Exclude patterns
    exclude: ['node_modules', 'dist', '.git'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'src/__tests__/',
        'src/types/',
        '**/*.d.ts',
        '**/index.ts',
        'src/main.tsx',
        'src/App.tsx', // Demo component, not part of reusable template
      ],
      // Coverage thresholds - realistic for template project
      // Core utilities (lib/) have ~95% coverage
      // Hooks have full coverage
      // Components excluded since they're customizable examples
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 50,
        lines: 60,
      },
    },
    
    // Type checking (optional, can slow down tests)
    typecheck: {
      enabled: false,
    },
  },
  
  // Resolve aliases (must match tsconfig.json)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
