/**
 * ParameterPanel Component
 *
 * Settings panel for configuring stitching parameters:
 * - Top/Bottom crop percentages
 * - Export format (JPG, PNG, WebP)
 * - Export quality
 */

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Globe, Image as ImageIcon } from 'lucide-react';
import { Slider } from '@/components/ui/Slider';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import type { ExportFormat } from '@/stores';

// ============================================================================
// Types
// ============================================================================

interface ParameterPanelProps {
  /** Top crop percentage */
  cropTopPercent: number;
  /** Bottom crop percentage */
  cropBottomPercent: number;
  /** Maximum allowed top crop */
  maxCropTop: number;
  /** Maximum allowed bottom crop */
  maxCropBottom: number;
  /** Export format */
  exportFormat: ExportFormat;
  /** Export quality (0.1-1.0) */
  exportQuality: number;
  /** Callback when top crop changes */
  onCropTopChange: (value: number) => void;
  /** Callback when bottom crop changes */
  onCropBottomChange: (value: number) => void;
  /** Callback when export format changes */
  onFormatChange: (format: ExportFormat) => void;
  /** Callback when export quality changes */
  onQualityChange: (quality: number) => void;
  /** Whether panel is disabled */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Ref for top crop input */
  cropTopInputRef?: React.RefObject<HTMLInputElement>;
  /** Ref for bottom crop input */
  cropBottomInputRef?: React.RefObject<HTMLInputElement>;
}

// ============================================================================
// Format Button Component
// ============================================================================

interface FormatButtonProps {
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
}

function FormatButton({
  isSelected,
  onClick,
  disabled,
  label,
  icon,
  tooltip,
}: FormatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={cn(
        'flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-lg',
        'border-2 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        isSelected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium uppercase">{label}</span>
    </button>
  );
}

// ============================================================================
// Crop Slider Section Component
// ============================================================================

interface CropSliderSectionProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
  helpText: string;
  disabled?: boolean;
  id: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

function CropSliderSection({
  label,
  value,
  max,
  onChange,
  helpText,
  disabled,
  id,
  inputRef,
}: CropSliderSectionProps) {
  const handleSliderChange = useCallback(
    (values: number[]) => {
      onChange(values[0]);
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10);
      if (!isNaN(newValue)) {
        onChange(Math.max(0, Math.min(max, newValue)));
      }
    },
    [onChange, max]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Slider
            id={id}
            value={[value]}
            min={0}
            max={max}
            step={1}
            onValueChange={handleSliderChange}
            disabled={disabled}
            aria-label={label}
          />
        </div>
        <Input
          ref={inputRef}
          type="number"
          value={value}
          onChange={handleInputChange}
          min={0}
          max={max}
          step={1}
          disabled={disabled}
          className="w-16 text-center tabular-nums"
          aria-label={`${label} value`}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {helpText} {max}%
      </p>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ParameterPanel({
  cropTopPercent,
  cropBottomPercent,
  maxCropTop,
  maxCropBottom,
  exportFormat,
  exportQuality,
  onCropTopChange,
  onCropBottomChange,
  onFormatChange,
  onQualityChange,
  disabled = false,
  className,
  cropTopInputRef,
  cropBottomInputRef,
}: ParameterPanelProps) {
  const { t } = useTranslation();

  // Format options with icons and tooltips
  const formatOptions = useMemo(
    () => [
      {
        format: 'jpg' as ExportFormat,
        label: 'JPG',
        icon: <Camera className="w-5 h-5" />,
        tooltip: t('ui.tooltips.formatJpg'),
      },
      {
        format: 'webp' as ExportFormat,
        label: 'WebP',
        icon: <Globe className="w-5 h-5" />,
        tooltip: t('ui.tooltips.formatWebp'),
      },
      {
        format: 'png' as ExportFormat,
        label: 'PNG',
        icon: <ImageIcon className="w-5 h-5" />,
        tooltip: t('ui.tooltips.formatPng'),
      },
    ],
    [t]
  );

  // Quality slider handler
  const handleQualityChange = useCallback(
    (values: number[]) => {
      // Convert from 10-100 range to 0.1-1.0 range
      onQualityChange(values[0] / 100);
    },
    [onQualityChange]
  );

  // Whether quality applies (not PNG)
  const qualityApplies = exportFormat !== 'png';

  // Get format description
  const formatDescription = useMemo(() => {
    switch (exportFormat) {
      case 'jpg':
        return t('ui.settings.formatOptions.jpg');
      case 'webp':
        return t('ui.settings.formatOptions.webp');
      case 'png':
        return t('ui.settings.formatOptions.png');
      default:
        return '';
    }
  }, [exportFormat, t]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Top Crop Slider */}
      <CropSliderSection
        id="crop-top"
        label={t('ui.settings.cropTop')}
        value={cropTopPercent}
        max={maxCropTop}
        onChange={onCropTopChange}
        helpText={t('ui.settings.maxSettingTop')}
        disabled={disabled}
        inputRef={cropTopInputRef}
      />

      {/* Bottom Crop Slider */}
      <CropSliderSection
        id="crop-bottom"
        label={t('ui.settings.cropBottom')}
        value={cropBottomPercent}
        max={maxCropBottom}
        onChange={onCropBottomChange}
        helpText={t('ui.settings.maxSettingBottom')}
        disabled={disabled}
        inputRef={cropBottomInputRef}
      />

      {/* Export Format */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t('ui.settings.exportFormat')}
        </Label>
        <div className="flex gap-2">
          {formatOptions.map((option) => (
            <FormatButton
              key={option.format}
              isSelected={exportFormat === option.format}
              onClick={() => onFormatChange(option.format)}
              disabled={disabled}
              label={option.label}
              icon={option.icon}
              tooltip={option.tooltip}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{formatDescription}</p>
      </div>

      {/* Export Quality */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="export-quality" className="text-sm font-medium">
            {t('ui.settings.exportQuality')}
          </Label>
          <span
            className={cn(
              'px-2 py-0.5 rounded text-xs font-medium tabular-nums',
              qualityApplies
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {exportQuality.toFixed(2)}
          </span>
        </div>
        <Slider
          id="export-quality"
          value={[Math.round(exportQuality * 100)]}
          min={10}
          max={100}
          step={1}
          onValueChange={handleQualityChange}
          disabled={disabled || !qualityApplies}
          aria-label={t('ui.settings.exportQuality')}
        />
        <p className="text-xs text-muted-foreground">
          {qualityApplies
            ? t('ui.settings.qualityHelp')
            : t('ui.settings.qualityNotApplicable')}
        </p>
      </div>

      {/* Crop Total Warning */}
      {cropTopPercent + cropBottomPercent >= 90 && (
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
          <p className="text-xs text-warning">
            {t('ui.settings.cropHelp')}
          </p>
        </div>
      )}
    </div>
  );
}

export default ParameterPanel;

