/**
 * Keyboard Shortcut Manager Module
 * Handles keyboard shortcuts for common actions
 */

class KeyboardShortcutManager {
    constructor() {
        this.shortcuts = new Map();
        this.isEnabled = true;
        this.platform = this.detectPlatform();
        this.keydownHandler = null;
    }

    /**
     * Initialize keyboard shortcut manager
     */
    initialize() {
        this.registerShortcuts();
        this.setupGlobalListener();
        this.updateUIHints();
        console.log('[KeyboardShortcutManager] Initialized with platform:', this.platform);
    }

    /**
     * Detect platform (macOS or Windows)
     * @returns {string} 'mac' or 'windows'
     */
    detectPlatform() {
        const platform = navigator.platform.toLowerCase();

        // Check for macOS variants
        if (platform.includes('mac')) {
            return 'mac';
        }

        // Check for Windows variants
        if (platform.includes('win')) {
            return 'windows';
        }

        // Check for Linux (treat as Windows-style shortcuts)
        if (platform.includes('linux')) {
            return 'windows';
        }

        // Default to Windows for unknown platforms
        return 'windows';
    }

    /**
     * Register all keyboard shortcuts
     */
    registerShortcuts() {
        // Preview: Cmd+Shift+P / Ctrl+Shift+P
        this.shortcuts.set('preview', {
            key: 'p',
            modifiers: { meta: true, shift: true, alt: false, ctrl: false },
            action: 'keyboard:previewRequested',
            description: 'ui.shortcuts.preview'
        });

        // Save: Cmd+Shift+S / Ctrl+Shift+S
        this.shortcuts.set('save', {
            key: 's',
            modifiers: { meta: true, shift: true, alt: false, ctrl: false },
            action: 'keyboard:saveRequested',
            description: 'ui.shortcuts.save'
        });

        // Help: F1
        this.shortcuts.set('help', {
            key: 'F1',
            modifiers: { meta: false, shift: false, alt: false, ctrl: false },
            action: 'keyboard:helpRequested',
            description: 'ui.shortcuts.help'
        });

        // Pin Window: Cmd+Shift+T / Ctrl+Shift+T
        this.shortcuts.set('pin', {
            key: 't',
            modifiers: { meta: true, shift: true, alt: false, ctrl: false },
            action: 'keyboard:pinRequested',
            description: 'ui.shortcuts.pin'
        });

        console.log('[KeyboardShortcutManager] Registered', this.shortcuts.size, 'shortcuts');
    }

    /**
     * Setup global keydown listener
     */
    setupGlobalListener() {
        this.keydownHandler = (e) => {
            // CRITICAL: Ignore if typing in input field
            if (this.isInputFocused()) {
                return;
            }

            // Check if matches registered shortcut
            const shortcut = this.matchShortcut(e);
            if (shortcut) {
                e.preventDefault();
                e.stopPropagation();

                console.log('[KeyboardShortcut] Triggered:', shortcut.action);

                // Special handling for help modal (show directly)
                if (shortcut.action === 'keyboard:helpRequested') {
                    this.showHelpModal();
                    return;
                }

                // Dispatch CustomEvent for app to handle
                window.dispatchEvent(new CustomEvent(shortcut.action, {
                    detail: { shortcut: shortcut.key }
                }));
            }
        };

        window.addEventListener('keydown', this.keydownHandler);
        console.log('[KeyboardShortcutManager] Global keydown listener attached');
    }

    /**
     * Check if focus is currently in an input field
     * @returns {boolean} True if focus is in input/textarea/select
     */
    isInputFocused() {
        const activeElement = document.activeElement;
        if (!activeElement) return false;

        const tagName = activeElement.tagName;
        const isContentEditable = activeElement.isContentEditable;

        // Check if focus is in form elements
        const isFormElement = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName);

