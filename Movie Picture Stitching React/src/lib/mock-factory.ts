/**
 * Mock Factory System
 *
 * Provides configurable mock data generation for development mode.
 * Used by EagleAPIAdapter when running outside Eagle context.
 *
 * Features:
 * - Configurable item/folder counts via URL params or API
 * - Multiple file type presets
 * - Error simulation for testing error handling
 * - Console API for runtime configuration
 */

import type {
  Item,
  Folder,
  Tag,
  TagGroup,
  LibraryInfo,
  Display,
  ColorPalette,
  Rectangle,
  Point,
  EagleLocale,
  EagleTheme,
  TagColor,
  NativeImage,
} from '@/types/eagle';

// ============================================================================
// Types
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
  isDeleted?: boolean;
}

export interface MockFolderOptions {
  id?: string;
  name?: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  children?: Folder[];
}

export interface MockTagOptions {
  id?: string;
  name?: string;
  color?: string;
  count?: number;
}

export interface MockTagGroupOptions {
  name?: string;
  color?: TagColor;
  tags?: string[];
}

export interface MockLibraryInfoOptions {
  name?: string;
  path?: string;
  modificationTime?: number;
}

export interface MockDisplayOptions {
  id?: number;
  bounds?: Rectangle;
  workArea?: Rectangle;
  scaleFactor?: number;
  primary?: boolean;
}

export interface MockConfig {
  /** Number of items to return from getSelected (default: 2) */
  selectedItemCount: number;
  /** Total items in library (default: 10) */
  totalItemCount: number;
  /** Number of folders (default: 3) */
  folderCount: number;
  /** Number of tags (default: 5) */
  tagCount: number;
  /** Number of tag groups (default: 2) */
  tagGroupCount: number;
  /** Current locale */
  locale: EagleLocale;
  /** Current theme */
  theme: EagleTheme;
  /** Whether dark mode is active */
  isDarkMode: boolean;
  /** Platform */
  platform: 'darwin' | 'win32';
  /** Simulate errors for specific methods */
  simulateErrors: {
    getSelectedItems?: boolean | Error;
    getAllItems?: boolean | Error;
    addFromPath?: boolean | Error;
    save?: boolean | Error;
    getTags?: boolean | Error;
    getLibraryInfo?: boolean | Error;
    clipboard?: boolean | Error;
  };
  /** Custom items override (if set, uses these instead of generated) */
  customItems?: Item[];
  /** Custom folders override */
  customFolders?: Folder[];
  /** Custom tags override */
  customTags?: Tag[];
  /** Custom tag groups override */
  customTagGroups?: TagGroup[];
  /** File type distribution for generated items */
  fileTypes: FileTypePreset;
  /** Mock clipboard state */
  clipboardText: string;
  clipboardHTML: string;
  clipboardImage: NativeImage | null;
  clipboardFiles: string[];
}

export type FileTypePreset = 'images' | 'mixed' | 'videos' | 'documents' | 'custom';

// ============================================================================
// File Type Definitions
// ============================================================================

interface FileTypeConfig {
  ext: string;
  name: string;
  width: number;
  height: number;
  sizeRange: [number, number];
}

