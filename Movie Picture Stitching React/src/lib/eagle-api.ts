/**
 * Eagle API Adapter
 * Provides a unified interface for Eagle Plugin API with mock support for development
 */

import type {
  EagleAPI,
  Item,
  Folder,
  Tag,
  TagGroup,
  LibraryInfo,
  Display,
  Point,
  Rectangle,
  NativeImage,
  EagleLocale,
  EagleTheme,
  TagColor,
  ItemAddOptions,
  ItemGetOptions,
  FolderCreateOptions,
  MenuItem,
  AppPath,
} from '@/types/eagle';
import { mockController, createMockNativeImage } from './mock-factory';

// ============================================================================
// Environment Detection
// ============================================================================

/**
 * Check if running inside Eagle plugin context
 */
export const isEagleEnvironment = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as Window).eagle !== 'undefined';
};

/**
 * Check if Node.js require is available (inside Eagle)
 */
export const hasNodeRequire = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as Window).require === 'function';
};

// ============================================================================
// Mock Eagle API (uses MockController for configurable data)
// ============================================================================

const createMockEagleAPI = (): Partial<EagleAPI> => ({
  app: {
    isDarkColors: () => mockController.isDarkMode,
    getPath: async (name: AppPath) => {
      const paths: Record<AppPath, string> = {
        home: mockController.homedir(),
        appData:
          mockController.platform === 'darwin'
            ? '/Users/mockuser/Library/Application Support'
            : 'C:\\Users\\mockuser\\AppData\\Roaming',
        userData:
          mockController.platform === 'darwin'
            ? '/Users/mockuser/Library/Application Support/Eagle'
            : 'C:\\Users\\mockuser\\AppData\\Roaming\\Eagle',
        temp: mockController.tmpdir(),
        exe: '/mock/eagle.app',
        desktop: `${mockController.homedir()}/Desktop`,
        documents: `${mockController.homedir()}/Documents`,
        downloads: `${mockController.homedir()}/Downloads`,
        music: `${mockController.homedir()}/Music`,
        pictures: `${mockController.homedir()}/Pictures`,
        videos: `${mockController.homedir()}/Movies`,
        recent: `${mockController.homedir()}/Recent`,
      };
      return paths[name] ?? '/mock/path';
    },
    getFileIcon: async () => createMockNativeImage(32, 32),
    createThumbnailFromPath: async () => createMockNativeImage(256, 256),
    version: '4.0.0',
    build: 1,
    locale: mockController.locale,
    arch: 'arm64' as const,
    platform: mockController.platform,
    env: {},
    execPath: '/mock/eagle',
    pid: 12345,
    isWindows: mockController.platform === 'win32',
    isMac: mockController.platform === 'darwin',
    runningUnderARM64Translation: false,
    theme: mockController.theme,
  },
  item: {
    get: async (options: ItemGetOptions) => {
      const items = await mockController.getAllItems();
      // Apply filters
      let filtered = items;
      if (options.id) {
        filtered = filtered.filter((i) => i.id === options.id);
      }
      if (options.ids) {
        filtered = filtered.filter((i) => options.ids!.includes(i.id));
      }
      if (options.ext) {
        filtered = filtered.filter((i) => i.ext === options.ext);
      }
      if (options.tags && options.tags.length > 0) {
        filtered = filtered.filter((i) => options.tags!.some((t) => i.tags.includes(t)));
      }
      if (options.folders && options.folders.length > 0) {
        filtered = filtered.filter((i) => options.folders!.some((f) => i.folders.includes(f)));
      }
      if (options.rating !== undefined) {
        filtered = filtered.filter((i) => i.star >= options.rating!);
      }
      if (options.isSelected) {
        filtered = await mockController.getSelectedItems();
      }
      return filtered;
    },
    getAll: async () => mockController.getAllItems(),
    getById: async (id: string) => {
      const item = await mockController.getItemById(id);
      return item ?? null;
    },
    getByIds: async (ids: string[]) => {
      const items = await mockController.getAllItems();
      return items.filter((i) => ids.includes(i.id));
    },
    getSelected: async () => mockController.getSelectedItems(),
    addFromURL: async () => 'new-item-id',
    addFromBase64: async () => 'new-item-id',
    addFromPath: async (path: string) => mockController.addFromPath(path),
    addBookmark: async () => 'new-item-id',
    open: async () => true,
  },
  folder: {
    create: async (options: FolderCreateOptions) => {
      const folders = await mockController.getAllFolders();
      const newFolder = {
        ...folders[0],
        id: `new-folder-${Date.now()}`,
        name: options.name,
        description: options.description ?? '',
      };
      return newFolder;
    },
    createSubfolder: async (_parentId: string, options: Omit<FolderCreateOptions, 'parent'>) => {
      const folders = await mockController.getAllFolders();
      return {
        ...folders[0],
        id: `new-subfolder-${Date.now()}`,
        name: options.name,
        description: options.description ?? '',
      };
    },
    get: async () => mockController.getAllFolders(),
    getAll: async () => mockController.getAllFolders(),
    getById: async (id: string) => {
      const folder = await mockController.getFolderById(id);
      if (!folder) {
        return (await mockController.getAllFolders())[0];
      }
      return folder;
    },
    getByIds: async (ids: string[]) => {
      const folders = await mockController.getAllFolders();
      return folders.filter((f) => ids.includes(f.id));
    },
    getSelected: async () => mockController.getSelectedFolders(),
    getRecents: async () => {
      const folders = await mockController.getAllFolders();
      return folders.slice(0, 5);
    },
    open: async () => {},
  },
  tag: {
    get: async () => mockController.getTags(),
    getRecents: async () => mockController.getRecentTags(),
  },
  tagGroup: {
    get: async () => mockController.getTagGroups(),
    create: async (options: { name: string; color: TagColor; tags: string[] }) => {
      return {
        name: options.name,
        color: options.color,
        tags: options.tags,
        save: async (): Promise<TagGroup> => ({}) as TagGroup,
        remove: async () => true,
      };
    },
  },
  library: {
    info: async () => mockController.getLibraryInfo(),
    get name() {
      return mockController.libraryName;
    },
    get path() {
      return mockController.libraryPath;
    },
    get modificationTime() {
      return mockController.libraryModificationTime;
    },
  },
  window: {
    show: async () => {},
    showInactive: async () => {},
    hide: async () => {},
    focus: async () => {},
    minimize: async () => {},
    isMinimized: async () => false,
    restore: async () => {},
    maximize: async () => {},
    unmaximize: async () => {},
    isMaximized: async () => false,
    setFullScreen: async () => {},
    isFullScreen: async () => false,
    setAspectRatio: async () => {},
    setBackgroundColor: async () => {},
    setSize: async () => {},
    getSize: async () => [1024, 768],
    setBounds: async () => {},
    getBounds: async () => ({ x: 0, y: 0, width: 1024, height: 768 }),
    setResizable: async () => {},
    isResizable: async () => true,
    setAlwaysOnTop: async () => {},
    isAlwaysOnTop: async () => false,
    setPosition: async () => {},
    getPosition: async () => [100, 100],
    setOpacity: async () => {},
    getOpacity: async () => 1,
    flashFrame: async () => {},
    setIgnoreMouseEvents: async () => {},
    capturePage: async () => createMockNativeImage(1024, 768),
    setReferer: () => {},
  },
  screen: {
    getCursorScreenPoint: async () => mockController.getCursorScreenPoint(),
    getPrimaryDisplay: async () => mockController.getPrimaryDisplay(),
    getAllDisplays: async () => mockController.getAllDisplays(),
    getDisplayNearestPoint: async (point: Point) => mockController.getDisplayNearestPoint(point),
  },
  os: {
    tmpdir: () => mockController.tmpdir(),
    version: () => mockController.osVersion(),
    type: () => mockController.osType(),
    release: () => mockController.osRelease(),
    hostname: () => mockController.hostname(),
    homedir: () => mockController.homedir(),
    arch: () => mockController.arch(),
  },
  clipboard: {
    clear: () => mockController.clipboardClear(),
    has: (format: string) => mockController.clipboardHas(format),
    writeText: (text: string) => mockController.clipboardWriteText(text),
    readText: async () => mockController.clipboardReadText(),
    writeBuffer: () => {},
    readBuffer: () => Buffer.from([]),
    writeImage: (image: NativeImage) => mockController.clipboardWriteImage(image),
    readImage: () => mockController.clipboardReadImage(),
    writeHTML: (markup: string) => mockController.clipboardWriteHTML(markup),
    readHTML: () => mockController.clipboardReadHTML(),
    copyFiles: (paths: string[]) => mockController.clipboardCopyFiles(paths),
  },
  contextMenu: {
    open: async (items: MenuItem[]) => {
      console.log('[Mock ContextMenu]', items);
    },
  },
  drag: {
    startDrag: async (filePaths: string[]) => {
      console.log('[Mock Drag]', filePaths);
    },
  },
  notification: {
    show: async (options) => {
      console.log('[Mock Notification]', options.title, options.description);
    },
  },
  dialog: {
    showOpenDialog: async () => ({ canceled: true, filePaths: [] }),
    showSaveDialog: async () => ({ canceled: true }),
    showMessageBox: async () => ({ response: 0 }),
    showErrorBox: async (title, content) => {
      console.error('[Mock Error]', title, content);
    },
  },
  shell: {
    beep: async () => {},
    openExternal: async (url) => {
      window.open(url, '_blank');
    },
    openPath: async () => {},
    showItemInFolder: async () => {},
  },
  log: {
    info: (msg) => console.info('[Eagle Info]', msg),
    warn: (msg) => console.warn('[Eagle Warn]', msg),
    error: (msg) => console.error('[Eagle Error]', msg),
    debug: (msg) => console.debug('[Eagle Debug]', msg),
  },
  event: {
    onPluginCreate: () => {},
    onPluginRun: () => {},
    onPluginBeforeExit: () => {},
    onPluginShow: () => {},
    onPluginHide: () => {},
    onLibraryChanged: () => {},
    onThemeChanged: () => {},
  },
});

