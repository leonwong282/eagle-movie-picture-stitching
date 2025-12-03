/**
 * ShortcutsDialog Component
 *
 * Displays a modal dialog with all available keyboard shortcuts.
 */

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { getShortcutsList } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface ShortcutsDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
}

// ============================================================================
// Main Component
// ============================================================================

export function ShortcutsDialog({ isOpen, onClose }: ShortcutsDialogProps) {
  const { t } = useTranslation();
  const shortcuts = getShortcutsList();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('ui.shortcuts.title', 'Keyboard Shortcuts')}</DialogTitle>
          <DialogDescription>
            {t('ui.shortcuts.description', 'Use these shortcuts to quickly access features')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">
                  {t('ui.shortcuts.actionColumn', 'Action')}
                </th>
                <th className="text-right py-2 px-4 text-sm font-medium text-muted-foreground">
                  {t('ui.shortcuts.shortcutColumn', 'Shortcut')}
                </th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((shortcut) => (
                <tr
                  key={shortcut.action}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm">
                    {t(shortcut.description, shortcut.description)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <kbd
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1',
                        'rounded border border-border bg-muted',
                        'text-xs font-mono font-medium',
                        'shadow-sm'
                      )}
                    >
                      {shortcut.notation.split(/[\s+]/).filter(Boolean).map((key, index, array) => (
                        <span key={index} className="inline-flex items-center">
                          <span className="px-1.5 py-0.5 rounded bg-background border border-border min-w-[1.5rem] text-center">
                            {key}
                          </span>
                          {index < array.length - 1 && (
                            <span className="mx-1 text-muted-foreground">+</span>
                          )}
                        </span>
                      ))}
                    </kbd>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShortcutsDialog;

