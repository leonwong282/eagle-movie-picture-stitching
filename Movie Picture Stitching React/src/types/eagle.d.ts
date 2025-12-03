/**
 * Eagle Plugin API Type Definitions
 * Based on Eagle Plugin API v4.0+
 * @see https://developer.eagle.cool/plugin-api
 */

// ============================================================================
// Core Types
// ============================================================================

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface NativeImage {
  toDataURL(type?: string): string;
  toPNG(): Buffer;
  getSize(): Size;
}

export type AppPath =
  | 'home'
  | 'appData'
  | 'userData'
  | 'temp'
  | 'exe'
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos'
  | 'recent';

export type EagleLocale =
  | 'en'
  | 'zh_CN'
  | 'zh_TW'
  | 'ja_JP'
  | 'ko_KR'
  | 'es_ES'
  | 'de_DE'
  | 'ru_RU';

export type EagleTheme = 'Auto' | 'LIGHT' | 'LIGHTGRAY' | 'GRAY' | 'DARK' | 'BLUE' | 'PURPLE';

export type TagColor = 'red' | 'orange' | 'yellow' | 'green' | 'aqua' | 'blue' | 'purple' | 'pink';

/**
 * Color palette extracted from an item
 */
export interface ColorPalette {
  /** RGB color values [0-255] */
  color: [number, number, number];
  /** Ratio of this color in the image (0-1) */
  ratio: number;
}

export type ItemShape =
  | 'square'
  | 'portrait'
  | 'panoramic-portrait'
  | 'landscape'
  | 'panoramic-landscape';

// ============================================================================
// Data Models
// ============================================================================

export interface Tag {
  id: string;
  name: string;
  color?: string;
  count?: number;
}

export interface TagGroup {
  name: string;
  color: TagColor;
  tags: string[];
  save(): Promise<TagGroup>;
  remove(): Promise<boolean>;
}

export interface Folder {
  readonly id: string;
  name: string;
  description: string;
  readonly icon: string;
  readonly iconColor: string;
  readonly createdAt: number;
  readonly children: Folder[];
  save(): Promise<void>;
  open(): Promise<void>;
}

export interface Item {
  readonly id: string;
  name: string;
  readonly ext: string;
  width: number;
  height: number;
  url: string;
  readonly isDeleted: boolean;
  annotation: string;
  tags: string[];
  folders: string[];
  readonly palettes: ColorPalette[];
  readonly size: number;
  star: number;
  readonly importedAt: number;
  readonly noThumbnail: boolean;
  readonly noPreview: boolean;
  readonly filePath: string;
  readonly fileURL: string;
  readonly thumbnailPath: string;
  readonly thumbnailURL: string;
  readonly metadataFilePath: string;
  save(): Promise<boolean>;
  moveToTrash(): Promise<boolean>;
  replaceFile(filePath: string): Promise<boolean>;
  refreshThumbnail(): Promise<boolean>;
  setCustomThumbnail(thumbnailPath: string): Promise<boolean>;
  open(): Promise<void>;
}

export interface LibraryInfo {
  /** Library name */
  name: string;
  /** Library path on filesystem */
  path: string;
  /** Last modification timestamp */
  modificationTime: number;
  /** All folders in library */
  folders: Folder[];
  /** All smart folders */
  smartFolders: SmartFolder[];
  /** All tag groups */
  tagGroups: TagGroup[];
  /** Quick access items */
  quickAccess: Item[];
  /** Recent items */
  modifierShortcuts: ModifierShortcut[];
  /** Application theme */
  applicationTheme: EagleTheme;
}

export interface SmartFolder {
  id: string;
  name: string;
  description: string;
  conditions: SmartFolderCondition[];
  icon: string;
  iconColor: string;
}

export interface SmartFolderCondition {
  property: string;
  method: string;
  value: string | number | boolean;
}

export interface ModifierShortcut {
  id: string;
  name: string;
  type: string;
}

export interface Display {
  /** Unique identifier of the display */
  id: number;
  /** Display bounds */
  bounds: Rectangle;
  /** Work area (excludes taskbar/dock) */
  workArea: Rectangle;
  /** Accelerometer support status */
  accelerometerSupport: 'available' | 'unavailable' | 'unknown';
  /** Color depth in bits */
  colorDepth: number;
  /** Color space string */
  colorSpace: string;
  /** Display scale factor */
  scaleFactor: number;
  /** Display size */
  size: Size;
  /** Work area size */
  workAreaSize: Size;
  /** Display rotation in degrees */
  rotation: number;
  /** Whether this is an internal display */
  internal: boolean;
  /** Touch support status */
  touchSupport: 'available' | 'unavailable' | 'unknown';
  /** Monitor frequency in Hz */
  monochrome: boolean;
  /** Display label */
  label: string;
}

