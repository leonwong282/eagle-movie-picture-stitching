/**
 * Three-Column Template
 *
 * A classic Eagle plugin layout with:
 * - Header: title, logo, theme toggle, close button
 * - Left column: Input queue (image list, file list)
 * - Center column: Content preview / current step
 * - Right column: Parameters and adjustments
 * - Footer: Action buttons and status display
 *
 * ┌────────────────────────────────────────────────┐
 * │ Header                                         │
 * ├──────────┬──────────────────────┬──────────────┤
 * │          │                      │  Parameters  │
 * │  Input   │    Content/Preview   │              │
 * │  Queue   │                      │  [slider]    │
 * │          │                      │  [select]    │
 * │  [item]  │                      │  [checkbox]  │
 * │  [item]  │                      │              │
 * │  [item]  │                      │              │
 * ├──────────┴──────────────────────┴──────────────┤
 * │ Footer (actions + status)                      │
 * └────────────────────────────────────────────────┘
 */
import { ReactNode } from 'react';
import { Header } from '@/components';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface ThreeColumnTemplateProps {
  /** Plugin title displayed in header */
  title: string;
  /** Header actions (custom buttons) */
  headerActions?: ReactNode;
  /** Show theme toggle in header */
  showThemeToggle?: boolean;
  /** Show close button in header */
  showClose?: boolean;
  /** Close button click handler */
  onCloseClick?: () => void;

  /** Left column content (input queue, file list) */
  leftPanel: ReactNode;
  /** Left column title */
  leftTitle?: string;
  /** Left column width (Tailwind width class, default: 'w-64') */
  leftWidth?: string;

  /** Center content (preview, canvas, main content) */
  children: ReactNode;
  /** Center column title */
  centerTitle?: string;

  /** Right column content (parameters, adjustments) */
  rightPanel: ReactNode;
  /** Right column title */
  rightTitle?: string;
  /** Right column width (Tailwind width class, default: 'w-72') */
  rightWidth?: string;

  /** Footer content (action buttons, status) */
  footer?: ReactNode;

  /** Additional class for the main container */
  className?: string;
}

// ============================================================================
// Panel Header Component
// ============================================================================

interface PanelHeaderProps {
  title?: string;
  className?: string;
}

function PanelHeader({ title, className }: PanelHeaderProps) {
  if (!title) return null;

  return (
    <div
      className={cn(
        'flex items-center px-3 py-2 border-b border-border',
        'text-sm font-medium text-muted-foreground',
        className
      )}
    >
      {title}
    </div>
  );
}

// ============================================================================
// Three Column Template
// ============================================================================

export function ThreeColumnTemplate({
  title,
  headerActions,
  showThemeToggle = true,
  showClose = true,
  onCloseClick,
  leftPanel,
  leftTitle,
  leftWidth = 'w-64',
  children,
  centerTitle,
  rightPanel,
  rightTitle,
  rightWidth = 'w-72',
  footer,
  className,
}: ThreeColumnTemplateProps) {
  return (
    <div className={cn('h-screen flex flex-col bg-background text-foreground', className)}>
      {/* Header */}
      <Header
        title={title}
        showThemeToggle={showThemeToggle}
        showClose={showClose}
        onCloseClick={onCloseClick}
        actions={headerActions}
      />

      {/* Main Three-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Input Queue */}
        <aside
          className={cn(
            leftWidth,
            'flex-shrink-0 flex flex-col',
            'border-r border-border bg-card/30'
          )}
        >
          <PanelHeader title={leftTitle} />
          <div className="flex-1 overflow-auto p-3">{leftPanel}</div>
        </aside>

        {/* Center Panel - Preview / Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <PanelHeader title={centerTitle} />
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </main>

        {/* Right Panel - Parameters */}
        <aside
          className={cn(
            rightWidth,
            'flex-shrink-0 flex flex-col',
            'border-l border-border bg-card/30'
          )}
        >
          <PanelHeader title={rightTitle} />
          <div className="flex-1 overflow-auto p-3">{rightPanel}</div>
        </aside>
      </div>

      {/* Footer - Actions & Status */}
      {footer && (
        <footer
          className={cn(
            'flex items-center justify-between px-4 py-3',
            'border-t border-border bg-card/30'
          )}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}

// ============================================================================
// Helper Components for Common Patterns
// ============================================================================

/**
 * Footer with left status and right actions
 */
interface ThreeColumnFooterProps {
  /** Left side content (status text, progress) */
  status?: ReactNode;
  /** Right side content (action buttons) */
  actions?: ReactNode;
  /** Center content (optional, e.g., progress bar) */
  center?: ReactNode;
}

export function ThreeColumnFooter({ status, actions, center }: ThreeColumnFooterProps) {
  return (
    <>
      <div className="flex items-center gap-3">{status}</div>
      {center && <div className="flex-1 px-4">{center}</div>}
      <div className="flex items-center gap-2">{actions}</div>
    </>
  );
}

/**
 * Queue item for left panel
 */
interface QueueItemProps {
  /** Thumbnail URL or element */
  thumbnail?: ReactNode;
  /** Item title */
  title: string;
  /** Item subtitle or metadata */
  subtitle?: string;
  /** Whether this item is selected */
  isSelected?: boolean;
  /** Whether this item is currently being processed */
  isProcessing?: boolean;
  /** Whether this item is completed */
  isCompleted?: boolean;
  /** Whether this item has an error */
  hasError?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional class */
  className?: string;
}

export function QueueItem({
  thumbnail,
  title,
  subtitle,
  isSelected = false,
  isProcessing = false,
  isCompleted = false,
  hasError = false,
  onClick,
  className,
}: QueueItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
        'hover:bg-muted/50',
        isSelected && 'bg-primary/10 border border-primary/30',
        isProcessing && 'animate-pulse',
        isCompleted && 'opacity-60',
        hasError && 'border border-destructive/30 bg-destructive/5',
        className
      )}
    >
      {/* Thumbnail */}
      {thumbnail && (
        <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          {typeof thumbnail === 'string' ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          ) : (
            thumbnail
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>

      {/* Status indicators */}
      {isProcessing && (
        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" title="Processing" />
      )}
      {isCompleted && <div className="w-2 h-2 rounded-full bg-success" title="Completed" />}
      {hasError && <div className="w-2 h-2 rounded-full bg-destructive" title="Error" />}
    </div>
  );
}

/**
 * Parameter section for right panel
 */
interface ParameterSectionProps {
  /** Section title */
  title: string;
  /** Section content */
  children: ReactNode;
  /** Collapsible (default: false) */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Additional class */
  className?: string;
}

export function ParameterSection({ title, children, className }: ParameterSectionProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * Status badge for footer
 */
interface StatusBadgeProps {
  /** Status type */
  status: 'idle' | 'processing' | 'success' | 'error' | 'warning';
  /** Status text */
  text: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const colors = {
    idle: 'bg-muted text-muted-foreground',
    processing: 'bg-warning/20 text-warning',
    success: 'bg-success/20 text-success',
    error: 'bg-destructive/20 text-destructive',
    warning: 'bg-warning/20 text-warning',
  };

  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', colors[status])}>
      {text}
    </span>
  );
}

export default ThreeColumnTemplate;