// ============================================================================
// Eagle API Wrapper
// ============================================================================

class EagleAPIAdapter {
  private _api: EagleAPI | Partial<EagleAPI>;
  private _isMock: boolean;

  constructor() {
    if (isEagleEnvironment()) {
      // Store reference to Eagle API. Note: Some properties may not be
      // accessible until after the 'plugin-create' event fires. All getters
      // use try-catch to handle this gracefully.
      this._api = (window as Window & { eagle: EagleAPI }).eagle;
      this._isMock = false;
    } else {
      this._api = createMockEagleAPI();
      this._isMock = true;
      console.info('[EagleAPI] Running in mock mode (outside Eagle)');
    }
  }

  get isMock(): boolean {
    return this._isMock;
  }

  get raw(): EagleAPI | Partial<EagleAPI> {
    return this._api;
  }

  // -------------------------------------------------------------------------
  // App
  // -------------------------------------------------------------------------
  // NOTE: Eagle API properties like `locale`, `theme` etc. may throw
  // "This method can only be used after the `plugin-create` event"
  // if accessed before the plugin is fully initialized. All getters must
  // use try-catch to handle this gracefully.

  get locale(): EagleLocale {
    try {
      return this._api.app?.locale || 'en';
    } catch {
      // Eagle API not ready yet - return default
      return 'en';
    }
  }

