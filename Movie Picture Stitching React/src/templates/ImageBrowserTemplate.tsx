/**
 * Image Browser Template
 *
 * An image browsing layout with filtering, suitable for:
 * - Image galleries
 * - Asset browsers
 * - Search and filter interfaces
 *
 * Features:
 * - Grid/List view toggle
 * - Search and filter
 * - Sorting options
 * - Selection support
 */
import { ReactNode, useState, useMemo } from 'react';
import { Search, Grid3X3, List, SortAsc, SortDesc, Filter, X, Check } from 'lucide-react';
import {
  Header,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Card,
  CardContent,
  EagleImage,
  ImageGrid,
  ImagePlaceholder,
} from '@/components';
import { cn } from '@/lib/utils';
import type { Item } from '@/types/eagle';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'date' | 'size' | 'type';
type SortOrder = 'asc' | 'desc';

interface ImageBrowserTemplateProps {
  /** Plugin title */
  title: string;
  /** Items to display */
  items: Item[];
  /** Currently selected item IDs */
  selectedIds?: string[];
  /** Selection change handler */
  onSelectionChange?: (ids: string[]) => void;
  /** Item click handler */
  onItemClick?: (item: Item) => void;
  /** Item double-click handler */
  onItemDoubleClick?: (item: Item) => void;
  /** Custom filter options */
  filterOptions?: {
    label: string;
    value: string;
  }[];
  /** Header actions */
  headerActions?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Close click handler */
  onCloseClick?: () => void;
  /** Enable multi-select */
  multiSelect?: boolean;
  /** Grid columns (2-6) */
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function ImageBrowserTemplate({
  title,
  items,
  selectedIds = [],
  onSelectionChange,
  onItemClick,
  onItemDoubleClick,
  filterOptions,
  headerActions,
  footer,
  onCloseClick,
  multiSelect = true,
  columns = 4,
}: ImageBrowserTemplateProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.ext?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Custom filter
    if (activeFilter !== 'all' && filterOptions) {
      result = result.filter((item) => {
        // Basic type filtering
        if (activeFilter === 'images') {
          return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(
            item.ext?.toLowerCase() || ''
          );
        }
        if (activeFilter === 'vectors') {
          return ['svg', 'ai', 'eps'].includes(item.ext?.toLowerCase() || '');
        }
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'date':
          comparison = (a.importedAt || 0) - (b.importedAt || 0);
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case 'type':
          comparison = (a.ext || '').localeCompare(b.ext || '');
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [items, searchQuery, sortField, sortOrder, activeFilter, filterOptions]);

  const handleItemClick = (item: Item, event: React.MouseEvent) => {
    if (onSelectionChange) {
      if (multiSelect && (event.ctrlKey || event.metaKey)) {
        // Toggle selection
        const newSelection = selectedIds.includes(item.id)
          ? selectedIds.filter((id) => id !== item.id)
          : [...selectedIds, item.id];
        onSelectionChange(newSelection);
      } else if (multiSelect && event.shiftKey && selectedIds.length > 0) {
        // Range selection
        const lastSelectedIndex = filteredItems.findIndex(
          (i) => i.id === selectedIds[selectedIds.length - 1]
        );
        const currentIndex = filteredItems.findIndex((i) => i.id === item.id);
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);
        const rangeIds = filteredItems.slice(start, end + 1).map((i) => i.id);
        onSelectionChange([...new Set([...selectedIds, ...rangeIds])]);
      } else {
        // Single selection
        onSelectionChange([item.id]);
      }
    }
    onItemClick?.(item);
  };

  const clearSelection = () => {
    onSelectionChange?.([]);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header
        title={title}
        showThemeToggle
        showClose
        onCloseClick={onCloseClick}
        actions={headerActions}
      />

      {/* Toolbar */}
      <div className="border-b border-border bg-card/30 px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Filter */}
          {filterOptions && (
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort */}
          <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>

          {/* View Mode */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ImagePlaceholder
                icon={<Search className="w-full h-full" />}
                text="No images found"
                aspectRatio="16/9"
                className="max-w-xs mx-auto mb-4"
              />
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : 'Select images in Eagle to browse'}
              </p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <ImageGrid columns={columns} gap={3}>
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                variant="outline"
                className={cn(
                  'overflow-hidden cursor-pointer group transition-all',
                  selectedIds.includes(item.id) && 'ring-2 ring-primary'
                )}
                onClick={(e) => handleItemClick(item, e)}
                onDoubleClick={() => onItemDoubleClick?.(item)}
              >
                <div className="relative">
                  <EagleImage
                    item={item}
                    useThumbnail
                    aspectRatio="1/1"
                    className="transition-transform group-hover:scale-105"
                    fallback={
                      <ImagePlaceholder
                        icon={<Grid3X3 className="w-full h-full" />}
                        text={item.ext?.toUpperCase() || 'IMG'}
                        aspectRatio="1/1"
                      />
                    }
                  />
                  {selectedIds.includes(item.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-2">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.width} × {item.height}
                  </p>
                </CardContent>
              </Card>
            ))}
          </ImageGrid>
        ) : (
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  selectedIds.includes(item.id) && 'bg-accent text-accent-foreground'
                )}
                onClick={(e) => handleItemClick(item, e)}
                onDoubleClick={() => onItemDoubleClick?.(item)}
              >
                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                  <EagleImage
                    item={item}
                    useThumbnail
                    aspectRatio="1/1"
                    fallback={
                      <ImagePlaceholder
                        icon={<Grid3X3 className="w-full h-full" />}
                        text=""
                        aspectRatio="1/1"
                      />
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.ext?.toUpperCase()} • {item.width} × {item.height}
                  </p>
                </div>
                {selectedIds.includes(item.id) && (
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      {(footer || selectedIds.length > 0) && (
        <footer className="border-t border-border bg-card/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{filteredItems.length} items</span>
              {selectedIds.length > 0 && (
                <>
                  <span>•</span>
                  <span>{selectedIds.length} selected</span>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                </>
              )}
            </div>
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}

// ============================================
// Example Usage Component
// ============================================

import { Download, Trash2 } from 'lucide-react';
import { useToast, toast } from '@/components';
import { useEagleSelection } from '@/hooks';

export function ImageBrowserExample() {
  const { items } = useEagleSelection();
  const { addToast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleExport = () => {
    if (selectedIds.length === 0) {
      addToast(toast.warning('No Selection', 'Please select images to export'));
      return;
    }
    addToast(toast.success('Export Started', `Exporting ${selectedIds.length} images`));
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      addToast(toast.warning('No Selection', 'Please select images to delete'));
      return;
    }
    addToast(toast.info('Delete', `Would delete ${selectedIds.length} images`));
  };

  return (
    <ImageBrowserTemplate
      title="Image Browser"
      items={items}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      onItemDoubleClick={(item) => addToast(toast.info('Open', `Opening ${item.name}`))}
      filterOptions={[
        { label: 'Images', value: 'images' },
        { label: 'Vectors', value: 'vectors' },
      ]}
      footer={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button variant="primary" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      }
    />
  );
}

export default ImageBrowserTemplate;