const FILE_TYPES: Record<string, FileTypeConfig[]> = {
  images: [
    { ext: 'png', name: 'Screenshot', width: 1920, height: 1080, sizeRange: [500000, 2000000] },
    { ext: 'jpg', name: 'Photo', width: 4032, height: 3024, sizeRange: [1000000, 5000000] },
    { ext: 'webp', name: 'WebImage', width: 1200, height: 800, sizeRange: [100000, 500000] },
    { ext: 'gif', name: 'Animation', width: 480, height: 360, sizeRange: [500000, 3000000] },
  ],
  mixed: [
    { ext: 'png', name: 'Screenshot', width: 1920, height: 1080, sizeRange: [500000, 2000000] },
    { ext: 'jpg', name: 'Photo', width: 4032, height: 3024, sizeRange: [1000000, 5000000] },
    { ext: 'svg', name: 'Vector', width: 800, height: 600, sizeRange: [10000, 100000] },
    { ext: 'mp4', name: 'Video', width: 1920, height: 1080, sizeRange: [10000000, 100000000] },
    { ext: 'psd', name: 'Design', width: 3000, height: 2000, sizeRange: [50000000, 200000000] },
    { ext: 'pdf', name: 'Document', width: 612, height: 792, sizeRange: [100000, 5000000] },
    { ext: 'ai', name: 'Illustrator', width: 1000, height: 1000, sizeRange: [1000000, 10000000] },
    { ext: 'sketch', name: 'Sketch', width: 1440, height: 900, sizeRange: [5000000, 50000000] },
  ],
  videos: [
    { ext: 'mp4', name: 'Video', width: 1920, height: 1080, sizeRange: [10000000, 100000000] },
    { ext: 'mov', name: 'QuickTime', width: 3840, height: 2160, sizeRange: [50000000, 500000000] },
    { ext: 'webm', name: 'WebVideo', width: 1280, height: 720, sizeRange: [5000000, 50000000] },
    { ext: 'gif', name: 'GIF', width: 480, height: 360, sizeRange: [500000, 5000000] },
  ],
  documents: [
    { ext: 'pdf', name: 'PDF', width: 612, height: 792, sizeRange: [100000, 5000000] },
    { ext: 'doc', name: 'Word', width: 612, height: 792, sizeRange: [50000, 1000000] },
    { ext: 'ppt', name: 'PowerPoint', width: 1920, height: 1080, sizeRange: [1000000, 20000000] },
    { ext: 'xls', name: 'Excel', width: 800, height: 600, sizeRange: [50000, 2000000] },
  ],
  custom: [{ ext: 'png', name: 'Image', width: 1920, height: 1080, sizeRange: [500000, 2000000] }],
};

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: MockConfig = {
  selectedItemCount: 2,
  totalItemCount: 10,
  folderCount: 3,
  tagCount: 5,
  tagGroupCount: 2,
  locale: 'en',
  theme: 'DARK',
  isDarkMode: true,
  platform: 'darwin',
  simulateErrors: {},
  fileTypes: 'mixed',
  clipboardText: '',
  clipboardHTML: '',
  clipboardImage: null,
  clipboardFiles: [],
};

// ============================================================================
// Counters for unique IDs
// ============================================================================

let itemCounter = 0;
let folderCounter = 0;
let tagCounter = 0;
let tagGroupCounter = 0;

// ============================================================================
// Item Factory
// ============================================================================

/**
 * Create a single mock item with configurable properties
 */
export function createMockItem(options: MockItemOptions = {}): Item {
  const id = options.id ?? `mock-item-${++itemCounter}`;
  const ext = options.ext ?? 'png';
  const name = options.name ?? `Sample ${ext.toUpperCase()} ${itemCounter}`;
  const now = Date.now();

  return {
    id,
    name,
    ext,
    width: options.width ?? 1920,
    height: options.height ?? 1080,
    url: '',
    isDeleted: options.isDeleted ?? false,
    annotation: options.annotation ?? '',
    tags: options.tags ?? [],
    folders: options.folders ?? [],
    palettes: [],
    size: options.size ?? 1024000,
    star: options.star ?? 0,
    importedAt: now - Math.random() * 86400000 * 30, // Random within last 30 days
    noThumbnail: false,
    noPreview: false,
    filePath: `/mock/library/${id}/${name}.${ext}`,
    fileURL: `file:///mock/library/${id}/${name}.${ext}`,
    thumbnailPath: `/mock/library/${id}/${name}_thumbnail.png`,
    thumbnailURL: `file:///mock/library/${id}/${name}_thumbnail.png`,
    metadataFilePath: `/mock/library/${id}/metadata.json`,
    // Mock methods - these are replaced by MockController if error simulation is enabled
    save: async () => true,
    moveToTrash: async () => true,
    replaceFile: async () => true,
    refreshThumbnail: async () => true,
    setCustomThumbnail: async () => true,
    open: async () => {},
  };
}

/**
 * Create multiple mock items with optional per-item overrides
 */
export function createMockItems(
  count: number,
  options?: MockItemOptions | MockItemOptions[]
): Item[] {
  return Array.from({ length: count }, (_, i) => {
    const opts = Array.isArray(options) ? options[i] : options;
    return createMockItem(opts ?? {});
  });
}

/**
 * Create items based on file type preset
 */
