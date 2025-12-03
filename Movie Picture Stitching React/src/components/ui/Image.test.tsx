/**
 * Tests for components/ui/Image.tsx
 * EagleImage, ImageGrid, ImagePlaceholder components
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { EagleImage, ImageGrid, ImagePlaceholder } from './Image';
import type { Item } from '@/types/eagle';

// ============================================================================
// Test Helpers
// ============================================================================

const createMockItem = (overrides: Partial<Item> = {}): Item =>
  ({
    id: 'test-id',
    name: 'test-image.jpg',
    ext: 'jpg',
    width: 1920,
    height: 1080,
    thumbnailURL: 'https://example.com/thumb.jpg',
    fileURL: 'https://example.com/full.jpg',
    filePath: '/path/to/image.jpg',
    ...overrides,
  }) as Item;

// 1x1 transparent PNG for testing
const validDataUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// ============================================================================
// EagleImage Component
// ============================================================================

describe('EagleImage', () => {
  afterEach(() => {
    cleanup();
  });

  describe('rendering', () => {
    it('renders with direct src prop', () => {
      render(<EagleImage src={validDataUrl} />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', validDataUrl);
    });

    it('renders with item prop using fileURL when useThumbnail is false', () => {
      const item = createMockItem();
      render(<EagleImage item={item} useThumbnail={false} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://example.com/full.jpg');
    });

    it('renders with item prop using thumbnailURL when useThumbnail is true', () => {
      const item = createMockItem();
      render(<EagleImage item={item} useThumbnail />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://example.com/thumb.jpg');
    });

    it('falls back to fileURL when thumbnailURL is not available', () => {
      const item = createMockItem({ thumbnailURL: undefined });
      render(<EagleImage item={item} useThumbnail />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://example.com/full.jpg');
    });

    it('falls back to filePath when fileURL is not available', () => {
      const item = createMockItem({
        thumbnailURL: undefined,
        fileURL: undefined,
      });
      render(<EagleImage item={item} useThumbnail />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/path/to/image.jpg');
    });

    it('prefers direct src over item', () => {
      const item = createMockItem();
      render(<EagleImage src={validDataUrl} item={item} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', validDataUrl);
    });

    it('forwards ref correctly', () => {
      const ref = { current: null } as React.RefObject<HTMLImageElement>;
      render(<EagleImage src={validDataUrl} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });

    it('has displayName', () => {
      expect(EagleImage.displayName).toBe('EagleImage');
    });
  });

  describe('loading state', () => {
    it('shows skeleton when showSkeleton is true and loading', () => {
      render(<EagleImage src={validDataUrl} showSkeleton />);

      // Look for animate-pulse class on skeleton
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('hides skeleton when showSkeleton is false', () => {
      render(<EagleImage src={validDataUrl} showSkeleton={false} />);

      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });

    it('shows skeleton by default', () => {
      render(<EagleImage src={validDataUrl} />);

      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('hides skeleton after image loads', async () => {
      render(<EagleImage src={validDataUrl} showSkeleton />);

      const img = screen.getByRole('img');
      fireEvent.load(img);

      await waitFor(() => {
        expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
      });
    });

    it('has lazy loading attribute', () => {
      render(<EagleImage src={validDataUrl} />);

      expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
    });

    it('has async decoding attribute', () => {
      render(<EagleImage src={validDataUrl} />);

      expect(screen.getByRole('img')).toHaveAttribute('decoding', 'async');
    });
  });

  describe('error state', () => {
    it('shows fallback on error', async () => {
      render(
        <EagleImage src="invalid.jpg" fallback={<div data-testid="fallback">Error occurred</div>} />
      );

      const img = screen.getByRole('img');
      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.getByTestId('fallback')).toBeInTheDocument();
      });
    });

    it('shows retry button when no fallback provided', async () => {
      render(<EagleImage src="invalid.jpg" />);

      const img = screen.getByRole('img');
      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
      });
    });

    it('retries loading on retry button click', async () => {
      render(<EagleImage src="invalid.jpg" />);

      const img = screen.getByRole('img');
      fireEvent.error(img);

      await waitFor(() => {
        const retryButton = screen.getByText('Retry');
        fireEvent.click(retryButton);
      });

      // Should show image again (attempting reload)
      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });
    });
  });

  describe('callbacks', () => {
    it('calls onLoadSuccess when image loads', async () => {
      const onLoadSuccess = vi.fn();
      render(<EagleImage src={validDataUrl} onLoadSuccess={onLoadSuccess} />);

      const img = screen.getByRole('img');
      fireEvent.load(img);

      expect(onLoadSuccess).toHaveBeenCalledTimes(1);
    });

    it('calls onLoad when image loads', async () => {
      const onLoad = vi.fn();
      render(<EagleImage src={validDataUrl} onLoad={onLoad} />);

      const img = screen.getByRole('img');
      fireEvent.load(img);

      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it('calls onLoadError when image fails', async () => {
      const onLoadError = vi.fn();
      render(<EagleImage src="invalid.jpg" onLoadError={onLoadError} />);

      const img = screen.getByRole('img');
      fireEvent.error(img);

      expect(onLoadError).toHaveBeenCalledTimes(1);
      expect(onLoadError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('calls onError when image fails', async () => {
      const onError = vi.fn();
      render(<EagleImage src="invalid.jpg" onError={onError} />);

      const img = screen.getByRole('img');
      fireEvent.error(img);

      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('styling', () => {
    it('applies aspectRatio style to container', () => {
      const { container } = render(<EagleImage src={validDataUrl} aspectRatio="16/9" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ aspectRatio: '16/9' });
    });

    it('merges custom className', () => {
      const { container } = render(<EagleImage src={validDataUrl} className="custom-class" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
      expect(wrapper).toHaveClass('relative');
      expect(wrapper).toHaveClass('overflow-hidden');
    });

    it('image has object-cover and transition classes', () => {
      render(<EagleImage src={validDataUrl} />);

      const img = screen.getByRole('img');
      expect(img).toHaveClass('object-cover');
      expect(img).toHaveClass('transition-opacity');
    });
  });

  describe('alt text', () => {
    it('uses alt prop when provided', () => {
      render(<EagleImage src={validDataUrl} alt="Custom alt text" />);

      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Custom alt text');
    });

    it('uses item.name as fallback alt', () => {
      const item = createMockItem({ name: 'my-photo.jpg' });
      render(<EagleImage item={item} />);

      expect(screen.getByRole('img')).toHaveAttribute('alt', 'my-photo.jpg');
    });

    it('uses "Image" as default alt', () => {
      render(<EagleImage src={validDataUrl} />);

      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Image');
    });
  });

  describe('no source', () => {
    it('returns null when no src or item', () => {
      const { container } = render(<EagleImage />);

      expect(container).toBeEmptyDOMElement();
    });

    it('shows fallback when no src and fallback provided', () => {
      render(<EagleImage fallback={<div data-testid="no-image-fallback">No image</div>} />);

      expect(screen.getByTestId('no-image-fallback')).toBeInTheDocument();
    });
  });

  describe('HTML attributes', () => {
    it('passes through standard img attributes', () => {
      render(<EagleImage src={validDataUrl} data-testid="test-image" title="Image title" />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('data-testid', 'test-image');
      expect(img).toHaveAttribute('title', 'Image title');
    });
  });
});

// ============================================================================
// ImageGrid Component
// ============================================================================

describe('ImageGrid', () => {
  afterEach(() => {
    cleanup();
  });

  describe('rendering', () => {
    it('renders children in grid layout', () => {
      render(
        <ImageGrid>
          <div data-testid="child-1">1</div>
          <div data-testid="child-2">2</div>
        </ImageGrid>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('has grid class', () => {
      const { container } = render(
        <ImageGrid>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('grid');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGrid ref={ref}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('has displayName', () => {
      expect(ImageGrid.displayName).toBe('ImageGrid');
    });
  });

  describe('columns prop', () => {
    it('applies 2 column classes', () => {
      const { container } = render(
        <ImageGrid columns={2}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('grid-cols-2');
    });

    it('applies 3 column classes with responsive breakpoint', () => {
      const { container } = render(
        <ImageGrid columns={3}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('grid-cols-2');
      expect(container.firstChild).toHaveClass('md:grid-cols-3');
    });

    it('applies 4 column classes (default) with responsive breakpoints', () => {
      const { container } = render(
        <ImageGrid columns={4}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('grid-cols-2');
      expect(container.firstChild).toHaveClass('md:grid-cols-3');
      expect(container.firstChild).toHaveClass('lg:grid-cols-4');
    });

    it('applies 5 column classes with responsive breakpoints', () => {
      const { container } = render(
        <ImageGrid columns={5}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('lg:grid-cols-5');
    });

    it('applies 6 column classes with responsive breakpoints', () => {
      const { container } = render(
        <ImageGrid columns={6}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('grid-cols-3');
      expect(container.firstChild).toHaveClass('md:grid-cols-4');
      expect(container.firstChild).toHaveClass('lg:grid-cols-6');
    });

    it('uses default columns (4) when not specified', () => {
      const { container } = render(
        <ImageGrid>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('lg:grid-cols-4');
    });
  });

  describe('gap prop', () => {
    it('applies gap-1 class', () => {
      const { container } = render(
        <ImageGrid gap={1}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('gap-1');
    });

    it('applies gap-2 class (default)', () => {
      const { container } = render(
        <ImageGrid gap={2}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('gap-2');
    });

    it('applies gap-3 class', () => {
      const { container } = render(
        <ImageGrid gap={3}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('gap-3');
    });

    it('applies gap-4 class', () => {
      const { container } = render(
        <ImageGrid gap={4}>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('gap-4');
    });

    it('uses default gap (2) when not specified', () => {
      const { container } = render(
        <ImageGrid>
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('gap-2');
    });
  });

  describe('className merging', () => {
    it('merges custom className', () => {
      const { container } = render(
        <ImageGrid className="custom-grid">
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveClass('custom-grid');
      expect(container.firstChild).toHaveClass('grid');
    });
  });

  describe('HTML attributes', () => {
    it('passes through HTML attributes', () => {
      const { container } = render(
        <ImageGrid data-testid="test-grid" aria-label="Image gallery">
          <div>Child</div>
        </ImageGrid>
      );

      expect(container.firstChild).toHaveAttribute('data-testid', 'test-grid');
      expect(container.firstChild).toHaveAttribute('aria-label', 'Image gallery');
    });
  });
});

// ============================================================================
// ImagePlaceholder Component
// ============================================================================

describe('ImagePlaceholder', () => {
  afterEach(() => {
    cleanup();
  });

  describe('rendering', () => {
    it('renders with default text', () => {
      render(<ImagePlaceholder />);

      expect(screen.getByText('No image')).toBeInTheDocument();
    });

    it('renders custom text', () => {
      render(<ImagePlaceholder text="Custom placeholder" />);

      expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      render(<ImagePlaceholder icon={<span data-testid="icon">🖼️</span>} />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders both icon and text', () => {
      render(
        <ImagePlaceholder icon={<span data-testid="icon">🖼️</span>} text="No image available" />
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('No image available')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<ImagePlaceholder ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('has displayName', () => {
      expect(ImagePlaceholder.displayName).toBe('ImagePlaceholder');
    });
  });

  describe('empty text', () => {
    it('does not render text span when text is empty string', () => {
      const { container } = render(<ImagePlaceholder text="" />);

      // Should not have any text span
      const textSpan = container.querySelector('span.text-xs');
      expect(textSpan).not.toBeInTheDocument();
    });
  });

  describe('no icon', () => {
    it('does not render icon wrapper when icon not provided', () => {
      const { container } = render(<ImagePlaceholder />);

      // Icon wrapper has w-8 h-8 classes
      const iconWrapper = container.querySelector('.w-8.h-8');
      expect(iconWrapper).not.toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies default aspectRatio (1/1)', () => {
      const { container } = render(<ImagePlaceholder />);

      expect(container.firstChild).toHaveStyle({ aspectRatio: '1/1' });
    });

    it('applies custom aspectRatio', () => {
      const { container } = render(<ImagePlaceholder aspectRatio="16/9" />);

      expect(container.firstChild).toHaveStyle({ aspectRatio: '16/9' });
    });

    it('has flex layout classes', () => {
      const { container } = render(<ImagePlaceholder />);

      expect(container.firstChild).toHaveClass('flex');
      expect(container.firstChild).toHaveClass('flex-col');
      expect(container.firstChild).toHaveClass('items-center');
      expect(container.firstChild).toHaveClass('justify-center');
    });

    it('has muted background and text color', () => {
      const { container } = render(<ImagePlaceholder />);

      expect(container.firstChild).toHaveClass('bg-muted');
      expect(container.firstChild).toHaveClass('text-muted-foreground');
    });

    it('has rounded corners', () => {
      const { container } = render(<ImagePlaceholder />);

      expect(container.firstChild).toHaveClass('rounded-lg');
    });
  });

  describe('className merging', () => {
    it('merges custom className', () => {
      const { container } = render(<ImagePlaceholder className="custom-placeholder" />);

      expect(container.firstChild).toHaveClass('custom-placeholder');
      expect(container.firstChild).toHaveClass('flex');
      expect(container.firstChild).toHaveClass('bg-muted');
    });
  });

  describe('HTML attributes', () => {
    it('passes through HTML attributes', () => {
      const { container } = render(<ImagePlaceholder data-testid="test-placeholder" role="img" />);

      expect(container.firstChild).toHaveAttribute('data-testid', 'test-placeholder');
      expect(container.firstChild).toHaveAttribute('role', 'img');
    });
  });
});
