import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createMockItem,
  createMockItems,
  createMockFolder,
  createMockFolders,
  createItemsFromPreset,
  createNestedFolders,
  mockController,
  resetItemCounter,
  resetFolderCounter,
  resetAllMocks,
} from './mock-factory';

describe('Mock Factory', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  afterEach(() => {
    resetAllMocks();
  });

  describe('createMockItem', () => {
    it('creates item with default values', () => {
      const item = createMockItem();

      expect(item.id).toMatch(/^mock-item-/);
      expect(item.ext).toBe('png');
      expect(item.width).toBe(1920);
      expect(item.height).toBe(1080);
      expect(item.isDeleted).toBe(false);
      expect(item.filePath).toContain('/mock/library/');
    });

    it('creates item with custom values', () => {
      const item = createMockItem({
        name: 'Custom Image',
        ext: 'jpg',
        width: 3840,
        height: 2160,
        tags: ['custom', 'test'],
        star: 5,
      });

      expect(item.name).toBe('Custom Image');
      expect(item.ext).toBe('jpg');
      expect(item.width).toBe(3840);
      expect(item.height).toBe(2160);
      expect(item.tags).toEqual(['custom', 'test']);
      expect(item.star).toBe(5);
    });

    it('has working mock methods', async () => {
      const item = createMockItem();

      await expect(item.save()).resolves.toBe(true);
      await expect(item.moveToTrash()).resolves.toBe(true);
      await expect(item.open()).resolves.toBeUndefined();
    });

    it('generates unique IDs', () => {
      const item1 = createMockItem();
      const item2 = createMockItem();

      expect(item1.id).not.toBe(item2.id);
    });
  });

  describe('createMockItems', () => {
    it('creates specified number of items', () => {
      const items = createMockItems(5);

      expect(items).toHaveLength(5);
    });

    it('creates unique items', () => {
      const items = createMockItems(3);
      const ids = items.map((i) => i.id);

      expect(new Set(ids).size).toBe(3);
    });

    it('accepts single options object', () => {
      const items = createMockItems(3, { ext: 'svg' });

      items.forEach((item) => {
        expect(item.ext).toBe('svg');
      });
    });

    it('accepts array of options', () => {
      const items = createMockItems(3, [{ name: 'First' }, { name: 'Second' }, { name: 'Third' }]);

      expect(items[0].name).toBe('First');
      expect(items[1].name).toBe('Second');
      expect(items[2].name).toBe('Third');
    });
  });

  describe('createItemsFromPreset', () => {
    it('creates items with mixed file types', () => {
      const items = createItemsFromPreset(8, 'mixed');
      const extensions = items.map((i) => i.ext);

      expect(new Set(extensions).size).toBeGreaterThan(1);
    });

    it('creates image-only items', () => {
      const items = createItemsFromPreset(4, 'images');
      const validExtensions = ['png', 'jpg', 'webp', 'gif'];

      items.forEach((item) => {
        expect(validExtensions).toContain(item.ext);
      });
    });

    it('creates video items', () => {
      const items = createItemsFromPreset(4, 'videos');
      const validExtensions = ['mp4', 'mov', 'webm', 'gif'];

      items.forEach((item) => {
        expect(validExtensions).toContain(item.ext);
      });
    });

    it('creates document items', () => {
      const items = createItemsFromPreset(4, 'documents');
      const validExtensions = ['pdf', 'doc', 'ppt', 'xls'];

      items.forEach((item) => {
        expect(validExtensions).toContain(item.ext);
      });
    });

    it('assigns random tags', () => {
      const items = createItemsFromPreset(10, 'mixed');
      const hasTags = items.some((item) => item.tags.length > 0);

      // With 10 items, at least some should have tags
      expect(hasTags).toBe(true);
    });

    it('assigns random star ratings', () => {
      const items = createItemsFromPreset(10, 'mixed');
      const stars = items.map((i) => i.star);
      const hasVariety = new Set(stars).size > 1;

      expect(hasVariety).toBe(true);
    });
  });

  describe('createMockFolder', () => {
    it('creates folder with default values', () => {
      const folder = createMockFolder();

      expect(folder.id).toMatch(/^mock-folder-/);
      expect(folder.name).toMatch(/^Folder/);
      expect(folder.icon).toBe('📁');
      expect(folder.children).toEqual([]);
    });

    it('creates folder with custom values', () => {
      const folder = createMockFolder({
        name: 'Custom Folder',
        description: 'Test description',
        icon: '🎨',
        iconColor: '#FF0000',
      });

      expect(folder.name).toBe('Custom Folder');
      expect(folder.description).toBe('Test description');
      expect(folder.icon).toBe('🎨');
      expect(folder.iconColor).toBe('#FF0000');
    });

    it('has working mock methods', async () => {
      const folder = createMockFolder();

      await expect(folder.save()).resolves.toBeUndefined();
      await expect(folder.open()).resolves.toBeUndefined();
    });
  });

  describe('createMockFolders', () => {
    it('creates specified number of folders', () => {
      const folders = createMockFolders(5);

      expect(folders).toHaveLength(5);
    });

    it('assigns different icons and colors', () => {
      const folders = createMockFolders(10);
      const icons = folders.map((f) => f.icon);
      const colors = folders.map((f) => f.iconColor);

      expect(new Set(icons).size).toBeGreaterThan(1);
      expect(new Set(colors).size).toBeGreaterThan(1);
    });
  });

  describe('createNestedFolders', () => {
    it('creates single folder at depth 0', () => {
      const folder = createNestedFolders(0);

      expect(folder.name).toBe('Leaf Folder');
      expect(folder.children).toEqual([]);
    });

    it('creates nested structure at depth 2', () => {
      const folder = createNestedFolders(2);

      expect(folder.name).toBe('Level 2');
      expect(folder.children).toHaveLength(2);
      expect(folder.children[0].name).toBe('Level 1');
    });

    it('respects breadth parameter', () => {
      const folder = createNestedFolders(1, 4);

      expect(folder.children).toHaveLength(4);
    });
  });

  describe('resetItemCounter', () => {
    it('resets counter for predictable IDs', () => {
      createMockItem();
      createMockItem();

      resetItemCounter();

      const item = createMockItem();
      expect(item.id).toBe('mock-item-1');
    });
  });

  describe('resetFolderCounter', () => {
    it('resets counter for predictable IDs', () => {
      createMockFolder();
      createMockFolder();

      resetFolderCounter();

      const folder = createMockFolder();
      expect(folder.id).toBe('mock-folder-1');
    });
  });
});

