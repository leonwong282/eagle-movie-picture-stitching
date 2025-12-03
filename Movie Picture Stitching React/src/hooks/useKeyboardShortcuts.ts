/**
 * useKeyboardShortcuts Hook
 *
 * Manages keyboard shortcuts for the Movie Picture Stitching plugin.
 *
 * Shortcuts:
 * - Cmd/Ctrl + Enter: Preview
 * - Cmd/Ctrl + S: Save
 * - Cmd/Ctrl + P: Pin window
 * - Cmd/Ctrl + W: Close
 * - Cmd/Ctrl + ?: Help
 */

import { useEffect, useCallback, useMemo } from 'react';

// ============================================================================
// Types
// ============================================================================

export type ShortcutAction =
  | 'preview'
  | 'save'
  | 'pin'
  | 'close'
  | 'help'
  | 'focusCropTop'
  | 'focusCropBottom'
  | 'cycleFormat';

export interface ShortcutConfig {
  /** Key code (e.g., 'KeyS', 'Enter') */
  key: string;
  /** Whether Ctrl/Cmd is required */
  ctrlOrCmd?: boolean;
  /** Whether Shift is required */
  shift?: boolean;
  /** Whether Alt is required */
  alt?: boolean;
  /** Action to perform */
  action: ShortcutAction;
  /** Description for help modal */
  description: string;
}

export interface ShortcutHandlers {
  onPreview?: () => void;
  onSave?: () => void;
  onPin?: () => void;
  onClose?: () => void;
  onHelp?: () => void;
  onFocusCropTop?: () => void;
  onFocusCropBottom?: () => void;
  onCycleFormat?: () => void;
}

export interface UseKeyboardShortcutsOptions {
  /** Whether shortcuts are enabled */
  enabled?: boolean;
  /** Event handlers for shortcuts */
  handlers: ShortcutHandlers;
}

// ============================================================================
// Default Shortcuts Configuration
// ============================================================================

const DEFAULT_SHORTCUTS: ShortcutConfig[] = [
  {
    key: 'Enter',
    ctrlOrCmd: true,
    action: 'preview',
    description: 'ui.shortcuts.preview',
  },
  {
    key: 'KeyS',
    ctrlOrCmd: true,
    action: 'save',
    description: 'ui.shortcuts.save',
  },
  {
    key: 'KeyP',
    ctrlOrCmd: true,
    action: 'pin',
    description: 'ui.shortcuts.pin',
  },
  {
    key: 'KeyW',
    ctrlOrCmd: true,
    action: 'close',
    description: 'ui.shortcuts.close',
  },
  {
    key: 'KeyH',
    ctrlOrCmd: true,
    action: 'help',
    description: 'ui.shortcuts.help',
  },
  {
    key: 'Digit1',
    ctrlOrCmd: true,
    action: 'focusCropTop',
    description: 'ui.shortcuts.focusCropTop',
  },
  {
    key: 'Digit2',
    ctrlOrCmd: true,
    action: 'focusCropBottom',
    description: 'ui.shortcuts.focusCropBottom',
  },
  {
    key: 'KeyF',
    ctrlOrCmd: true,
    shift: true,
    action: 'cycleFormat',
    description: 'ui.shortcuts.cycleFormat',
  },
];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if the current platform is macOS
 */
function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/**
 * Check if Ctrl/Cmd modifier is pressed
 */
function isCtrlOrCmd(event: KeyboardEvent): boolean {
  return isMac() ? event.metaKey : event.ctrlKey;
}

/**
 * Get shortcut notation for display
 */
export function getShortcutNotation(config: ShortcutConfig): string {
  const parts: string[] = [];

  if (config.ctrlOrCmd) {
    parts.push(isMac() ? '⌘' : 'Ctrl');
  }
  if (config.shift) {
    parts.push(isMac() ? '⇧' : 'Shift');
  }
  if (config.alt) {
    parts.push(isMac() ? '⌥' : 'Alt');
  }

  // Map key code to display name
  const keyMap: Record<string, string> = {
    Enter: '↵',
    KeyS: 'S',
    KeyP: 'P',
    KeyW: 'W',
    KeyF: 'F',
    KeyH: 'H',
    Slash: '/',
    Digit1: '1',
    Digit2: '2',
    Escape: 'Esc',
    Space: 'Space',
  };

  parts.push(keyMap[config.key] || config.key);

  return parts.join(isMac() ? '' : '+');
}

/**
 * Get all shortcuts for display in help modal
 */
export function getShortcutsList(): Array<{
  action: ShortcutAction;
  notation: string;
  description: string;
}> {
  return DEFAULT_SHORTCUTS.map((config) => ({
    action: config.action,
    notation: getShortcutNotation(config),
    description: config.description,
  }));
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useKeyboardShortcuts({
  enabled = true,
  handlers,
}: UseKeyboardShortcutsOptions): void {
  // Memoize action map
  const actionMap = useMemo(
    () =>
      new Map<ShortcutAction, (() => void) | undefined>([
        ['preview', handlers.onPreview],
        ['save', handlers.onSave],
        ['pin', handlers.onPin],
        ['close', handlers.onClose],
        ['help', handlers.onHelp],
        ['focusCropTop', handlers.onFocusCropTop],
        ['focusCropBottom', handlers.onFocusCropBottom],
        ['cycleFormat', handlers.onCycleFormat],
      ]),
    [handlers]
  );

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Skip if in an input field (except for specific shortcuts)
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Find matching shortcut
      for (const config of DEFAULT_SHORTCUTS) {
        // Check modifiers
        if (config.ctrlOrCmd && !isCtrlOrCmd(event)) continue;
        if (config.shift && !event.shiftKey) continue;
        if (config.alt && !event.altKey) continue;

        // Check key
        if (event.code !== config.key) continue;

        // Skip certain shortcuts in input fields
        if (isInputField && !['close', 'help'].includes(config.action)) {
          continue;
        }

        // Execute handler
        const handler = actionMap.get(config.action);
        if (handler) {
          event.preventDefault();
          event.stopPropagation();
          handler();
          return;
        }
      }
    },
    [enabled, actionMap]
  );

  // Attach/detach event listener
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}

// ============================================================================
// Export Shortcuts Config
// ============================================================================

export { DEFAULT_SHORTCUTS };