export function createItemsFromPreset(count: number, preset: FileTypePreset): Item[] {
  const types = FILE_TYPES[preset] || FILE_TYPES.mixed;

  return Array.from({ length: count }, (_, i) => {
    const typeConfig = types[i % types.length];
    const size =
      typeConfig.sizeRange[0] + Math.random() * (typeConfig.sizeRange[1] - typeConfig.sizeRange[0]);

    return createMockItem({
      ext: typeConfig.ext,
      name: `${typeConfig.name} ${i + 1}`,
      width: typeConfig.width,
      height: typeConfig.height,
      size: Math.round(size),
      star: Math.floor(Math.random() * 6), // 0-5 stars
      tags: generateRandomTags(),
    });
  });
}

/**
 * Generate random tags from a preset list
 */
function generateRandomTags(): string[] {
  const allTags = [
    'design',
    'photo',
    'screenshot',
    'reference',
    'inspiration',
    'ui',
    'icon',
    'illustration',
    'mockup',
    'texture',
    'logo',
    'banner',
    'social',
    'web',
    'print',
  ];
  const count = Math.floor(Math.random() * 4); // 0-3 tags
  const shuffled = allTags.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ============================================================================
// Folder Factory
// ============================================================================

/**
 * Create a single mock folder
 */
export function createMockFolder(options: MockFolderOptions = {}): Folder {
  const id = options.id ?? `mock-folder-${++folderCounter}`;

  return {
    id,
    name: options.name ?? `Folder ${folderCounter}`,
    description: options.description ?? '',
    icon: options.icon ?? '📁',
    iconColor: options.iconColor ?? '#4A90D9',
    createdAt: Date.now() - Math.random() * 86400000 * 90, // Random within last 90 days
    children: options.children ?? [],
    save: async () => {},
    open: async () => {},
  };
}

/**
 * Create multiple mock folders
 */
export function createMockFolders(count: number): Folder[] {
  const icons = ['📁', '📂', '🎨', '📷', '🎬', '📄', '💼', '🎯', '⭐', '🔖'];
  const colors = ['#4A90D9', '#7B61FF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
  const names = [
    'Projects',
    'References',
    'Inspiration',
    'Assets',
    'Screenshots',
    'Photos',
    'Designs',
    'Icons',
    'Mockups',
    'Archive',
  ];

  return Array.from({ length: count }, (_, i) =>
    createMockFolder({
      name: names[i % names.length],
      icon: icons[i % icons.length],
      iconColor: colors[i % colors.length],
    })
  );
}

/**
 * Create nested folder structure
 */
export function createNestedFolders(depth: number, breadth: number = 2): Folder {
  if (depth <= 0) {
    return createMockFolder({ name: 'Leaf Folder' });
  }

  const children = Array.from({ length: breadth }, () => createNestedFolders(depth - 1, breadth));

  return createMockFolder({
    name: `Level ${depth}`,
    children,
  });
}

// ============================================================================
// Tag Factory
// ============================================================================

const TAG_COLORS: TagColor[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'aqua',
  'blue',
  'purple',
  'pink',
];
const TAG_NAMES = [
  'design',
  'photo',
  'screenshot',
  'reference',
  'inspiration',
  'ui',
  'icon',
  'illustration',
  'mockup',
  'texture',
  'logo',
  'banner',
  'social',
  'web',
  'print',
  'favorite',
];

/**
 * Create a single mock tag
 */
export function createMockTag(options: MockTagOptions = {}): Tag {
  const id = options.id ?? `mock-tag-${++tagCounter}`;

  return {
    id,
    name: options.name ?? TAG_NAMES[tagCounter % TAG_NAMES.length],
    color: options.color ?? TAG_COLORS[tagCounter % TAG_COLORS.length],
    count: options.count ?? Math.floor(Math.random() * 100),
  };
}

/**
 * Create multiple mock tags
 */
export function createMockTags(count: number): Tag[] {
  return Array.from({ length: count }, (_, i) =>
    createMockTag({
      name: TAG_NAMES[i % TAG_NAMES.length],
      color: TAG_COLORS[i % TAG_COLORS.length],
    })
  );
}

// ============================================================================
// TagGroup Factory
// ============================================================================

const TAG_GROUP_NAMES = ['Design Assets', 'Photo Collection', 'References', 'Projects', 'Archive'];

/**
 * Create a single mock tag group
 */
export function createMockTagGroup(options: MockTagGroupOptions = {}): TagGroup {
  const tags = options.tags ?? ['tag1', 'tag2'];

  return {
    name: options.name ?? TAG_GROUP_NAMES[tagGroupCounter++ % TAG_GROUP_NAMES.length],
    color: options.color ?? TAG_COLORS[tagGroupCounter % TAG_COLORS.length],
    tags,
    save: async () => ({
      name: options.name ?? 'Group',
      color: options.color ?? 'blue',
      tags,
      save: async (): Promise<TagGroup> => ({}) as TagGroup,
      remove: async () => true,
    }),
    remove: async () => true,
  };
}

/**
 * Create multiple mock tag groups
 */
export function createMockTagGroups(count: number): TagGroup[] {
  return Array.from({ length: count }, (_, i) =>
    createMockTagGroup({
      name: TAG_GROUP_NAMES[i % TAG_GROUP_NAMES.length],
      color: TAG_COLORS[i % TAG_COLORS.length],
      tags: [`tag-${i * 2}`, `tag-${i * 2 + 1}`],
    })
  );
}

// ============================================================================
// LibraryInfo Factory
// ============================================================================

/**
 * Create mock library info
 */
export function createMockLibraryInfo(options: MockLibraryInfoOptions = {}): LibraryInfo {
  return {
    name: options.name ?? 'Mock Library',
    path: options.path ?? '/mock/library/path.library',
    modificationTime: options.modificationTime ?? Date.now(),
    folders: [],
    smartFolders: [],
    tagGroups: [],
    quickAccess: [],
    modifierShortcuts: [],
    applicationTheme: 'DARK',
  };
}

// ============================================================================
// Display Factory
// ============================================================================

/**
 * Create mock display info (Electron Display object)
 */
export function createMockDisplay(options: MockDisplayOptions = {}): Display {
  const bounds = options.bounds ?? { x: 0, y: 0, width: 1920, height: 1080 };

  return {
    id: options.id ?? 1,
    bounds,
    workArea: options.workArea ?? { x: 0, y: 25, width: 1920, height: 1055 },
    accelerometerSupport: 'unavailable',
    colorDepth: 24,
    colorSpace: 'sRGB',
    scaleFactor: options.scaleFactor ?? 2,
    size: { width: bounds.width, height: bounds.height },
    workAreaSize: { width: 1920, height: 1055 },
    rotation: 0,
    internal: options.primary ?? true,
    touchSupport: 'unavailable',
    monochrome: false,
    label: options.primary ? 'Built-in Display' : `Display ${options.id ?? 1}`,
  };
}

/**
 * Create mock primary and secondary displays
 */
export function createMockDisplays(): Display[] {
  return [
    createMockDisplay({ id: 1, primary: true }),
    createMockDisplay({
      id: 2,
      primary: false,
      bounds: { x: 1920, y: 0, width: 1920, height: 1080 },
      workArea: { x: 1920, y: 25, width: 1920, height: 1055 },
    }),
  ];
}

// ============================================================================
// NativeImage Mock Factory
// ============================================================================

/**
 * Create mock NativeImage
 */
export function createMockNativeImage(width: number = 256, height: number = 256): NativeImage {
  return {
    toDataURL: () => `data:image/png;base64,mock-image-${width}x${height}`,
    toPNG: () => Buffer.from([0x89, 0x50, 0x4e, 0x47]), // PNG magic bytes
    getSize: () => ({ width, height }),
  };
}

// ============================================================================
// ColorPalette Factory
// ============================================================================

/**
 * Create mock color palettes for an item
 */
export function createMockPalettes(count: number = 5): ColorPalette[] {
  const colors: [number, number, number][] = [
    [66, 133, 244], // Blue
    [234, 67, 53], // Red
    [251, 188, 5], // Yellow
    [52, 168, 83], // Green
    [255, 255, 255], // White
    [0, 0, 0], // Black
    [156, 39, 176], // Purple
    [255, 152, 0], // Orange
  ];

  return Array.from({ length: count }, (_, i) => ({
    color: colors[i % colors.length],
    ratio: (count - i) / (count * 2), // Descending ratios
  }));
}

// ============================================================================
// Mock Controller
// ============================================================================

/**
 * MockController - Runtime configuration for mock data
 *
 * Usage:
 * - URL params: ?mockItems=10&mockPreset=mixed&mockErrors=true
 * - Console: window.mockEagle.setConfig({ selectedItemCount: 50 })
 * - Console: window.mockEagle.preset('largeLibrary')
 */
class MockController {
  private config: MockConfig;
  private cachedItems: Item[] | null = null;
  private cachedFolders: Folder[] | null = null;
  private cachedTags: Tag[] | null = null;
  private cachedTagGroups: TagGroup[] | null = null;
  private cachedLibraryInfo: LibraryInfo | null = null;
  private cachedDisplays: Display[] | null = null;

  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.parseUrlParams();
    this.exposeToWindow();
  }

  /**
   * Parse URL parameters to configure mock behavior
   */
  private parseUrlParams(): void {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    // ?mockItems=10
    const mockItems = params.get('mockItems');
    if (mockItems) {
      const count = parseInt(mockItems, 10);
      if (!isNaN(count) && count >= 0) {
        this.config.selectedItemCount = Math.min(count, 5);
        this.config.totalItemCount = count;
      }
    }

    // ?mockPreset=mixed|images|videos|documents
    const preset = params.get('mockPreset') as FileTypePreset;
    if (preset && preset in FILE_TYPES) {
      this.config.fileTypes = preset;
    }

    // ?mockTheme=light|dark
    const theme = params.get('mockTheme');
    if (theme === 'light') {
      this.config.theme = 'LIGHT';
      this.config.isDarkMode = false;
    } else if (theme === 'dark') {
      this.config.theme = 'DARK';
      this.config.isDarkMode = true;
    }

    // ?mockLocale=en|zh_CN|ja_JP|...
    const locale = params.get('mockLocale') as EagleLocale;
    if (locale) {
      this.config.locale = locale;
    }

    // ?mockErrors=true (enables random error simulation)
    const mockErrors = params.get('mockErrors');
    if (mockErrors === 'true') {
      this.config.simulateErrors = {
        getSelectedItems: Math.random() > 0.8,
        save: Math.random() > 0.9,
      };
    }

    // ?mockPlatform=win32|darwin
    const platform = params.get('mockPlatform') as 'darwin' | 'win32';
    if (platform === 'win32' || platform === 'darwin') {
      this.config.platform = platform;
    }
  }

  /**
   * Expose controller to window for console access
   */
  private exposeToWindow(): void {
    if (typeof window === 'undefined') return;

    (window as Window & { mockEagle?: MockController }).mockEagle = this;

    console.info(
      '%c[MockEagle] Development mode active',
      'color: #4ECDC4; font-weight: bold;',
      '\n\nConsole API:',
      '\n  window.mockEagle.setConfig({ selectedItemCount: 50 })',
      '\n  window.mockEagle.preset("largeLibrary")',
      '\n  window.mockEagle.simulateError("getSelectedItems")',
      '\n  window.mockEagle.getConfig()',
      '\n  window.mockEagle.reset()',
      '\n\nURL params:',
      '\n  ?mockItems=10&mockPreset=mixed&mockTheme=light'
    );
  }

  /**
   * Get current configuration
   */
  getConfig(): MockConfig {
    return { ...this.config };
  }

  /**
   * Update configuration and clear cache
   */
  setConfig(updates: Partial<MockConfig>): void {
    this.config = { ...this.config, ...updates };
    this.clearCache();
    console.info('[MockEagle] Config updated:', this.config);
  }

  /**
   * Apply a preset configuration
   */
  preset(name: 'empty' | 'single' | 'default' | 'largeLibrary' | 'stressTest'): void {
    const presets: Record<string, Partial<MockConfig>> = {
      empty: {
        selectedItemCount: 0,
        totalItemCount: 0,
        folderCount: 0,
        tagCount: 0,
        tagGroupCount: 0,
      },
      single: {
        selectedItemCount: 1,
        totalItemCount: 1,
        folderCount: 1,
        tagCount: 1,
        tagGroupCount: 1,
      },
      default: {
        selectedItemCount: 2,
        totalItemCount: 10,
        folderCount: 3,
        tagCount: 5,
        tagGroupCount: 2,
      },
      largeLibrary: {
        selectedItemCount: 5,
        totalItemCount: 100,
        folderCount: 20,
        tagCount: 50,
        tagGroupCount: 10,
      },
      stressTest: {
        selectedItemCount: 10,
        totalItemCount: 1000,
        folderCount: 50,
        tagCount: 200,
        tagGroupCount: 20,
      },
    };

    const config = presets[name];
    if (config) {
      this.setConfig(config);
      console.info(`[MockEagle] Applied preset: ${name}`);
    } else {
      console.warn(`[MockEagle] Unknown preset: ${name}`);
    }
  }

  /**
   * Enable error simulation for a specific method
   */
  simulateError(method: keyof MockConfig['simulateErrors'], error?: Error | string): void {
    const err =
      typeof error === 'string'
        ? new Error(error)
        : (error ?? new Error(`Simulated ${method} error`));
    this.config.simulateErrors = {
      ...this.config.simulateErrors,
      [method]: err,
    };
    console.info(`[MockEagle] Error simulation enabled for: ${method}`);
  }

  /**
   * Clear error simulation
   */
  clearErrors(): void {
    this.config.simulateErrors = {};
    console.info('[MockEagle] Error simulation cleared');
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.clearCache();
    console.info('[MockEagle] Reset to defaults');
  }

  /**
   * Clear cached data (forces regeneration)
   */
  clearCache(): void {
    this.cachedItems = null;
    this.cachedFolders = null;
    this.cachedTags = null;
    this.cachedTagGroups = null;
    this.cachedLibraryInfo = null;
    this.cachedDisplays = null;
    itemCounter = 0;
    folderCounter = 0;
    tagCounter = 0;
    tagGroupCounter = 0;
  }

  // =========================================================================
  // Data Access Methods (used by EagleAPIAdapter)
  // =========================================================================

  /**
   * Get selected items (may throw if error simulation enabled)
   */
  async getSelectedItems(): Promise<Item[]> {
    this.checkError('getSelectedItems');

    if (this.config.customItems) {
      return this.config.customItems.slice(0, this.config.selectedItemCount);
    }

    const allItems = this.getAllItemsSync();
    return allItems.slice(0, this.config.selectedItemCount);
  }

  /**
   * Get all items
   */
  async getAllItems(): Promise<Item[]> {
    this.checkError('getAllItems');
    return this.getAllItemsSync();
  }

  /**
   * Get all items synchronously (for internal use)
   *
   * Cache is valid if:
   * - cachedItems exists AND
   * - cachedItems.length >= config.totalItemCount (allows for added items)
   */
  private getAllItemsSync(): Item[] {
    // Cache is valid if it has at least the configured count
    // (may have more if items were added via addFromPath)
    if (this.cachedItems && this.cachedItems.length >= this.config.totalItemCount) {
      return this.cachedItems;
    }

    if (this.config.customItems) {
      return this.config.customItems;
    }

    // Reset counter for consistent IDs
    itemCounter = 0;
    this.cachedItems = createItemsFromPreset(this.config.totalItemCount, this.config.fileTypes);
    return this.cachedItems;
  }

  /**
   * Get item by ID
   */
  async getItemById(id: string): Promise<Item | undefined> {
    const items = await this.getAllItems();
    return items.find((item) => item.id === id);
  }

  /**
   * Get all folders
   */
  async getAllFolders(): Promise<Folder[]> {
    if (this.cachedFolders && this.cachedFolders.length === this.config.folderCount) {
      return this.cachedFolders;
    }

    if (this.config.customFolders) {
      return this.config.customFolders;
    }

    // Reset counter for consistent IDs
    folderCounter = 0;
    this.cachedFolders = createMockFolders(this.config.folderCount);
    return this.cachedFolders;
  }

  /**
   * Get selected folders
   */
  async getSelectedFolders(): Promise<Folder[]> {
    const folders = await this.getAllFolders();
    return folders.slice(0, 1); // Return first folder as selected
  }

  /**
   * Get folder by ID
   */
  async getFolderById(id: string): Promise<Folder | undefined> {
    const folders = await this.getAllFolders();
    return folders.find((f) => f.id === id);
  }

  // =========================================================================
  // Tag Methods
  // =========================================================================

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    this.checkError('getTags');

    if (this.config.customTags) {
      return this.config.customTags;
    }

    if (this.cachedTags && this.cachedTags.length === this.config.tagCount) {
      return this.cachedTags;
    }

    tagCounter = 0;
    this.cachedTags = createMockTags(this.config.tagCount);
    return this.cachedTags;
  }

  /**
   * Get recent tags
   */
  async getRecentTags(): Promise<Tag[]> {
    const tags = await this.getTags();
    return tags.slice(0, 5);
  }

  /**
   * Get tag groups
   */
  async getTagGroups(): Promise<TagGroup[]> {
    if (this.config.customTagGroups) {
      return this.config.customTagGroups;
    }

    if (this.cachedTagGroups && this.cachedTagGroups.length === this.config.tagGroupCount) {
      return this.cachedTagGroups;
    }

    tagGroupCounter = 0;
    this.cachedTagGroups = createMockTagGroups(this.config.tagGroupCount);
    return this.cachedTagGroups;
  }

  // =========================================================================
  // Library Methods
  // =========================================================================

  /**
   * Get library info
   */
  async getLibraryInfo(): Promise<LibraryInfo> {
    this.checkError('getLibraryInfo');

    if (this.cachedLibraryInfo) {
      return this.cachedLibraryInfo;
    }

    const folders = await this.getAllFolders();
    const tagGroups = await this.getTagGroups();

    this.cachedLibraryInfo = {
      ...createMockLibraryInfo(),
      folders,
      tagGroups,
    };

    return this.cachedLibraryInfo;
  }

  /**
   * Get library name
   */
  get libraryName(): string {
    return this.cachedLibraryInfo?.name ?? 'Mock Library';
  }

  /**
   * Get library path
   */
  get libraryPath(): string {
    return this.cachedLibraryInfo?.path ?? '/mock/library/path.library';
  }

  /**
   * Get library modification time
   */
  get libraryModificationTime(): number {
    return this.cachedLibraryInfo?.modificationTime ?? Date.now();
  }

  // =========================================================================
  // Screen Methods
  // =========================================================================

  /**
   * Get cursor screen point
   */
  async getCursorScreenPoint(): Promise<Point> {
    return { x: 500, y: 300 };
  }

  /**
   * Get primary display
   */
  async getPrimaryDisplay(): Promise<Display> {
    if (!this.cachedDisplays) {
      this.cachedDisplays = createMockDisplays();
    }
    return this.cachedDisplays[0];
  }

  /**
   * Get all displays
   */
  async getAllDisplays(): Promise<Display[]> {
    if (!this.cachedDisplays) {
      this.cachedDisplays = createMockDisplays();
    }
    return this.cachedDisplays;
  }

  /**
   * Get display nearest to point
   */
  async getDisplayNearestPoint(point: Point): Promise<Display> {
    const displays = await this.getAllDisplays();
    // Simple: return display whose bounds contain the point
    for (const display of displays) {
      if (
        point.x >= display.bounds.x &&
        point.x < display.bounds.x + display.bounds.width &&
        point.y >= display.bounds.y &&
        point.y < display.bounds.y + display.bounds.height
      ) {
        return display;
      }
    }
    return displays[0];
  }

  // =========================================================================
  // OS Methods
  // =========================================================================

  /**
   * Get OS temp directory
   */
  tmpdir(): string {
    return this.config.platform === 'darwin'
      ? '/var/folders/tmp'
      : 'C:\\Users\\User\\AppData\\Local\\Temp';
  }

  /**
   * Get OS version string
   */
  osVersion(): string {
    return this.config.platform === 'darwin' ? '23.0.0' : '10.0.22621';
  }

  /**
   * Get OS type
   */
  osType(): 'Darwin' | 'Windows_NT' {
    return this.config.platform === 'darwin' ? 'Darwin' : 'Windows_NT';
  }

  /**
   * Get OS release
   */
  osRelease(): string {
    return this.config.platform === 'darwin' ? '23.0.0' : '10.0.22621';
  }

  /**
   * Get hostname
   */
  hostname(): string {
    return 'mock-host.local';
  }

  /**
   * Get home directory
   */
  homedir(): string {
    return this.config.platform === 'darwin' ? '/Users/mockuser' : 'C:\\Users\\mockuser';
  }

  /**
   * Get CPU architecture
   */
  arch(): 'x64' | 'arm64' | 'x86' {
    return 'arm64';
  }

  // =========================================================================
  // Clipboard Methods
  // =========================================================================

  /**
   * Clear clipboard
   */
  clipboardClear(): void {
    this.config.clipboardText = '';
    this.config.clipboardHTML = '';
    this.config.clipboardImage = null;
    this.config.clipboardFiles = [];
  }

  /**
   * Check if clipboard has format
   */
  clipboardHas(format: string): boolean {
    switch (format) {
      case 'text/plain':
        return this.config.clipboardText.length > 0;
      case 'text/html':
        return this.config.clipboardHTML.length > 0;
      case 'image/png':
        return this.config.clipboardImage !== null;
      default:
        return false;
    }
  }

  /**
   * Write text to clipboard
   */
  clipboardWriteText(text: string): void {
    this.config.clipboardText = text;
  }

  /**
   * Read text from clipboard
   */
  clipboardReadText(): string {
    return this.config.clipboardText;
  }

  /**
   * Write HTML to clipboard
   */
  clipboardWriteHTML(markup: string): void {
    this.config.clipboardHTML = markup;
  }

  /**
   * Read HTML from clipboard
   */
  clipboardReadHTML(): string {
    return this.config.clipboardHTML;
  }

  /**
   * Write image to clipboard
   */
  clipboardWriteImage(image: NativeImage): void {
    this.config.clipboardImage = image;
  }

  /**
   * Read image from clipboard
   */
  clipboardReadImage(): NativeImage {
    return this.config.clipboardImage ?? createMockNativeImage();
  }

  /**
   * Copy files to clipboard
   */
  clipboardCopyFiles(paths: string[]): void {
    this.config.clipboardFiles = paths;
  }

  /**
   * Get clipboard files
   */
  getClipboardFiles(): string[] {
    return this.config.clipboardFiles;
  }

  /**
   * Simulate adding an item from path
   */
  async addFromPath(path: string): Promise<string> {
    this.checkError('addFromPath');

    // Extract filename from path
    const filename = path.split('/').pop() ?? 'unknown';
    const ext = filename.split('.').pop() ?? 'png';
    const name = filename.replace(`.${ext}`, '');

    const newItem = createMockItem({ name, ext });

    // Add to cache if exists
    if (this.cachedItems) {
      this.cachedItems.push(newItem);
    }

    console.info('[MockEagle] Added item from path:', path, '→', newItem.id);
    return newItem.id;
  }

  /**
   * Get current locale
   */
  get locale(): EagleLocale {
    return this.config.locale;
  }

  /**
   * Get current theme
   */
  get theme(): EagleTheme {
    return this.config.theme;
  }

  /**
   * Get dark mode status
   */
  get isDarkMode(): boolean {
    return this.config.isDarkMode;
  }

  /**
   * Get platform
   */
  get platform(): 'darwin' | 'win32' {
    return this.config.platform;
  }

  /**
   * Check and throw simulated error if configured
   */
  private checkError(method: keyof MockConfig['simulateErrors']): void {
    const error = this.config.simulateErrors[method];
    if (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Simulated ${method} error`);
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const mockController = new MockController();

// ============================================================================
// Reset Functions (for testing)
// ============================================================================

/**
 * Reset item counter for predictable IDs
 */
export function resetItemCounter(): void {
  itemCounter = 0;
}

/**
 * Reset folder counter for predictable IDs
 */
export function resetFolderCounter(): void {
  folderCounter = 0;
}

/**
 * Reset tag counter for predictable IDs
 */
export function resetTagCounter(): void {
  tagCounter = 0;
}

/**
 * Reset tag group counter for predictable IDs
 */
export function resetTagGroupCounter(): void {
  tagGroupCounter = 0;
}

/**
 * Reset all mock state
 */
export function resetAllMocks(): void {
  resetItemCounter();
  resetFolderCounter();
  resetTagCounter();
  resetTagGroupCounter();
  mockController.reset();
}