// ============================================================================
// API Interfaces
// ============================================================================

export interface EagleTagAPI {
  get(): Promise<Tag[]>;
  getRecents(): Promise<Tag[]>;
}

export interface EagleTagGroupAPI {
  get(): Promise<TagGroup[]>;
  create(options: { name: string; color: TagColor; tags: string[] }): Promise<TagGroup>;
}

export interface EagleLibraryAPI {
  info(): Promise<LibraryInfo>;
  readonly name: string;
  readonly path: string;
  readonly modificationTime: number;
}

export interface EagleWindowAPI {
  show(): Promise<void>;
  showInactive(): Promise<void>;
  hide(): Promise<void>;
  focus(): Promise<void>;
  minimize(): Promise<void>;
  isMinimized(): Promise<boolean>;
  restore(): Promise<void>;
  maximize(): Promise<void>;
  unmaximize(): Promise<void>;
  isMaximized(): Promise<boolean>;
  setFullScreen(flag: boolean): Promise<void>;
  isFullScreen(): Promise<boolean>;
  setAspectRatio(aspectRatio: number): Promise<void>;
  setBackgroundColor(backgroundColor: string): Promise<void>;
  setSize(width: number, height: number): Promise<void>;
  getSize(): Promise<[number, number]>;
  setBounds(bounds: Rectangle): Promise<void>;
  getBounds(): Promise<Rectangle>;
  setResizable(resizable: boolean): Promise<void>;
  isResizable(): Promise<boolean>;
  setAlwaysOnTop(flag: boolean): Promise<void>;
  isAlwaysOnTop(): Promise<boolean>;
  setPosition(x: number, y: number): Promise<void>;
  getPosition(): Promise<[number, number]>;
  setOpacity(opacity: number): Promise<void>;
  getOpacity(): Promise<number>;
  flashFrame(flag: boolean): Promise<void>;
  setIgnoreMouseEvents(ignore: boolean): Promise<void>;
  capturePage(rect?: Rectangle): Promise<NativeImage>;
  setReferer(url: string): void;
}

export interface EagleAppAPI {
  isDarkColors(): boolean;
  getPath(name: AppPath): Promise<string>;
  getFileIcon(path: string, options?: { size: 'small' | 'normal' | 'large' }): Promise<NativeImage>;
  createThumbnailFromPath(path: string, maxSize: Size): Promise<NativeImage>;
  readonly version: string;
  readonly build: number;
  readonly locale: EagleLocale;
  readonly arch: 'x64' | 'arm64' | 'x86';
  readonly platform: 'darwin' | 'win32';
  readonly env: { [key: string]: string };
  readonly execPath: string;
  readonly pid: number;
  readonly isWindows: boolean;
  readonly isMac: boolean;
  readonly runningUnderARM64Translation: boolean;
  readonly theme: EagleTheme;
}

export interface EagleOSAPI {
  tmpdir(): string;
  version(): string;
  type(): 'Windows_NT' | 'Darwin';
  release(): string;
  hostname(): string;
  homedir(): string;
  arch(): 'x64' | 'arm64' | 'x86';
}

export interface EagleScreenAPI {
  getCursorScreenPoint(): Promise<Point>;
  getPrimaryDisplay(): Promise<Display>;
  getAllDisplays(): Promise<Display[]>;
  getDisplayNearestPoint(point: Point): Promise<Display>;
}

export interface EagleNotificationAPI {
  show(options: {
    title: string;
    description: string;
    icon?: string;
    mute?: boolean;
    duration?: number;
  }): Promise<void>;
}

export interface EagleEventAPI {
  onPluginCreate(callback: (plugin: unknown) => void): void;
  onPluginRun(callback: (plugin: unknown) => void): void;
  onPluginBeforeExit(callback: () => void): void;
  onPluginShow(callback: () => void): void;
  onPluginHide(callback: () => void): void;
  onLibraryChanged(callback: (path: string) => void): void;
  onThemeChanged(callback: (theme: EagleTheme) => void): void;
}

export interface ItemGetOptions {
  id?: string;
  ids?: string[];
  isSelected?: boolean;
  isUntagged?: boolean;
  isUnfiled?: boolean;
  keywords?: string[];
  tags?: string[];
  folders?: string[];
  ext?: string;
  annotation?: string;
  rating?: number;
  url?: string;
  shape?: ItemShape;
}

export interface ItemAddOptions {
  name?: string;
  website?: string;
  tags?: string[];
  folders?: string[];
  annotation?: string;
}

