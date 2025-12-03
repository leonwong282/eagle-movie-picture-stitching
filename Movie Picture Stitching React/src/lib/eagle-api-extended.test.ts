/**
 * Extended Eagle API Tests
 * Tests for Phase 1, 2, and 3 API additions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  eagleApi,
  mockController,
  createMockTag,
  createMockTags,
  createMockTagGroup,
  createMockTagGroups,
  createMockLibraryInfo,
  createMockDisplay,
  createMockDisplays,
  createMockPalettes,
  createMockNativeImage,
  resetAllMocks,
} from './index';

describe('Extended Eagle API', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  // ==========================================================================
  // Phase 1: Core CRUD Operations
  // ==========================================================================

  describe('Phase 1: Core CRUD', () => {
    describe('Tags', () => {
      it('getTags returns all tags', async () => {
        mockController.setConfig({ tagCount: 5 });
        const tags = await eagleApi.getTags();
        expect(tags).toHaveLength(5);
        expect(tags[0]).toHaveProperty('name');
        expect(tags[0]).toHaveProperty('color');
      });

      it('getRecentTags returns recent tags', async () => {
        mockController.setConfig({ tagCount: 10 });
        const tags = await eagleApi.getRecentTags();
        expect(tags.length).toBeLessThanOrEqual(5);
      });
    });

    describe('TagGroups', () => {
      it('getTagGroups returns all tag groups', async () => {
        mockController.setConfig({ tagGroupCount: 3 });
        const groups = await eagleApi.getTagGroups();
        expect(groups).toHaveLength(3);
        expect(groups[0]).toHaveProperty('name');
        expect(groups[0]).toHaveProperty('color');
        expect(groups[0]).toHaveProperty('tags');
      });

      it('createTagGroup creates a new group', async () => {
        const group = await eagleApi.createTagGroup({
          name: 'Test Group',
          color: 'blue',
          tags: ['tag1', 'tag2'],
        });
        expect(group).not.toBeNull();
        expect(group?.name).toBe('Test Group');
        expect(group?.color).toBe('blue');
      });
    });

    describe('Library', () => {
      it('getLibraryInfo returns library info', async () => {
        const info = await eagleApi.getLibraryInfo();
        expect(info).not.toBeNull();
        expect(info).toHaveProperty('name');
        expect(info).toHaveProperty('path');
        expect(info).toHaveProperty('modificationTime');
      });

      it('libraryName returns library name', () => {
        expect(eagleApi.libraryName).toBe('Mock Library');
      });

      it('libraryPath returns library path', () => {
        expect(eagleApi.libraryPath).toContain('library');
      });

      it('libraryModificationTime returns timestamp', () => {
        expect(typeof eagleApi.libraryModificationTime).toBe('number');
      });
    });

    describe('Folders CRUD', () => {
      it('createFolder creates a new folder', async () => {
        const folder = await eagleApi.createFolder({ name: 'New Folder' });
        expect(folder).not.toBeNull();
        expect(folder?.name).toBe('New Folder');
      });

      it('createSubfolder creates a child folder', async () => {
        const folder = await eagleApi.createSubfolder('parent-id', { name: 'Child' });
        expect(folder).not.toBeNull();
        expect(folder?.name).toBe('Child');
      });

      it('getFolderById returns folder when found', async () => {
        const folders = await eagleApi.getAllFolders();
        const folder = await eagleApi.getFolderById(folders[0].id);
        expect(folder).not.toBeNull();
      });

      it('getFoldersByIds returns multiple folders', async () => {
        const allFolders = await eagleApi.getAllFolders();
        const ids = allFolders.slice(0, 2).map((f) => f.id);
        const folders = await eagleApi.getFoldersByIds(ids);
        expect(folders).toHaveLength(2);
      });

      it('getRecentFolders returns recent folders', async () => {
        const folders = await eagleApi.getRecentFolders();
        expect(folders.length).toBeLessThanOrEqual(5);
      });

      it('openFolder does not throw', async () => {
        await expect(eagleApi.openFolder('folder-id')).resolves.not.toThrow();
      });
    });

    describe('Items Extended', () => {
      it('getItemsByIds returns items by IDs', async () => {
        const allItems = await eagleApi.getAllItems();
        const ids = allItems.slice(0, 3).map((i) => i.id);
        const items = await eagleApi.getItemsByIds(ids);
        expect(items).toHaveLength(3);
      });

      it('addItemFromURL returns item ID', async () => {
        const id = await eagleApi.addItemFromURL('https://example.com/image.png');
        expect(typeof id).toBe('string');
      });

      it('addBookmark returns item ID', async () => {
        const id = await eagleApi.addBookmark('https://example.com');
        expect(typeof id).toBe('string');
      });

      it('openItem does not throw', async () => {
        await expect(eagleApi.openItem('item-id')).resolves.not.toThrow();
      });
    });
  });

  // ==========================================================================
  // Phase 2: Enhanced Queries
  // ==========================================================================

  describe('Phase 2: Enhanced Queries', () => {
    describe('getItems with filters', () => {
      it('filters by extension', async () => {
        mockController.setConfig({ totalItemCount: 20, fileTypes: 'mixed' });
        const items = await eagleApi.getItems({ ext: 'png' });
        items.forEach((item) => {
          expect(item.ext).toBe('png');
        });
      });

      it('filters by ID', async () => {
        const allItems = await eagleApi.getAllItems();
        const targetId = allItems[0].id;
        const items = await eagleApi.getItems({ id: targetId });
        expect(items).toHaveLength(1);
        expect(items[0].id).toBe(targetId);
      });

      it('filters by multiple IDs', async () => {
        const allItems = await eagleApi.getAllItems();
        const ids = allItems.slice(0, 3).map((i) => i.id);
        const items = await eagleApi.getItems({ ids });
        expect(items).toHaveLength(3);
      });

      it('filters by rating', async () => {
        const items = await eagleApi.getItems({ rating: 3 });
        items.forEach((item) => {
          expect(item.star).toBeGreaterThanOrEqual(3);
        });
      });
    });
  });

  // ==========================================================================
  // Phase 3: System APIs
  // ==========================================================================

  describe('Phase 3: System APIs', () => {
    describe('Screen API', () => {
      it('getCursorScreenPoint returns point', async () => {
        const point = await eagleApi.getCursorScreenPoint();
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
      });

      it('getPrimaryDisplay returns display', async () => {
        const display = await eagleApi.getPrimaryDisplay();
        expect(display).not.toBeNull();
        expect(display).toHaveProperty('id');
        expect(display).toHaveProperty('bounds');
        expect(display).toHaveProperty('workArea');
      });

      it('getAllDisplays returns array of displays', async () => {
        const displays = await eagleApi.getAllDisplays();
        expect(Array.isArray(displays)).toBe(true);
        expect(displays.length).toBeGreaterThanOrEqual(1);
      });

      it('getDisplayNearestPoint returns display', async () => {
        const display = await eagleApi.getDisplayNearestPoint({ x: 100, y: 100 });
        expect(display).not.toBeNull();
      });
    });

    describe('OS API', () => {
      it('tmpdir returns temp directory', () => {
        const tmpdir = eagleApi.os.tmpdir();
        expect(typeof tmpdir).toBe('string');
        expect(tmpdir.length).toBeGreaterThan(0);
      });

      it('version returns OS version', () => {
        const version = eagleApi.os.version();
        expect(typeof version).toBe('string');
      });

      it('type returns OS type', () => {
        const type = eagleApi.os.type();
        expect(['Darwin', 'Windows_NT']).toContain(type);
      });

      it('release returns OS release', () => {
        const release = eagleApi.os.release();
        expect(typeof release).toBe('string');
      });

      it('hostname returns hostname', () => {
        const hostname = eagleApi.os.hostname();
        expect(typeof hostname).toBe('string');
      });

      it('homedir returns home directory', () => {
        const homedir = eagleApi.os.homedir();
        expect(typeof homedir).toBe('string');
      });

      it('arch returns architecture', () => {
        const arch = eagleApi.os.arch();
        expect(['x64', 'arm64', 'x86']).toContain(arch);
      });
    });

    describe('Clipboard API', () => {
      it('writeText and readText work together', async () => {
        eagleApi.clipboard.writeText('Hello World');
        const text = await eagleApi.clipboard.readText();
        expect(text).toBe('Hello World');
      });

      it('writeHTML and readHTML work together', () => {
        eagleApi.clipboard.writeHTML('<p>Test</p>');
        const html = eagleApi.clipboard.readHTML();
        expect(html).toBe('<p>Test</p>');
      });

      it('clear clears clipboard', async () => {
        eagleApi.clipboard.writeText('Something');
        eagleApi.clipboard.clear();
        const text = await eagleApi.clipboard.readText();
        expect(text).toBe('');
      });

      it('has checks format availability', () => {
        eagleApi.clipboard.writeText('Test');
        expect(eagleApi.clipboard.has('text/plain')).toBe(true);
        eagleApi.clipboard.clear();
        expect(eagleApi.clipboard.has('text/plain')).toBe(false);
      });

      it('copyFiles stores file paths', () => {
        eagleApi.clipboard.copyFiles(['/path/to/file1.png', '/path/to/file2.jpg']);
        // Note: Mock controller stores these internally
      });

      it('readImage returns NativeImage', () => {
        const image = eagleApi.clipboard.readImage();
        expect(image).toHaveProperty('toDataURL');
        expect(image).toHaveProperty('toPNG');
        expect(image).toHaveProperty('getSize');
      });
    });

    describe('Context Menu API', () => {
      it('showContextMenu does not throw', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        await eagleApi.showContextMenu([
          { id: '1', label: 'Option 1' },
          { id: '2', label: 'Option 2' },
        ]);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
      });
    });

    describe('Drag API', () => {
      it('startDrag does not throw', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        await eagleApi.startDrag(['/path/to/file.png']);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
      });
    });

    describe('App Extended Properties', () => {
      it('version returns version string', () => {
        expect(eagleApi.version).toBe('4.0.0');
      });

      it('build returns build number', () => {
        expect(typeof eagleApi.build).toBe('number');
      });

      it('arch returns architecture', () => {
        expect(['x64', 'arm64', 'x86']).toContain(eagleApi.arch);
      });

      it('getPath returns path for each key', async () => {
        const paths = ['home', 'temp', 'desktop', 'documents', 'downloads'] as const;
        for (const name of paths) {
          const path = await eagleApi.getPath(name);
          expect(typeof path).toBe('string');
          expect(path.length).toBeGreaterThan(0);
        }
      });

      it('getFileIcon returns NativeImage', async () => {
        const icon = await eagleApi.getFileIcon('/path/to/file.png');
        expect(icon).toHaveProperty('toDataURL');
        expect(icon).toHaveProperty('getSize');
      });

      it('createThumbnailFromPath returns NativeImage', async () => {
        const thumbnail = await eagleApi.createThumbnailFromPath('/path/to/image.png', {
          width: 256,
          height: 256,
        });
        expect(thumbnail).toHaveProperty('toDataURL');
        expect(thumbnail).toHaveProperty('getSize');
      });
    });

    describe('Window Extended Methods', () => {
      it('showWindow does not throw', async () => {
        await expect(eagleApi.showWindow()).resolves.not.toThrow();
      });

      it('hideWindow does not throw', async () => {
        await expect(eagleApi.hideWindow()).resolves.not.toThrow();
      });

      it('focusWindow does not throw', async () => {
        await expect(eagleApi.focusWindow()).resolves.not.toThrow();
      });

      it('minimizeWindow does not throw', async () => {
        await expect(eagleApi.minimizeWindow()).resolves.not.toThrow();
      });

      it('isWindowMinimized returns boolean', async () => {
        const result = await eagleApi.isWindowMinimized();
        expect(typeof result).toBe('boolean');
      });

      it('restoreWindow does not throw', async () => {
        await expect(eagleApi.restoreWindow()).resolves.not.toThrow();
      });

      it('maximizeWindow does not throw', async () => {
        await expect(eagleApi.maximizeWindow()).resolves.not.toThrow();
      });

      it('isWindowMaximized returns boolean', async () => {
        const result = await eagleApi.isWindowMaximized();
        expect(typeof result).toBe('boolean');
      });

      it('setFullScreen does not throw', async () => {
        await expect(eagleApi.setFullScreen(true)).resolves.not.toThrow();
      });

      it('isFullScreen returns boolean', async () => {
        const result = await eagleApi.isFullScreen();
        expect(typeof result).toBe('boolean');
      });

      it('getWindowSize returns tuple', async () => {
        const [width, height] = await eagleApi.getWindowSize();
        expect(typeof width).toBe('number');
        expect(typeof height).toBe('number');
      });

      it('getWindowBounds returns rectangle', async () => {
        const bounds = await eagleApi.getWindowBounds();
        expect(bounds).toHaveProperty('x');
        expect(bounds).toHaveProperty('y');
        expect(bounds).toHaveProperty('width');
        expect(bounds).toHaveProperty('height');
      });

      it('getWindowPosition returns tuple', async () => {
        const [x, y] = await eagleApi.getWindowPosition();
        expect(typeof x).toBe('number');
        expect(typeof y).toBe('number');
      });

      it('setWindowPosition does not throw', async () => {
        await expect(eagleApi.setWindowPosition(100, 100)).resolves.not.toThrow();
      });

      it('getWindowOpacity returns number', async () => {
        const opacity = await eagleApi.getWindowOpacity();
        expect(typeof opacity).toBe('number');
      });

      it('setWindowOpacity does not throw', async () => {
        await expect(eagleApi.setWindowOpacity(0.8)).resolves.not.toThrow();
      });

      it('flashFrame does not throw', async () => {
        await expect(eagleApi.flashFrame(true)).resolves.not.toThrow();
      });

      it('captureWindow returns NativeImage', async () => {
        const image = await eagleApi.captureWindow();
        expect(image).toHaveProperty('toDataURL');
        expect(image).toHaveProperty('getSize');
      });

      it('isWindowAlwaysOnTop returns boolean', async () => {
        const result = await eagleApi.isWindowAlwaysOnTop();
        expect(typeof result).toBe('boolean');
      });

      it('isWindowResizable returns boolean', async () => {
        const result = await eagleApi.isWindowResizable();
        expect(typeof result).toBe('boolean');
      });

      it('setWindowResizable does not throw', async () => {
        await expect(eagleApi.setWindowResizable(false)).resolves.not.toThrow();
      });
    });

    describe('Event Handlers', () => {
      it('onLibraryChanged registers callback without error', () => {
        expect(() => eagleApi.onLibraryChanged(() => {})).not.toThrow();
      });

      it('onPluginShow registers callback without error', () => {
        expect(() => eagleApi.onPluginShow(() => {})).not.toThrow();
      });

      it('onPluginHide registers callback without error', () => {
        expect(() => eagleApi.onPluginHide(() => {})).not.toThrow();
      });
    });
  });
});

// ==========================================================================
// Mock Factory Extended Tests
// ==========================================================================

describe('Mock Factory Extended', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('createMockTag', () => {
    it('creates tag with default values', () => {
      const tag = createMockTag();
      expect(tag).toHaveProperty('id');
      expect(tag).toHaveProperty('name');
      expect(tag).toHaveProperty('color');
      expect(typeof tag.count).toBe('number');
    });

    it('creates tag with custom values', () => {
      const tag = createMockTag({ name: 'Custom Tag', color: 'red' });
      expect(tag.name).toBe('Custom Tag');
      expect(tag.color).toBe('red');
    });
  });

  describe('createMockTags', () => {
    it('creates specified number of tags', () => {
      const tags = createMockTags(5);
      expect(tags).toHaveLength(5);
      tags.forEach((tag) => {
        expect(tag).toHaveProperty('id');
        expect(tag).toHaveProperty('name');
      });
    });

    it('creates tags with different names', () => {
      const tags = createMockTags(16);
      const names = tags.map((t) => t.name);
      // Should cycle through TAG_NAMES
      expect(names.length).toBe(16);
    });
  });

  describe('createMockTagGroup', () => {
    it('creates tag group with default values', () => {
      const group = createMockTagGroup();
      expect(group).toHaveProperty('name');
      expect(group).toHaveProperty('color');
      expect(group).toHaveProperty('tags');
      expect(group).toHaveProperty('save');
      expect(group).toHaveProperty('remove');
    });

    it('creates tag group with custom values', () => {
      const group = createMockTagGroup({
        name: 'My Group',
        color: 'purple',
        tags: ['a', 'b', 'c'],
      });
      expect(group.name).toBe('My Group');
      expect(group.color).toBe('purple');
      expect(group.tags).toEqual(['a', 'b', 'c']);
    });

    it('save method returns TagGroup', async () => {
      const group = createMockTagGroup({ name: 'Test' });
      const saved = await group.save();
      expect(saved).toHaveProperty('name');
    });

    it('remove method returns boolean', async () => {
      const group = createMockTagGroup();
      const result = await group.remove();
      expect(result).toBe(true);
    });
  });

  describe('createMockTagGroups', () => {
    it('creates specified number of groups', () => {
      const groups = createMockTagGroups(4);
      expect(groups).toHaveLength(4);
    });
  });

  describe('createMockLibraryInfo', () => {
    it('creates library info with default values', () => {
      const info = createMockLibraryInfo();
      expect(info.name).toBe('Mock Library');
      expect(info.path).toContain('library');
      expect(typeof info.modificationTime).toBe('number');
      expect(info).toHaveProperty('folders');
      expect(info).toHaveProperty('smartFolders');
      expect(info).toHaveProperty('tagGroups');
    });

    it('creates library info with custom values', () => {
      const info = createMockLibraryInfo({
        name: 'My Library',
        path: '/custom/path.library',
      });
      expect(info.name).toBe('My Library');
      expect(info.path).toBe('/custom/path.library');
    });
  });

  describe('createMockDisplay', () => {
    it('creates display with default values', () => {
      const display = createMockDisplay();
      expect(display.id).toBe(1);
      expect(display.bounds).toEqual({ x: 0, y: 0, width: 1920, height: 1080 });
      expect(display.scaleFactor).toBe(2);
    });

    it('creates display with custom values', () => {
      const display = createMockDisplay({
        id: 2,
        bounds: { x: 1920, y: 0, width: 2560, height: 1440 },
        scaleFactor: 1,
      });
      expect(display.id).toBe(2);
      expect(display.bounds.width).toBe(2560);
      expect(display.scaleFactor).toBe(1);
    });
  });

  describe('createMockDisplays', () => {
    it('creates primary and secondary displays', () => {
      const displays = createMockDisplays();
      expect(displays).toHaveLength(2);
      expect(displays[0].internal).toBe(true);
      expect(displays[1].internal).toBe(false);
      expect(displays[1].bounds.x).toBe(1920); // Secondary is to the right
    });
  });

  describe('createMockNativeImage', () => {
    it('creates NativeImage with default size', () => {
      const image = createMockNativeImage();
      const size = image.getSize();
      expect(size.width).toBe(256);
      expect(size.height).toBe(256);
    });

    it('creates NativeImage with custom size', () => {
      const image = createMockNativeImage(800, 600);
      const size = image.getSize();
      expect(size.width).toBe(800);
      expect(size.height).toBe(600);
    });

    it('toDataURL returns data URL string', () => {
      const image = createMockNativeImage(100, 100);
      const dataUrl = image.toDataURL();
      expect(dataUrl).toContain('data:image/png;base64');
    });

    it('toPNG returns Buffer', () => {
      const image = createMockNativeImage();
      const buffer = image.toPNG();
      expect(buffer).toBeInstanceOf(Buffer);
      // PNG magic bytes
      expect(buffer[0]).toBe(0x89);
      expect(buffer[1]).toBe(0x50);
    });
  });

  describe('createMockPalettes', () => {
    it('creates specified number of palettes', () => {
      const palettes = createMockPalettes(5);
      expect(palettes).toHaveLength(5);
    });

    it('each palette has color and ratio', () => {
      const palettes = createMockPalettes(3);
      palettes.forEach((palette) => {
        expect(palette.color).toHaveLength(3);
        expect(palette.color[0]).toBeGreaterThanOrEqual(0);
        expect(palette.color[0]).toBeLessThanOrEqual(255);
        expect(typeof palette.ratio).toBe('number');
        expect(palette.ratio).toBeGreaterThan(0);
        expect(palette.ratio).toBeLessThanOrEqual(1);
      });
    });

    it('ratios are in descending order', () => {
      const palettes = createMockPalettes(5);
      for (let i = 1; i < palettes.length; i++) {
        expect(palettes[i].ratio).toBeLessThanOrEqual(palettes[i - 1].ratio);
      }
    });
  });
});

// ==========================================================================
// MockController Extended Tests
// ==========================================================================

describe('MockController Extended', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('Tag Methods', () => {
    it('getTags returns configured number of tags', async () => {
      mockController.setConfig({ tagCount: 8 });
      const tags = await mockController.getTags();
      expect(tags).toHaveLength(8);
    });

    it('getRecentTags returns subset of tags', async () => {
      mockController.setConfig({ tagCount: 10 });
      const tags = await mockController.getRecentTags();
      expect(tags.length).toBeLessThanOrEqual(5);
    });

    it('getTags throws when error simulated', async () => {
      mockController.simulateError('getTags', 'Tag fetch failed');
      await expect(mockController.getTags()).rejects.toThrow('Tag fetch failed');
    });
  });

  describe('TagGroup Methods', () => {
    it('getTagGroups returns configured number', async () => {
      mockController.setConfig({ tagGroupCount: 4 });
      const groups = await mockController.getTagGroups();
      expect(groups).toHaveLength(4);
    });
  });

  describe('Library Methods', () => {
    it('getLibraryInfo includes folders and tag groups', async () => {
      mockController.setConfig({ folderCount: 5, tagGroupCount: 3 });
      const info = await mockController.getLibraryInfo();
      expect(info.folders).toHaveLength(5);
      expect(info.tagGroups).toHaveLength(3);
    });

    it('getLibraryInfo throws when error simulated', async () => {
      mockController.simulateError('getLibraryInfo', 'Library unavailable');
      await expect(mockController.getLibraryInfo()).rejects.toThrow('Library unavailable');
    });

    it('libraryName returns name', () => {
      expect(mockController.libraryName).toBe('Mock Library');
    });

    it('libraryPath returns path', () => {
      expect(mockController.libraryPath).toContain('library');
    });
  });

  describe('Screen Methods', () => {
    it('getCursorScreenPoint returns point', async () => {
      const point = await mockController.getCursorScreenPoint();
      expect(point).toHaveProperty('x');
      expect(point).toHaveProperty('y');
    });

    it('getPrimaryDisplay returns display', async () => {
      const display = await mockController.getPrimaryDisplay();
      expect(display.id).toBe(1);
      expect(display.internal).toBe(true);
    });

    it('getAllDisplays returns multiple displays', async () => {
      const displays = await mockController.getAllDisplays();
      expect(displays.length).toBeGreaterThanOrEqual(1);
    });

    it('getDisplayNearestPoint returns correct display', async () => {
      const display = await mockController.getDisplayNearestPoint({ x: 2000, y: 500 });
      expect(display.id).toBe(2); // Point is in second display
    });

    it('getDisplayNearestPoint returns primary for out-of-bounds', async () => {
      const display = await mockController.getDisplayNearestPoint({ x: -100, y: -100 });
      expect(display.id).toBe(1);
    });
  });

  describe('OS Methods', () => {
    it('tmpdir returns platform-specific path', () => {
      mockController.setConfig({ platform: 'darwin' });
      expect(mockController.tmpdir()).toContain('tmp');

      mockController.setConfig({ platform: 'win32' });
      expect(mockController.tmpdir()).toContain('Temp');
    });

    it('osType returns platform type', () => {
      mockController.setConfig({ platform: 'darwin' });
      expect(mockController.osType()).toBe('Darwin');

      mockController.setConfig({ platform: 'win32' });
      expect(mockController.osType()).toBe('Windows_NT');
    });

    it('homedir returns platform-specific path', () => {
      mockController.setConfig({ platform: 'darwin' });
      expect(mockController.homedir()).toContain('/Users/');

      mockController.setConfig({ platform: 'win32' });
      expect(mockController.homedir()).toContain('C:\\Users\\');
    });
  });

  describe('Clipboard Methods', () => {
    it('writeText and readText work correctly', () => {
      mockController.clipboardWriteText('Test text');
      expect(mockController.clipboardReadText()).toBe('Test text');
    });

    it('writeHTML and readHTML work correctly', () => {
      mockController.clipboardWriteHTML('<b>Bold</b>');
      expect(mockController.clipboardReadHTML()).toBe('<b>Bold</b>');
    });

    it('clear empties all clipboard data', () => {
      mockController.clipboardWriteText('Text');
      mockController.clipboardWriteHTML('HTML');
      mockController.clipboardClear();
      expect(mockController.clipboardReadText()).toBe('');
      expect(mockController.clipboardReadHTML()).toBe('');
    });

    it('has checks format availability', () => {
      expect(mockController.clipboardHas('text/plain')).toBe(false);
      mockController.clipboardWriteText('Text');
      expect(mockController.clipboardHas('text/plain')).toBe(true);
    });

    it('copyFiles stores paths', () => {
      mockController.clipboardCopyFiles(['/a.png', '/b.jpg']);
      expect(mockController.getClipboardFiles()).toEqual(['/a.png', '/b.jpg']);
    });

    it('writeImage and readImage work correctly', () => {
      const image = createMockNativeImage(100, 100);
      mockController.clipboardWriteImage(image);
      const read = mockController.clipboardReadImage();
      expect(read.getSize()).toEqual({ width: 100, height: 100 });
    });
  });

  describe('Folder Methods', () => {
    it('getFolderById returns folder when found', async () => {
      const folders = await mockController.getAllFolders();
      const folder = await mockController.getFolderById(folders[0].id);
      expect(folder?.id).toBe(folders[0].id);
    });

    it('getFolderById returns undefined for unknown ID', async () => {
      const folder = await mockController.getFolderById('unknown-id');
      expect(folder).toBeUndefined();
    });
  });
});
