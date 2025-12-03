/**
 * Tests for lib/eagle-api.ts
 * EagleAPIAdapter with mock support and environment detection
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createMockItem,
  createMockItems,
  createMockFolder,
  resetAllMocks,
} from '@/__tests__/mocks/eagle.mock';

// We need to test the module in isolation, so we'll test the exported functions
// The module auto-detects environment on import, so we test the mock mode

describe('Eagle API Environment Detection', () => {
  describe('isEagleEnvironment', () => {
    it('returns false when window.eagle is undefined', async () => {
      // In test environment, window.eagle should be undefined
      const { isEagleEnvironment } = await import('@/lib/eagle-api');
      expect(isEagleEnvironment()).toBe(false);
    });

    it('returns true when window.eagle is defined', async () => {
      // Temporarily define window.eagle with minimal mock
      const mockEagle = { app: {}, item: {}, folder: {} };
      Object.defineProperty(window, 'eagle', {
        value: mockEagle,
        writable: true,
        configurable: true,
      });

      // Need fresh import to re-evaluate
      const { isEagleEnvironment } = await import('@/lib/eagle-api');
      expect(isEagleEnvironment()).toBe(true);

      // Cleanup
      Object.defineProperty(window, 'eagle', {
        value: undefined,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('hasNodeRequire', () => {
    it('returns false when window.require is undefined', async () => {
      const { hasNodeRequire } = await import('@/lib/eagle-api');
      expect(hasNodeRequire()).toBe(false);
    });
  });
});

describe('EagleAPIAdapter (Mock Mode)', () => {
  let eagleApi: typeof import('@/lib/eagle-api').eagleApi;

  beforeEach(async () => {
    resetAllMocks();
    // Fresh import to get clean adapter instance
    const module = await import('@/lib/eagle-api');
    eagleApi = module.eagleApi;
  });

  describe('isMock property', () => {
    it('returns true in test environment', () => {
      expect(eagleApi.isMock).toBe(true);
    });
  });

  describe('locale property', () => {
    it('returns default locale', () => {
      expect(eagleApi.locale).toBe('en');
    });
  });

  describe('theme property', () => {
    it('returns default theme', () => {
      expect(eagleApi.theme).toBe('DARK');
    });
  });

  describe('isDarkMode property', () => {
    it('returns true for dark theme', () => {
      expect(eagleApi.isDarkMode).toBe(true);
    });
  });

  describe('platform property', () => {
    it('returns platform string', () => {
      expect(['darwin', 'win32']).toContain(eagleApi.platform);
    });
  });

  describe('isMac and isWindows properties', () => {
    it('returns consistent platform flags', () => {
      const { isMac, isWindows, platform } = eagleApi;

      if (platform === 'darwin') {
        expect(isMac).toBe(true);
        expect(isWindows).toBe(false);
      } else {
        expect(isMac).toBe(false);
        expect(isWindows).toBe(true);
      }
    });
  });

  describe('getSelectedItems', () => {
    it('returns array of items', async () => {
      const items = await eagleApi.getSelectedItems();
      expect(Array.isArray(items)).toBe(true);
    });

    it('returns items with expected properties', async () => {
      const items = await eagleApi.getSelectedItems();

      if (items.length > 0) {
        const item = items[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('ext');
        expect(item).toHaveProperty('filePath');
        expect(item).toHaveProperty('width');
        expect(item).toHaveProperty('height');
      }
    });
  });

  describe('getAllItems', () => {
    it('returns array of items', async () => {
      const items = await eagleApi.getAllItems();
      expect(Array.isArray(items)).toBe(true);
    });
  });

  describe('getItemById', () => {
    it('returns item or null', async () => {
      const item = await eagleApi.getItemById('mock-1');
      // Mock always returns first item or the item if found
      expect(item === null || typeof item === 'object').toBe(true);
    });
  });

  describe('getAllFolders', () => {
    it('returns array of folders', async () => {
      const folders = await eagleApi.getAllFolders();
      expect(Array.isArray(folders)).toBe(true);
    });
  });

  describe('getSelectedFolders', () => {
    it('returns array of folders', async () => {
      const folders = await eagleApi.getSelectedFolders();
      expect(Array.isArray(folders)).toBe(true);
    });
  });

  describe('addItemFromPath', () => {
    it('returns item ID string', async () => {
      const id = await eagleApi.addItemFromPath('/path/to/image.png');
      expect(typeof id).toBe('string');
    });

    it('accepts options', async () => {
      const id = await eagleApi.addItemFromPath('/path/to/image.png', {
        name: 'Custom Name',
        tags: ['tag1', 'tag2'],
        folders: ['folder-1'],
      });
      expect(typeof id).toBe('string');
    });
  });

  describe('addItemFromBase64', () => {
    it('returns item ID string', async () => {
      const base64 =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const id = await eagleApi.addItemFromBase64(base64);
      expect(typeof id).toBe('string');
    });
  });

  describe('setAlwaysOnTop', () => {
    it('does not throw', async () => {
      await expect(eagleApi.setAlwaysOnTop(true)).resolves.toBeUndefined();
      await expect(eagleApi.setAlwaysOnTop(false)).resolves.toBeUndefined();
    });
  });

  describe('setWindowSize', () => {
    it('does not throw', async () => {
      await expect(eagleApi.setWindowSize(800, 600)).resolves.toBeUndefined();
    });
  });

  describe('showNotification', () => {
    it('does not throw', async () => {
      await expect(eagleApi.showNotification('Title', 'Description')).resolves.toBeUndefined();
    });

    it('accepts options', async () => {
      await expect(
        eagleApi.showNotification('Title', 'Description', {
          icon: 'info',
          mute: true,
          duration: 3000,
        })
      ).resolves.toBeUndefined();
    });
  });

  describe('showOpenDialog', () => {
    it('returns dialog result', async () => {
      const result = await eagleApi.showOpenDialog({
        title: 'Open File',
        properties: ['openFile'],
      });

      expect(result).toHaveProperty('canceled');
      expect(result).toHaveProperty('filePaths');
      expect(Array.isArray(result.filePaths)).toBe(true);
    });
  });

  describe('showSaveDialog', () => {
    it('returns dialog result', async () => {
      const result = await eagleApi.showSaveDialog({
        title: 'Save File',
      });

      expect(result).toHaveProperty('canceled');
    });
  });

  describe('showMessageBox', () => {
    it('returns response', async () => {
      const result = await eagleApi.showMessageBox({
        message: 'Test message',
        buttons: ['OK', 'Cancel'],
      });

      expect(result).toHaveProperty('response');
      expect(typeof result.response).toBe('number');
    });
  });

  describe('openExternal', () => {
    it('does not throw', async () => {
      await expect(eagleApi.openExternal('https://example.com')).resolves.toBeUndefined();
    });
  });

  describe('showItemInFolder', () => {
    it('does not throw', async () => {
      await expect(eagleApi.showItemInFolder('/path/to/file')).resolves.toBeUndefined();
    });
  });

  describe('log methods', () => {
    it('has info method', () => {
      expect(typeof eagleApi.log.info).toBe('function');
      expect(() => eagleApi.log.info('test')).not.toThrow();
    });

    it('has warn method', () => {
      expect(typeof eagleApi.log.warn).toBe('function');
      expect(() => eagleApi.log.warn('test')).not.toThrow();
    });

    it('has error method', () => {
      expect(typeof eagleApi.log.error).toBe('function');
      expect(() => eagleApi.log.error('test')).not.toThrow();
    });

    it('has debug method', () => {
      expect(typeof eagleApi.log.debug).toBe('function');
      expect(() => eagleApi.log.debug('test')).not.toThrow();
    });
  });
});

describe('Mock Factories', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('createMockItem', () => {
    it('creates item with default values', () => {
      const item = createMockItem();

      expect(item.id).toMatch(/^mock-item-/);
      expect(item.name).toMatch(/^Test Image/);
      expect(item.ext).toBe('png');
      expect(item.width).toBe(1920);
      expect(item.height).toBe(1080);
      expect(item.size).toBe(1024000);
      expect(item.tags).toEqual([]);
      expect(item.folders).toEqual([]);
    });

    it('creates item with custom values', () => {
      const item = createMockItem({
        id: 'custom-id',
        name: 'Custom Name',
        ext: 'jpg',
        width: 3840,
        height: 2160,
        tags: ['custom', 'test'],
      });

      expect(item.id).toBe('custom-id');
      expect(item.name).toBe('Custom Name');
      expect(item.ext).toBe('jpg');
      expect(item.width).toBe(3840);
      expect(item.height).toBe(2160);
      expect(item.tags).toEqual(['custom', 'test']);
    });

    it('has working mock methods', async () => {
      const item = createMockItem();

      await expect(item.save()).resolves.toBe(true);
      await expect(item.moveToTrash()).resolves.toBe(true);
      await expect(item.open()).resolves.toBeUndefined();
    });
  });

  describe('createMockItems', () => {
    it('creates specified number of items', () => {
      const items = createMockItems(5);
      expect(items).toHaveLength(5);
    });

    it('creates unique items', () => {
      const items = createMockItems(10);
      const ids = items.map((i) => i.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });

    it('applies custom options to each item', () => {
      const items = createMockItems(3, [{ ext: 'png' }, { ext: 'jpg' }, { ext: 'svg' }]);

      expect(items[0].ext).toBe('png');
      expect(items[1].ext).toBe('jpg');
      expect(items[2].ext).toBe('svg');
    });
  });

  describe('createMockFolder', () => {
    it('creates folder with default values', () => {
      const folder = createMockFolder();

      expect(folder.id).toMatch(/^mock-folder-/);
      expect(folder.name).toMatch(/^Test Folder/);
      expect(folder.icon).toBe('📁');
      expect(folder.children).toEqual([]);
    });

    it('creates folder with custom values', () => {
      const folder = createMockFolder({
        id: 'custom-folder',
        name: 'My Folder',
        description: 'Test description',
        icon: '📷',
        iconColor: '#FF0000',
      });

      expect(folder.id).toBe('custom-folder');
      expect(folder.name).toBe('My Folder');
      expect(folder.description).toBe('Test description');
      expect(folder.icon).toBe('📷');
      expect(folder.iconColor).toBe('#FF0000');
    });

    it('has working mock methods', async () => {
      const folder = createMockFolder();

      await expect(folder.save()).resolves.toBeUndefined();
      await expect(folder.open()).resolves.toBeUndefined();
    });
  });
});
