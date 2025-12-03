import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { useTheme } from '@/hooks/useTheme';
import { eagleApi } from '@/lib/eagle-api';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Plugin title */
  title?: string;
  /** Show theme toggle button */
  showThemeToggle?: boolean;
  /** Show settings button */
  showSettings?: boolean;
  /** Settings click handler */
  onSettingsClick?: () => void;
  /** Show close button */
  showClose?: boolean;
  /** Close click handler */
  onCloseClick?: () => void;
  /** Custom actions to render on the right */
  actions?: React.ReactNode;
}

export function Header({
  title,
  showThemeToggle = false,
  showSettings = false,
  onSettingsClick,
  showClose = true,
  onCloseClick,
  actions,
  className,
  ...props
}: HeaderProps) {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleClose = () => {
    if (onCloseClick) {
      onCloseClick();
    } else {
      eagleApi.raw.window?.hide?.();
    }
  };

  return (
    <header
      className={cn(
        'flex items-center justify-between px-4 py-3',
        'bg-background/80 backdrop-blur-xl',
        'border-b border-border',
        // Eagle drag region support
        'drag-region select-none',
        // sticky top
        'sticky top-0 z-10',
        className
      )}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      {...props}
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <img src="./logo.png" alt="Logo" className="w-6 h-6 object-contain" />
        <h1 className="text-lg font-semibold">{title || t('app.title')}</h1>
        {eagleApi.isMock && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-warning/20 text-warning">
            DEV
          </span>
        )}
      </div>

      {/* Right: Actions */}
      <div
        className="flex items-center gap-2 no-drag"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {actions}

        {showThemeToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={isDarkMode ? t('ui.header.lightMode') : t('ui.header.darkMode')}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        )}

        {showSettings && (
          <Button variant="ghost" size="icon" onClick={onSettingsClick} title={t('ui.header.settings', 'Settings')}>
            <Settings className="w-5 h-5" />
          </Button>
        )}

        {showClose && (
          <Button variant="ghost" size="icon" onClick={handleClose} title={t('ui.header.closeWindow')}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
