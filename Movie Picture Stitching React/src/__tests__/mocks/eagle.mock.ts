/**
 * Mock Factories for Eagle API Testing
 * Provides configurable mock data for items, folders, and other Eagle entities
 */

import type { Item, Folder, Tag, EagleLocale, EagleTheme } from '@/types/eagle';
import { vi } from 'vitest';

// ============================================================================
// Item Factory
// ============================================================================

export interface MockItemOptions {
  id?: string;
  name?: string;
  ext?: string;
  width?: number;
  height?: number;
  size?: number;
  tags?: string[];
  folders?: string[];
  star?: number;
  annotation?: string;
}

let itemCounter = 0;

/**
 * Create a single mock item with configurable properties
 */
export function createMockItem(options: MockItemOptions = {}): Item {
  const id = options.id ?? `mock-item-${++itemCounter}`;
  const ext = options.ext ?? 'png';
  const name = options.name ?? `Test Image ${itemCounter}`;

  return {
    id,
    name,
    ext,
    width: options.width ?? 1920,
    height: options.height ?? 1080,
    url: '',
    isDeleted: false,
    annotation: options.annotation ?? '',
    tags: options.tags ?? [],
    folders: options.folders ?? [],
    palettes: [],
    size: options.size ?? 1024000,
    star: options.star ?? 0,
    importedAt: Date.now(),
    noThumbnail: false,
    noPreview: false,
    filePath: `/mock/library/${id}/${name}.${ext}`,
    fileURL: `file:///mock/library/${id}/${name}.${ext}`,
    thumbnailPath: `/mock/library/${id}/${name}_thumbnail.png`,
    thumbnailURL: `file:///mock/library/${id}/${name}_thumbnail.png`,
    metadataFilePath: `/mock/library/${id}/metadata.json`,
    // Mock methods
    save: vi.fn().mockResolvedValue(true),
    moveToTrash: vi.fn().mockResolvedValue(true),
    replaceFile: vi.fn().mockResolvedValue(true),
    refreshThumbnail: vi.fn().mockResolvedValue(true),
    setCustomThumbnail: vi.fn().mockResolvedValue(true),
    open: vi.fn().mockResolvedValue(undefined),
  };
}

/**
 * Create multiple mock items
 */
export function createMockItems(count: number, options?: MockItemOptions[]): Item[] {
  return Array.from({ length: count }, (_, i) => createMockItem(options?.[i] ?? {}));
}

/**
 * Create items with various file types
 */
export function createMixedTypeItems(): Item[] {
  const types = [
    { ext: 'png', name: 'Screenshot' },
    { ext: 'jpg', name: 'Photo' },
    { ext: 'svg', name: 'Vector' },
    { ext: 'mp4', name: 'Video', width: 3840, height: 2160 },
    { ext: 'gif', name: 'Animation' },
    { ext: 'psd', name: 'Design' },
    { ext: 'pdf', name: 'Document' },
    { ext: 'webp', name: 'WebImage' },
  ];

  return types.map((t) => createMockItem(t));
}

/**
 * Reset item counter for predictable IDs in tests
 */
export function resetItemCounter(): void {
  itemCounter = 0;
}

// ============================================================================
// Folder Factory
// ============================================================================

export interface MockFolderOptions {
  id?: string;
  name?: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  children?: Folder[];
}

let folderCounter = 0;

/**
 * Create a single mock folder
 */
export function createMockFolder(options: MockFolderOptions = {}): Folder {
  const id = options.id ?? `mock-folder-${++folderCounter}`;

  return {
    id,
    name: options.name ?? `Test Folder ${folderCounter}`,
    description: options.description ?? '',
    icon: options.icon ?? '📁',
    iconColor: options.iconColor ?? '#4A90D9',
    createdAt: Date.now(),
    children: options.children ?? [],
    save: vi.fn().mockResolvedValue(undefined),
    open: vi.fn().mockResolvedValue(undefined),
  };
}

/**
 * Create nested folder structure
 */
export function createNestedFolders(depth: number): Folder {
  if (depth <= 0) {
    return createMockFolder({ name: 'Leaf Folder' });
  }

  return createMockFolder({
    name: `Parent Level ${depth}`,
    children: [createNestedFolders(depth - 1)],
  });
}

/**
 * Reset folder counter
 */
export function resetFolderCounter(): void {
  folderCounter = 0;
}

// ============================================================================
// Tag Factory
// ============================================================================

export function createMockTag(name: string, color?: string): Tag {
  return {
    id: `tag-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    color,
    count: Math.floor(Math.random() * 100),
  };
}

export function createMockTags(names: string[]): Tag[] {
  return names.map((name) => createMockTag(name));
}

// ============================================================================
// Eagle API Mock Configuration
// ============================================================================

export interface MockEagleConfig {
  locale?: EagleLocale;
  theme?: EagleTheme;
  isDarkColors?: boolean;
  platform?: 'darwin' | 'win32';
  version?: string;
  selectedItems?: Item[];
  selectedFolders?: Folder[];
  allItems?: Item[];
  allFolders?: Folder[];
}

const defaultMockConfig: Required<MockEagleConfig> = {
  locale: 'en',
  theme: 'DARK',
  isDarkColors: true,
  platform: 'darwin',
  version: '4.0.0',
  selectedItems: [],
  selectedFolders: [],
  allItems: [],
  allFolders: [],
};

let currentMockConfig: Required<MockEagleConfig> = { ...defaultMockConfig };

/**
 * Configure the mock Eagle API behavior
 */
export function configureMockEagle(config: MockEagleConfig): void {
  currentMockConfig = { ...defaultMockConfig, ...config };
}

/**
 * Get current mock configuration
 */
export function getMockEagleConfig(): Required<MockEagleConfig> {
  return { ...currentMockConfig };
}

/**
 * Reset mock configuration to defaults
 */
export function resetMockEagleConfig(): void {
  currentMockConfig = { ...defaultMockConfig };
}

// ============================================================================
// Test Scenario Presets
// ============================================================================

export const TestScenarios = {
  /** Empty selection - no items selected */
  emptySelection: () => {
    configureMockEagle({ selectedItems: [] });
  },

  /** Single item selected */
  singleItem: () => {
    configureMockEagle({
      selectedItems: [createMockItem({ name: 'Single Selected' })],
    });
  },

  /** Many items selected (stress test) */
  largeSelection: (count = 100) => {
    configureMockEagle({
      selectedItems: createMockItems(count),
    });
  },

  /** Mixed file types */
  mixedTypes: () => {
    configureMockEagle({
      selectedItems: createMixedTypeItems(),
    });
  },

  /** Light theme configuration */
  lightTheme: () => {
    configureMockEagle({
      theme: 'LIGHT',
      isDarkColors: false,
    });
  },

  /** Japanese locale */
  japaneseLocale: () => {
    configureMockEagle({ locale: 'ja_JP' });
  },

  /** Windows platform */
  windowsPlatform: () => {
    configureMockEagle({ platform: 'win32' });
  },
};

// ============================================================================
// Reset All
// ============================================================================

/**
 * Reset all mock factories and configurations
 */
export function resetAllMocks(): void {
  resetItemCounter();
  resetFolderCounter();
  resetMockEagleConfig();
}