export interface EagleItemAPI {
  get(options: ItemGetOptions): Promise<Item[]>;
  getAll(): Promise<Item[]>;
  getById(itemId: string): Promise<Item | null>;
  getByIds(itemIds: string[]): Promise<Item[]>;
  getSelected(): Promise<Item[]>;
  addFromURL(url: string, options?: ItemAddOptions): Promise<string>;
  addFromBase64(base64: string, options?: ItemAddOptions): Promise<string>;
  addFromPath(path: string, options?: ItemAddOptions): Promise<string>;
  addBookmark(url: string, options?: ItemAddOptions & { base64?: string }): Promise<string>;
  open(itemId: string): Promise<boolean>;
}

export interface FolderGetOptions {
  id?: string;
  ids?: string[];
  isSelected?: boolean;
  isRecent?: boolean;
}

export interface FolderCreateOptions {
  name: string;
  description?: string;
  parent?: string;
}

export interface EagleFolderAPI {
  create(options: FolderCreateOptions): Promise<Folder>;
  createSubfolder(parentId: string, options: Omit<FolderCreateOptions, 'parent'>): Promise<Folder>;
  get(options: FolderGetOptions): Promise<Folder[]>;
  getAll(): Promise<Folder[]>;
  getById(folderId: string): Promise<Folder>;
  getByIds(folderIds: string[]): Promise<Folder[]>;
  getSelected(): Promise<Folder[]>;
  getRecents(): Promise<Folder[]>;
  open(folderId: string): Promise<void>;
}

export interface MenuItem {
  id: string;
  label: string;
  submenu?: MenuItem[];
  click?: () => void;
}

export interface EagleContextMenuAPI {
  open(menuItems: MenuItem[]): Promise<void>;
}

export interface FileFilter {
  name: string;
  extensions: string[];
}

export interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  properties?: (
    | 'openFile'
    | 'openDirectory'
    | 'multiSelections'
    | 'showHiddenFiles'
    | 'createDirectory'
    | 'promptToCreate'
  )[];
  message?: string;
}

export interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  properties?: ('openDirectory' | 'showHiddenFiles' | 'createDirectory')[];
}

export interface MessageBoxOptions {
  message: string;
  title?: string;
  detail?: string;
  buttons?: string[];
  type?: 'none' | 'info' | 'error' | 'question' | 'warning';
}

export interface EagleDialogAPI {
  showOpenDialog(options: OpenDialogOptions): Promise<{ canceled: boolean; filePaths: string[] }>;
  showSaveDialog(options: SaveDialogOptions): Promise<{ canceled: boolean; filePath?: string }>;
  showMessageBox(options: MessageBoxOptions): Promise<{ response: number }>;
  showErrorBox(title: string, content: string): Promise<void>;
}

export interface EagleClipboardAPI {
  clear(): void;
  has(format: string): boolean;
  writeText(text: string): void;
  readText(): Promise<string>;
  writeBuffer(format: string, buffer: Buffer): void;
  readBuffer(format: string): Buffer;
  writeImage(image: NativeImage): void;
  readImage(): NativeImage;
  writeHTML(markup: string): void;
  readHTML(): string;
  copyFiles(paths: string[]): void;
}

export interface EagleDragAPI {
  startDrag(filePaths: string[]): Promise<void>;
}

export interface EagleShellAPI {
  beep(): Promise<void>;
  openExternal(url: string): Promise<void>;
  openPath(path: string): Promise<void>;
  showItemInFolder(path: string): Promise<void>;
}

export interface EagleLogAPI {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

// ============================================================================
// Main Eagle API Interface
// ============================================================================

export interface EagleAPI {
  tag: EagleTagAPI;
  tagGroup: EagleTagGroupAPI;
  library: EagleLibraryAPI;
  window: EagleWindowAPI;
  app: EagleAppAPI;
  os: EagleOSAPI;
  screen: EagleScreenAPI;
  notification: EagleNotificationAPI;
  event: EagleEventAPI;
  item: EagleItemAPI;
  folder: EagleFolderAPI;
  contextMenu: EagleContextMenuAPI;
  dialog: EagleDialogAPI;
  clipboard: EagleClipboardAPI;
  drag: EagleDragAPI;
  shell: EagleShellAPI;
  log: EagleLogAPI;
  // Lifecycle hooks (global functions)
  onPluginCreate?(callback: (plugin: unknown) => void): void;
  onPluginRun?(callback: (plugin: unknown) => void): void;
  onPluginBeforeExit?(callback: () => void): void;
  onThemeChanged?(callback: (theme: EagleTheme) => void): void;
}

// ============================================================================
// Global Declaration
// ============================================================================

declare global {
  const eagle: EagleAPI;

  interface Window {
    eagle?: EagleAPI;
    require?: NodeRequire;
    i18next?: {
      t: (key: string, options?: Record<string, unknown>) => string;
      language: string;
      changeLanguage: (lng: string) => Promise<void>;
    };
  }
}

export {};
