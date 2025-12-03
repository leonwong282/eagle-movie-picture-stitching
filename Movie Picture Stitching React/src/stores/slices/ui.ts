/**
 * UI Slice
 *
 * Manages ephemeral UI state that doesn't need persistence.
 * Handles panel navigation, item selection, and modal state.
 */

import type { StateCreator } from 'zustand';
import type { PluginStore, UISlice, PanelId } from '../types';

/**
 * Initial state for UI slice
 */
export const initialUIState = {
  activePanel: 'main' as PanelId,
  selectedItemIds: new Set<string>(),
  expandedFolders: new Set<string>(),
  sidebarCollapsed: false,
  searchQuery: '',
  modalOpen: false,
  currentModal: null,
};

/**
 * Create UI slice
 */
export const createUISlice: StateCreator<PluginStore, [], [], { ui: UISlice }> = (set, _get) => ({
  ui: {
    ...initialUIState,

    setActivePanel: (panel) => {
      set((state) => ({
        ui: {
          ...state.ui,
          activePanel: panel,
        },
      }));
    },

    toggleItemSelection: (itemId) => {
      set((state) => {
        const newSelected = new Set(state.ui.selectedItemIds);
        if (newSelected.has(itemId)) {
          newSelected.delete(itemId);
        } else {
          newSelected.add(itemId);
        }
        return {
          ui: {
            ...state.ui,
            selectedItemIds: newSelected,
          },
        };
      });
    },

    selectItems: (itemIds) => {
      set((state) => ({
        ui: {
          ...state.ui,
          selectedItemIds: new Set(itemIds),
        },
      }));
    },

    clearItemSelection: () => {
      set((state) => ({
        ui: {
          ...state.ui,
          selectedItemIds: new Set<string>(),
        },
      }));
    },

    toggleFolderExpansion: (folderId) => {
      set((state) => {
        const newExpanded = new Set(state.ui.expandedFolders);
        if (newExpanded.has(folderId)) {
          newExpanded.delete(folderId);
        } else {
          newExpanded.add(folderId);
        }
        return {
          ui: {
            ...state.ui,
            expandedFolders: newExpanded,
          },
        };
      });
    },

    setSidebarCollapsed: (collapsed) => {
      set((state) => ({
        ui: {
          ...state.ui,
          sidebarCollapsed: collapsed,
        },
      }));
    },

    setSearchQuery: (query) => {
      set((state) => ({
        ui: {
          ...state.ui,
          searchQuery: query,
        },
      }));
    },

    openModal: (modalId) => {
      set((state) => ({
        ui: {
          ...state.ui,
          modalOpen: true,
          currentModal: modalId,
        },
      }));
    },

    closeModal: () => {
      set((state) => ({
        ui: {
          ...state.ui,
          modalOpen: false,
          currentModal: null,
        },
      }));
    },
  },
});

/**
 * Helper to check if any items are selected in UI
 */
export function hasUISelection(state: UISlice): boolean {
  return state.selectedItemIds.size > 0;
}

/**
 * Helper to get selected item count
 */
export function getUISelectionCount(state: UISlice): number {
  return state.selectedItemIds.size;
}