        return isFormElement || isContentEditable;
    }

    /**
     * Match keyboard event against registered shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     * @returns {Object|null} Matched shortcut config or null
     */
    matchShortcut(event) {
        for (const [name, config] of this.shortcuts) {
            const keyMatches = event.key.toLowerCase() === config.key.toLowerCase();

            // Platform-specific modifier mapping
            // On Mac: use metaKey (Command), on Windows: use ctrlKey
            const metaKey = this.platform === 'mac' ? event.metaKey : event.ctrlKey;

            // Check all modifiers match
            const modifiersMatch =
                metaKey === config.modifiers.meta &&
                event.shiftKey === config.modifiers.shift &&
                event.altKey === config.modifiers.alt &&
                event.ctrlKey === config.modifiers.ctrl;

            if (keyMatches && modifiersMatch) {
                return config;
            }
        }
        return null;
    }

    /**
     * Get shortcut notation for display
     * @param {string} shortcutName - Name of shortcut
     * @returns {string} Formatted shortcut notation (e.g., "⌘⇧P" or "Ctrl+Shift+P")
     */
    getShortcutNotation(shortcutName) {
        const config = this.shortcuts.get(shortcutName);
        if (!config) return '';

        let notation = '';

        if (this.platform === 'mac') {
            // macOS symbols
            if (config.modifiers.meta) notation += '⌘';
            if (config.modifiers.shift) notation += '⇧';
            if (config.modifiers.alt) notation += '⌥';
            if (config.modifiers.ctrl) notation += '⌃';
            notation += config.key.toUpperCase();
        } else {
            // Windows notation
            const parts = [];
            if (config.modifiers.meta) parts.push('Ctrl');
            if (config.modifiers.shift) parts.push('Shift');
            if (config.modifiers.alt) parts.push('Alt');
            parts.push(config.key.toUpperCase());
            notation = parts.join('+');
        }

        return notation;
    }

    /**
     * Update UI hints with shortcut notations
     */
    updateUIHints() {
        // Preview button
        const previewHint = document.getElementById('preview-shortcut-hint');
        if (previewHint) {
            previewHint.textContent = `(${this.getShortcutNotation('preview')})`;
        }

        // Save button
        const saveHint = document.getElementById('save-shortcut-hint');
        if (saveHint) {
            saveHint.textContent = `(${this.getShortcutNotation('save')})`;
        }

        // Help button
        const helpHint = document.getElementById('help-shortcut-hint');
        if (helpHint) {
            helpHint.textContent = this.getShortcutNotation('help');
        }

        console.log('[KeyboardShortcutManager] UI hints updated');
    }

    /**
     * Show help modal with all shortcuts
     */
    showHelpModal() {
        // Populate table body
        const tbody = document.getElementById('shortcuts-table-body');
        if (!tbody) {
            console.warn('[KeyboardShortcutManager] Modal table body not found');
            return;
        }

        tbody.innerHTML = '';

        // Add each shortcut to table
        for (const [name, config] of this.shortcuts) {
            const row = document.createElement('tr');

            const actionCell = document.createElement('td');
            actionCell.setAttribute('data-i18n', config.description);
            // Use i18nManager if available, otherwise use description key as fallback
            if (window.i18nManager) {
                actionCell.textContent = window.i18nManager.t(config.description);
            } else {
                actionCell.textContent = config.description;
            }

            const shortcutCell = document.createElement('td');
            const kbd = document.createElement('kbd');
            kbd.className = 'keyboard-hint';
            kbd.textContent = this.getShortcutNotation(name);
            shortcutCell.appendChild(kbd);

            row.appendChild(actionCell);
            row.appendChild(shortcutCell);
            tbody.appendChild(row);
        }

        // Translate modal content if i18n available
        if (window.i18nManager) {
            window.i18nManager.translatePage();
        }

        // Show modal using Bootstrap
        const modalElement = document.getElementById('shortcuts-modal');
        if (modalElement && typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            console.log('[KeyboardShortcutManager] Help modal shown');
        } else {
            console.warn('[KeyboardShortcutManager] Modal element or Bootstrap not found');
        }
    }

    /**
     * Cleanup event listeners
     */
    cleanup() {
        // Remove keydown listener
        if (this.keydownHandler) {
            window.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }

        // Clear shortcuts map
        this.shortcuts.clear();

        // Mark as not enabled
        this.isEnabled = false;

        console.log('[KeyboardShortcutManager] Cleaned up');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeyboardShortcutManager;
} else {
    window.KeyboardShortcutManager = KeyboardShortcutManager;
}