  get theme(): EagleTheme {
    try {
      return this._api.app?.theme || 'DARK';
    } catch {
      return 'DARK';
    }
  }

  get isDarkMode(): boolean {
    try {
      const darkThemes: EagleTheme[] = ['DARK', 'GRAY', 'BLUE', 'PURPLE'];
      if (this._api.app?.theme) {
        if (this._api.app.theme === 'Auto') {
          return this._api.app.isDarkColors?.() ?? false;
        }
        return darkThemes.includes(this._api.app.theme);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  get platform(): 'darwin' | 'win32' {
    try {
      return this._api.app?.platform || 'darwin';
    } catch {
      return 'darwin';
    }
  }

  get isMac(): boolean {
    try {
      return this._api.app?.isMac ?? true;
    } catch {
      return true;
    }
  }

  get isWindows(): boolean {
    try {
      return this._api.app?.isWindows ?? false;
    } catch {
      return false;
    }
  }

  get version(): string {
    try {
      return this._api.app?.version ?? '4.0.0';
    } catch {
      return '4.0.0';
    }
  }

  get build(): number {
    try {
      return this._api.app?.build ?? 1;
    } catch {
      return 1;
    }
  }

  get arch(): 'x64' | 'arm64' | 'x86' {
    try {
      return this._api.app?.arch ?? 'arm64';
    } catch {
      return 'arm64';
    }
  }

  async getPath(name: AppPath): Promise<string> {
    return this._api.app?.getPath?.(name) ?? '/unknown/path';
  }

  async getFileIcon(
    path: string,
    options?: { size: 'small' | 'normal' | 'large' }
  ): Promise<NativeImage> {
    return this._api.app?.getFileIcon?.(path, options) ?? createMockNativeImage(32, 32);
  }

  async createThumbnailFromPath(
    path: string,
    maxSize: { width: number; height: number }
  ): Promise<NativeImage> {
    return (
      this._api.app?.createThumbnailFromPath?.(path, maxSize) ?? createMockNativeImage(256, 256)
    );
  }

  // -------------------------------------------------------------------------
  // Items
  // -------------------------------------------------------------------------

  async getSelectedItems(): Promise<Item[]> {
    return this._api.item?.getSelected?.() || [];
  }

  async getAllItems(): Promise<Item[]> {
    return this._api.item?.getAll?.() || [];
  }

  async getItemById(id: string): Promise<Item | null> {
    return this._api.item?.getById?.(id) || null;
  }

  async getItemsByIds(ids: string[]): Promise<Item[]> {
    return this._api.item?.getByIds?.(ids) || [];
  }

  async getItems(options: ItemGetOptions): Promise<Item[]> {
    return this._api.item?.get?.(options) || [];
  }

  async addItemFromPath(path: string, options?: ItemAddOptions): Promise<string> {
    return this._api.item?.addFromPath?.(path, options) || '';
  }

  // Alias for addItemFromPath
  async addImageFromPath(path: string, options?: ItemAddOptions): Promise<string> {
    return this.addItemFromPath(path, options);
  }

  async addItemFromBase64(base64: string, options?: ItemAddOptions): Promise<string> {
    return this._api.item?.addFromBase64?.(base64, options) || '';
  }

  async addItemFromURL(url: string, options?: ItemAddOptions): Promise<string> {
    return this._api.item?.addFromURL?.(url, options) || '';
  }

  async addBookmark(url: string, options?: ItemAddOptions & { base64?: string }): Promise<string> {
    return this._api.item?.addBookmark?.(url, options) || '';
  }

  async openItem(itemId: string): Promise<boolean> {
    return this._api.item?.open?.(itemId) || false;
  }

  // -------------------------------------------------------------------------
  // Folders
  // -------------------------------------------------------------------------

  async getAllFolders(): Promise<Folder[]> {
    return this._api.folder?.getAll?.() || [];
  }

  async getSelectedFolders(): Promise<Folder[]> {
    return this._api.folder?.getSelected?.() || [];
  }

  async getSelectedFolder(): Promise<Folder | null> {
    const folders = await this.getSelectedFolders();
    return folders.length > 0 ? folders[0] : null;
  }

  async getFolderById(id: string): Promise<Folder | null> {
    const folder = await this._api.folder?.getById?.(id);
    return folder || null;
  }

  async getFoldersByIds(ids: string[]): Promise<Folder[]> {
    return this._api.folder?.getByIds?.(ids) || [];
  }

  async getRecentFolders(): Promise<Folder[]> {
    return this._api.folder?.getRecents?.() || [];
  }

  async createFolder(options: FolderCreateOptions): Promise<Folder | null> {
    const folder = await this._api.folder?.create?.(options);
    return folder || null;
  }

  async createSubfolder(
    parentId: string,
    options: Omit<FolderCreateOptions, 'parent'>
  ): Promise<Folder | null> {
    const folder = await this._api.folder?.createSubfolder?.(parentId, options);
    return folder || null;
  }

  async openFolder(folderId: string): Promise<void> {
    await this._api.folder?.open?.(folderId);
  }

  // -------------------------------------------------------------------------
  // Tags
  // -------------------------------------------------------------------------

  async getTags(): Promise<Tag[]> {
    return this._api.tag?.get?.() || [];
  }

  async getRecentTags(): Promise<Tag[]> {
    return this._api.tag?.getRecents?.() || [];
  }

  // -------------------------------------------------------------------------
  // Tag Groups
  // -------------------------------------------------------------------------

  async getTagGroups(): Promise<TagGroup[]> {
    return this._api.tagGroup?.get?.() || [];
  }

  async createTagGroup(options: {
    name: string;
    color: TagColor;
    tags: string[];
  }): Promise<TagGroup | null> {
    const group = await this._api.tagGroup?.create?.(options);
    return group || null;
  }

  // -------------------------------------------------------------------------
  // Library
  // -------------------------------------------------------------------------

  async getLibraryInfo(): Promise<LibraryInfo | null> {
    const info = await this._api.library?.info?.();
    return info || null;
  }

  get libraryName(): string {
    return this._api.library?.name || 'Unknown Library';
  }

  get libraryPath(): string {
    return this._api.library?.path || '';
  }

  get libraryModificationTime(): number {
    return this._api.library?.modificationTime || 0;
  }

  // -------------------------------------------------------------------------
  // Window
  // -------------------------------------------------------------------------

  async setAlwaysOnTop(flag: boolean): Promise<void> {
    await this._api.window?.setAlwaysOnTop?.(flag);
  }

  async setWindowSize(width: number, height: number): Promise<void> {
    await this._api.window?.setSize?.(width, height);
  }

  async closeWindow(): Promise<void> {
    if (isEagleEnvironment()) {
      window.close();
    }
  }

  // -------------------------------------------------------------------------
  // Notifications
  // -------------------------------------------------------------------------

  async showNotification(
    title: string,
    description: string,
    options?: { icon?: string; mute?: boolean; duration?: number }
  ): Promise<void> {
    await this._api.notification?.show?.({ title, description, ...options });
  }

  // -------------------------------------------------------------------------
  // Dialog
  // -------------------------------------------------------------------------

  async showOpenDialog(options: Parameters<NonNullable<EagleAPI['dialog']['showOpenDialog']>>[0]) {
    return this._api.dialog?.showOpenDialog?.(options) || { canceled: true, filePaths: [] };
  }

  async showSaveDialog(options: Parameters<NonNullable<EagleAPI['dialog']['showSaveDialog']>>[0]) {
    return this._api.dialog?.showSaveDialog?.(options) || { canceled: true };
  }

  async showMessageBox(options: Parameters<NonNullable<EagleAPI['dialog']['showMessageBox']>>[0]) {
    return this._api.dialog?.showMessageBox?.(options) || { response: 0 };
  }

  // -------------------------------------------------------------------------
  // Shell
  // -------------------------------------------------------------------------

  async openExternal(url: string): Promise<void> {
    await this._api.shell?.openExternal?.(url);
  }

  async showItemInFolder(path: string): Promise<void> {
    await this._api.shell?.showItemInFolder?.(path);
  }

  // -------------------------------------------------------------------------
  // Logging
  // -------------------------------------------------------------------------

  log = {
    info: (message: string) => this._api.log?.info?.(message) || console.info(message),
    warn: (message: string) => this._api.log?.warn?.(message) || console.warn(message),
    error: (message: string) => this._api.log?.error?.(message) || console.error(message),
    debug: (message: string) => this._api.log?.debug?.(message) || console.debug(message),
  };

  // -------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------

  onPluginBeforeExit(callback: () => void): void {
    if (isEagleEnvironment()) {
      // Use global eagle lifecycle hooks
      const globalEagle = (window as Window & { eagle: EagleAPI }).eagle;
      if (globalEagle.event?.onPluginBeforeExit) {
        globalEagle.event.onPluginBeforeExit(callback);
      }
    }
  }

  onThemeChanged(callback: (theme: EagleTheme) => void): void {
    if (isEagleEnvironment()) {
      const globalEagle = (window as Window & { eagle: EagleAPI }).eagle;
      if (globalEagle.event?.onThemeChanged) {
        globalEagle.event.onThemeChanged(callback);
      }
    }
  }

  onLibraryChanged(callback: (path: string) => void): void {
    if (isEagleEnvironment()) {
      const globalEagle = (window as Window & { eagle: EagleAPI }).eagle;
      if (globalEagle.event?.onLibraryChanged) {
        globalEagle.event.onLibraryChanged(callback);
      }
    }
  }

  onPluginShow(callback: () => void): void {
    if (isEagleEnvironment()) {
      const globalEagle = (window as Window & { eagle: EagleAPI }).eagle;
      if (globalEagle.event?.onPluginShow) {
        globalEagle.event.onPluginShow(callback);
      }
    }
  }

  onPluginHide(callback: () => void): void {
    if (isEagleEnvironment()) {
      const globalEagle = (window as Window & { eagle: EagleAPI }).eagle;
      if (globalEagle.event?.onPluginHide) {
        globalEagle.event.onPluginHide(callback);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Screen
  // -------------------------------------------------------------------------

  async getCursorScreenPoint(): Promise<Point> {
    return this._api.screen?.getCursorScreenPoint?.() || { x: 0, y: 0 };
  }

  async getPrimaryDisplay(): Promise<Display | null> {
    const display = await this._api.screen?.getPrimaryDisplay?.();
    return display || null;
  }

  async getAllDisplays(): Promise<Display[]> {
    return this._api.screen?.getAllDisplays?.() || [];
  }

  async getDisplayNearestPoint(point: Point): Promise<Display | null> {
    const display = await this._api.screen?.getDisplayNearestPoint?.(point);
    return display || null;
  }

  // -------------------------------------------------------------------------
  // OS
  // -------------------------------------------------------------------------

  os = {
    tmpdir: (): string => this._api.os?.tmpdir?.() || '/tmp',
    version: (): string => this._api.os?.version?.() || '',
    type: (): 'Windows_NT' | 'Darwin' => this._api.os?.type?.() || 'Darwin',
    release: (): string => this._api.os?.release?.() || '',
    hostname: (): string => this._api.os?.hostname?.() || '',
    homedir: (): string => this._api.os?.homedir?.() || '',
    arch: (): 'x64' | 'arm64' | 'x86' => this._api.os?.arch?.() || 'arm64',
  };

  // -------------------------------------------------------------------------
  // Clipboard
  // -------------------------------------------------------------------------

  clipboard = {
    clear: (): void => this._api.clipboard?.clear?.(),
    has: (format: string): boolean => this._api.clipboard?.has?.(format) || false,
    writeText: (text: string): void => this._api.clipboard?.writeText?.(text),
    readText: async (): Promise<string> => this._api.clipboard?.readText?.() || '',
    writeBuffer: (format: string, buffer: Buffer): void =>
      this._api.clipboard?.writeBuffer?.(format, buffer),
    readBuffer: (format: string): Buffer =>
      this._api.clipboard?.readBuffer?.(format) || Buffer.from([]),
    writeImage: (image: NativeImage): void => this._api.clipboard?.writeImage?.(image),
    readImage: (): NativeImage => this._api.clipboard?.readImage?.() || createMockNativeImage(),
    writeHTML: (markup: string): void => this._api.clipboard?.writeHTML?.(markup),
    readHTML: (): string => this._api.clipboard?.readHTML?.() || '',
    copyFiles: (paths: string[]): void => this._api.clipboard?.copyFiles?.(paths),
  };

  // -------------------------------------------------------------------------
  // Context Menu
  // -------------------------------------------------------------------------

  async showContextMenu(items: MenuItem[]): Promise<void> {
    await this._api.contextMenu?.open?.(items);
  }

  // -------------------------------------------------------------------------
  // Drag
  // -------------------------------------------------------------------------

  async startDrag(filePaths: string[]): Promise<void> {
    await this._api.drag?.startDrag?.(filePaths);
  }

  // -------------------------------------------------------------------------
  // Extended Window Methods
  // -------------------------------------------------------------------------

  async showWindow(): Promise<void> {
    await this._api.window?.show?.();
  }

  async hideWindow(): Promise<void> {
    await this._api.window?.hide?.();
  }

  async focusWindow(): Promise<void> {
    await this._api.window?.focus?.();
  }

  async minimizeWindow(): Promise<void> {
    await this._api.window?.minimize?.();
  }

  async isWindowMinimized(): Promise<boolean> {
    return this._api.window?.isMinimized?.() || false;
  }

  async restoreWindow(): Promise<void> {
    await this._api.window?.restore?.();
  }

  async maximizeWindow(): Promise<void> {
    await this._api.window?.maximize?.();
  }

  async isWindowMaximized(): Promise<boolean> {
    return this._api.window?.isMaximized?.() || false;
  }

  async setFullScreen(flag: boolean): Promise<void> {
    await this._api.window?.setFullScreen?.(flag);
  }

  async isFullScreen(): Promise<boolean> {
    return this._api.window?.isFullScreen?.() || false;
  }

  async getWindowSize(): Promise<[number, number]> {
    return this._api.window?.getSize?.() || [1024, 768];
  }

  async getWindowBounds(): Promise<Rectangle> {
    return this._api.window?.getBounds?.() || { x: 0, y: 0, width: 1024, height: 768 };
  }

  async setWindowBounds(bounds: Rectangle): Promise<void> {
    await this._api.window?.setBounds?.(bounds);
  }

  async getWindowPosition(): Promise<[number, number]> {
    return this._api.window?.getPosition?.() || [100, 100];
  }

  async setWindowPosition(x: number, y: number): Promise<void> {
    await this._api.window?.setPosition?.(x, y);
  }

  async setWindowOpacity(opacity: number): Promise<void> {
    await this._api.window?.setOpacity?.(opacity);
  }

  async getWindowOpacity(): Promise<number> {
    return this._api.window?.getOpacity?.() || 1;
  }

  async flashFrame(flag: boolean): Promise<void> {
    await this._api.window?.flashFrame?.(flag);
  }

  async captureWindow(rect?: Rectangle): Promise<NativeImage> {
    return this._api.window?.capturePage?.(rect) || createMockNativeImage(1024, 768);
  }

  async isWindowAlwaysOnTop(): Promise<boolean> {
    return this._api.window?.isAlwaysOnTop?.() || false;
  }

  async isWindowResizable(): Promise<boolean> {
    return this._api.window?.isResizable?.() || true;
  }

  async setWindowResizable(resizable: boolean): Promise<void> {
    await this._api.window?.setResizable?.(resizable);
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const eagleApi = new EagleAPIAdapter();
export { mockController, createMockNativeImage } from './mock-factory';
export default eagleApi;
