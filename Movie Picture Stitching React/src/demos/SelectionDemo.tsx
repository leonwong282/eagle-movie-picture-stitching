/**
 * Selection Demo
 *
 * Demonstrates Eagle selection API integration:
 * - Real-time selection polling with hash-based change detection
 * - Image grid with thumbnails
 * - Selection count and metadata display
 * - Environment detection (mock vs Eagle)
 */
import { useTranslation } from 'react-i18next';
import { Image, FolderOpen, Tag, RefreshCw } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  EagleImage,
  ImageGrid,
  ImagePlaceholder,
} from '@/components';
import { useEagleSelection, useTheme } from '@/hooks';
import { eagleApi } from '@/lib';

export function SelectionDemo() {
  const { t } = useTranslation();
  const { items, isLoading, refresh } = useEagleSelection();
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      {/* Main Selection Card */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Eagle Selection
              </CardTitle>
              <CardDescription>
                {isLoading
                  ? t('messages.loading')
                  : t('demo.selectedCount', { count: items.length })}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <ImageGrid columns={4} gap={3}>
              {items.slice(0, 12).map((item) => (
                <Card key={item.id} variant="outline" className="overflow-hidden group">
                  <EagleImage
                    item={item}
                    useThumbnail
                    aspectRatio="4/3"
                    className="transition-transform group-hover:scale-105"
                    fallback={
                      <ImagePlaceholder
                        icon={<Image className="w-full h-full" />}
                        text={item.ext?.toUpperCase() || 'Image'}
                        aspectRatio="4/3"
                      />
                    }
                  />
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.width} × {item.height} • {item.ext?.toUpperCase()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ImageGrid>
          ) : (
            <div className="text-center py-12">
              <ImagePlaceholder
                icon={<Image className="w-full h-full" />}
                text={t('messages.noItems')}
                aspectRatio="16/9"
                className="mx-auto max-w-xs"
              />
              <p className="text-sm text-muted-foreground/70 mt-4">
                Select items in Eagle to see them here
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">
            Polling every 500ms with hash-based change detection
          </span>
          {items.length > 12 && (
            <span className="text-sm text-muted-foreground">
              Showing 12 of {items.length} items
            </span>
          )}
        </CardFooter>
      </Card>

      {/* Selection Details */}
      {items.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* File Types */}
          <Card variant="outline">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">File Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[...new Set(items.map((item) => item.ext?.toUpperCase()))].map((ext) => (
                  <span key={ext} className="px-2 py-1 rounded-md bg-muted text-xs font-medium">
                    {ext || 'Unknown'}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Folders */}
          <Card variant="outline">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Folders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {[...new Set(items.flatMap((item) => item.folders || []))].length} unique folders
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card variant="outline">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {[...new Set(items.flatMap((item) => item.tags || []))].slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {[...new Set(items.flatMap((item) => item.tags || []))].length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    +{[...new Set(items.flatMap((item) => item.tags || []))].length - 5} more
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Environment Info */}
      <Card variant="outline">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-6 text-sm justify-center">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${eagleApi.isMock ? 'bg-warning' : 'bg-success'}`}
              />
              <span className="text-muted-foreground">
                {eagleApi.isMock ? 'Development (Mock)' : 'Eagle Plugin'}
              </span>
            </div>
            <div className="text-muted-foreground">
              <strong>Platform:</strong> {eagleApi.platform}
            </div>
            <div className="text-muted-foreground">
              <strong>Theme:</strong> {isDarkMode ? 'Dark' : 'Light'}
            </div>
            <div className="text-muted-foreground">
              <strong>Locale:</strong> {eagleApi.locale}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SelectionDemo;