describe('MockController', () => {
  beforeEach(() => {
    mockController.reset();
  });

  afterEach(() => {
    mockController.reset();
  });

  describe('getConfig', () => {
    it('returns default configuration', () => {
      const config = mockController.getConfig();

      expect(config.selectedItemCount).toBe(2);
      expect(config.totalItemCount).toBe(10);
      expect(config.folderCount).toBe(3);
      expect(config.locale).toBe('en');
      expect(config.theme).toBe('DARK');
    });
  });

  describe('setConfig', () => {
    it('updates configuration', () => {
      mockController.setConfig({ selectedItemCount: 5, totalItemCount: 50 });
      const config = mockController.getConfig();

      expect(config.selectedItemCount).toBe(5);
      expect(config.totalItemCount).toBe(50);
    });

    it('clears cached items on config change', async () => {
      const items1 = await mockController.getAllItems();
      mockController.setConfig({ totalItemCount: 20 });
      const items2 = await mockController.getAllItems();

      expect(items2.length).toBe(20);
      expect(items1.length).not.toBe(items2.length);
    });
  });

  describe('preset', () => {
    it('applies empty preset', async () => {
      mockController.preset('empty');
      const items = await mockController.getSelectedItems();
      const folders = await mockController.getAllFolders();

      expect(items).toHaveLength(0);
      expect(folders).toHaveLength(0);
    });

    it('applies single preset', async () => {
      mockController.preset('single');
      const items = await mockController.getSelectedItems();

      expect(items).toHaveLength(1);
    });

    it('applies largeLibrary preset', async () => {
      mockController.preset('largeLibrary');
      const items = await mockController.getAllItems();

      expect(items).toHaveLength(100);
    });

    it('applies stressTest preset', async () => {
      mockController.preset('stressTest');
      const items = await mockController.getAllItems();

      expect(items).toHaveLength(1000);
    });
  });

  describe('getSelectedItems', () => {
    it('returns configured number of selected items', async () => {
      mockController.setConfig({ selectedItemCount: 3, totalItemCount: 10 });
      const items = await mockController.getSelectedItems();

      expect(items).toHaveLength(3);
    });

    it('respects custom items override', async () => {
      const customItems = createMockItems(2);
      mockController.setConfig({
        customItems,
        selectedItemCount: 1,
      });
      const items = await mockController.getSelectedItems();

      expect(items).toHaveLength(1);
      expect(items[0]).toBe(customItems[0]);
    });
  });

  describe('getAllItems', () => {
    it('returns all items', async () => {
      mockController.setConfig({ totalItemCount: 25 });
      const items = await mockController.getAllItems();

      expect(items).toHaveLength(25);
    });

    it('caches items for performance', async () => {
      const items1 = await mockController.getAllItems();
      const items2 = await mockController.getAllItems();

      expect(items1).toBe(items2); // Same reference = cached
    });
  });

  describe('getItemById', () => {
    it('returns item when found', async () => {
      const items = await mockController.getAllItems();
      const firstItem = items[0];

      const found = await mockController.getItemById(firstItem.id);

      expect(found).toBe(firstItem);
    });

    it('returns undefined when not found', async () => {
      const item = await mockController.getItemById('non-existent-id');

      expect(item).toBeUndefined();
    });
  });

  describe('getAllFolders', () => {
    it('returns configured number of folders', async () => {
      mockController.setConfig({ folderCount: 7 });
      const folders = await mockController.getAllFolders();

      expect(folders).toHaveLength(7);
    });
  });

  describe('addFromPath', () => {
    it('creates new item from path', async () => {
      const id = await mockController.addFromPath('/path/to/image.png');

      expect(id).toMatch(/^mock-item-/);
    });

    it('adds item to cache if cache exists', async () => {
      // First trigger cache creation by getting all items
      const initialItems = await mockController.getAllItems();
      const initialCount = initialItems.length;

      // Add a new item - this should add to the existing cache
      await mockController.addFromPath('/path/to/new-image.jpg');

      // Get items again - should include the new item since cache already existed
      const newItems = await mockController.getAllItems();
      expect(newItems.length).toBe(initialCount + 1);
      expect(newItems[newItems.length - 1].name).toContain('new-image');
    });
  });

  describe('error simulation', () => {
    it('throws simulated error when configured', async () => {
      mockController.simulateError('getSelectedItems', 'Test error');

      await expect(mockController.getSelectedItems()).rejects.toThrow('Test error');
    });

    it('clearErrors removes error simulation', async () => {
      mockController.simulateError('getSelectedItems');
      mockController.clearErrors();

      await expect(mockController.getSelectedItems()).resolves.toBeDefined();
    });
  });

  describe('locale property', () => {
    it('returns configured locale', () => {
      mockController.setConfig({ locale: 'ja_JP' });

      expect(mockController.locale).toBe('ja_JP');
    });
  });

  describe('theme property', () => {
    it('returns configured theme', () => {
      mockController.setConfig({ theme: 'LIGHT' });

      expect(mockController.theme).toBe('LIGHT');
    });
  });

  describe('isDarkMode property', () => {
    it('returns true for dark theme', () => {
      mockController.setConfig({ isDarkMode: true });

      expect(mockController.isDarkMode).toBe(true);
    });

    it('returns false for light theme', () => {
      mockController.setConfig({ isDarkMode: false });

      expect(mockController.isDarkMode).toBe(false);
    });
  });

  describe('platform property', () => {
    it('returns configured platform', () => {
      mockController.setConfig({ platform: 'win32' });

      expect(mockController.platform).toBe('win32');
    });
  });

  describe('reset', () => {
    it('restores default configuration', () => {
      mockController.setConfig({
        selectedItemCount: 100,
        locale: 'ja_JP',
        theme: 'LIGHT',
      });
      mockController.reset();

      const config = mockController.getConfig();
      expect(config.selectedItemCount).toBe(2);
      expect(config.locale).toBe('en');
      expect(config.theme).toBe('DARK');
    });
  });
});
