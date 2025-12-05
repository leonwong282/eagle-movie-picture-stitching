import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Monitor, Settings, X, Info, Pin, PinOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { useTheme } from '@/hooks/useTheme';
import { eagleApi } from '@/lib/eagle-api';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Plugin title */
  title?: string;
  /** Show theme cycle button (cycles through light → dark → auto) */
  showThemeToggle?: boolean;
  /** Show info/help button */
  showInfo?: boolean;
  /** Info button click handler */
  onInfoClick?: () => void;
  /** Show settings button */
  showSettings?: boolean;
  /** Settings click handler */
  onSettingsClick?: () => void;
  /** Show pin/always-on-top button */
  showPin?: boolean;
  /** Pin state change handler (isPinned: boolean) */
  onPinChange?: (isPinned: boolean) => void;
  /** Show close button */
  showClose?: boolean;
  /** Close click handler */
  onCloseClick?: () => void;
  /** Custom actions to render on the right. Note: Tooltips require TooltipProvider wrapper. */
  actions?: React.ReactNode;
}

export function Header({
  title,
  showThemeToggle = false,
  showInfo = false,
  onInfoClick,
  showSettings = false,
  onSettingsClick,
  showPin = true,
  onPinChange,
  showClose = true,
  onCloseClick,
  actions,
  className,
  ...props
}: HeaderProps) {
  const { t } = useTranslation();
  const { theme, cycleTheme } = useTheme();
  const [isPinned, setIsPinned] = React.useState(false);

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

    const handlePinToggle = () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    onPinChange?.(newPinnedState);
    // Call Eagle API to set always on top
    if (!eagleApi.isMock) {
      eagleApi.raw.window?.setAlwaysOnTop?.(newPinnedState);
    }
  };

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
            onClick={cycleTheme}
            title={`${t('app.theme')}: ${theme}`}
          >
            <ThemeIcon className="w-4 h-4" />
          </Button>
        )}

        {showInfo && (
          <Button variant="ghost" size="icon" onClick={onInfoClick} title={t('app.info')}>
            <Info className="w-4 h-4" />
          </Button>
        )}

        {showSettings && (
          <Button variant="ghost" size="icon" onClick={onSettingsClick} title={t('app.settings')}>
            <Settings className="w-4 h-4" />
          </Button>
        )}

        {showPin && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePinToggle}
            title={isPinned ? t('app.unpin') : t('app.pin')}
            className={cn(isPinned && 'text-primary')}
          >
            {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
          </Button>
        )}

        {showClose && (
          <Button variant="ghost" size="icon" onClick={handleClose} title={t('app.close')}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
