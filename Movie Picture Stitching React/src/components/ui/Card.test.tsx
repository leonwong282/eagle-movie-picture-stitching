import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  cardVariants,
} from './Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders with children', () => {
      render(<Card>Card content</Card>);

      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as a div element', () => {
      render(<Card data-testid="card">Content</Card>);

      expect(screen.getByTestId('card').tagName).toBe('DIV');
    });

    it('has data-slot attribute', () => {
      render(<Card data-testid="card">Content</Card>);

      expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card');
    });
  });

  describe('variants', () => {
    it('applies default variant', () => {
      render(<Card data-testid="card">Default</Card>);
      const card = screen.getByTestId('card');

      expect(card.className).toContain('bg-card');
      expect(card.className).toContain('shadow-sm');
    });

    it('applies glass variant', () => {
      render(
        <Card variant="glass" data-testid="card">
          Glass
        </Card>
      );
      const card = screen.getByTestId('card');

      expect(card.className).toContain('bg-card/80');
      expect(card.className).toContain('backdrop-blur-xl');
      expect(card.className).toContain('border-border/50');
    });

    it('applies outline variant', () => {
      render(
        <Card variant="outline" data-testid="card">
          Outline
        </Card>
      );
      const card = screen.getByTestId('card');

      expect(card.className).toContain('bg-transparent');
      expect(card.className).toContain('border-2');
    });
  });

  describe('base classes', () => {
    it('has base styling classes', () => {
      render(<Card data-testid="card">Base</Card>);
      const card = screen.getByTestId('card');

      expect(card.className).toContain('flex');
      expect(card.className).toContain('flex-col');
      expect(card.className).toContain('rounded-xl');
      expect(card.className).toContain('border');
      expect(card.className).toContain('text-card-foreground');
    });
  });

  describe('className merging', () => {
    it('merges custom className', () => {
      render(
        <Card className="custom-card" data-testid="card">
          Custom
        </Card>
      );
      const card = screen.getByTestId('card');

      expect(card.className).toContain('custom-card');
      expect(card.className).toContain('rounded-xl');
    });
  });

  describe('HTML attributes', () => {
    it('passes through id attribute', () => {
      render(<Card id="my-card">ID Card</Card>);

      expect(screen.getByText('ID Card')).toHaveAttribute('id', 'my-card');
    });

    it('passes through data attributes', () => {
      render(<Card data-testid="card-test">Data Card</Card>);

      expect(screen.getByTestId('card-test')).toBeInTheDocument();
    });

    it('passes through aria attributes', () => {
      render(<Card aria-label="Main card">Aria Card</Card>);

      expect(screen.getByLabelText('Main card')).toBeInTheDocument();
    });
  });
});

describe('CardHeader', () => {
  it('renders with children', () => {
    render(<CardHeader>Header content</CardHeader>);

    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>);

    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header');
  });

  it('has grid layout classes', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>);
    const header = screen.getByTestId('header');

    expect(header.className).toContain('grid');
    expect(header.className).toContain('auto-rows-min');
  });

  it('has padding classes', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>);
    const header = screen.getByTestId('header');

    expect(header.className).toContain('px-6');
    expect(header.className).toContain('pt-6');
  });

  it('merges custom className', () => {
    render(
      <CardHeader className="custom-header" data-testid="header">
        Header
      </CardHeader>
    );
    const header = screen.getByTestId('header');

    expect(header.className).toContain('custom-header');
    expect(header.className).toContain('px-6');
  });
});

describe('CardTitle', () => {
  it('renders with children', () => {
    render(<CardTitle>Title text</CardTitle>);

    expect(screen.getByText('Title text')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);

    expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'card-title');
  });

  it('has typography classes', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    const title = screen.getByTestId('title');

    expect(title.className).toContain('font-semibold');
    expect(title.className).toContain('leading-none');
  });

  it('merges custom className', () => {
    render(
      <CardTitle className="custom-title" data-testid="title">
        Title
      </CardTitle>
    );
    const title = screen.getByTestId('title');

    expect(title.className).toContain('custom-title');
    expect(title.className).toContain('font-semibold');
  });
});

describe('CardDescription', () => {
  it('renders with children', () => {
    render(<CardDescription>Description text</CardDescription>);

    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>);

    expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'card-description');
  });

  it('has muted text styling', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>);
    const desc = screen.getByTestId('desc');

    expect(desc.className).toContain('text-muted-foreground');
    expect(desc.className).toContain('text-sm');
  });

  it('merges custom className', () => {
    render(
      <CardDescription className="custom-desc" data-testid="desc">
        Description
      </CardDescription>
    );
    const desc = screen.getByTestId('desc');

    expect(desc.className).toContain('custom-desc');
    expect(desc.className).toContain('text-muted-foreground');
  });
});

describe('CardAction', () => {
  it('renders with children', () => {
    render(<CardAction>Action button</CardAction>);

    expect(screen.getByText('Action button')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardAction data-testid="action">Action</CardAction>);

    expect(screen.getByTestId('action')).toHaveAttribute('data-slot', 'card-action');
  });

  it('has grid positioning classes', () => {
    render(<CardAction data-testid="action">Action</CardAction>);
    const action = screen.getByTestId('action');

    expect(action.className).toContain('col-start-2');
    expect(action.className).toContain('row-span-2');
    expect(action.className).toContain('row-start-1');
  });

  it('has alignment classes', () => {
    render(<CardAction data-testid="action">Action</CardAction>);
    const action = screen.getByTestId('action');

    expect(action.className).toContain('self-start');
    expect(action.className).toContain('justify-self-end');
  });

  it('merges custom className', () => {
    render(
      <CardAction className="custom-action" data-testid="action">
        Action
      </CardAction>
    );
    const action = screen.getByTestId('action');

    expect(action.className).toContain('custom-action');
    expect(action.className).toContain('col-start-2');
  });
});

describe('CardContent', () => {
  it('renders with children', () => {
    render(<CardContent>Content here</CardContent>);

    expect(screen.getByText('Content here')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardContent data-testid="content">Content</CardContent>);

    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'card-content');
  });

  it('has padding classes', () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    const content = screen.getByTestId('content');

    expect(content.className).toContain('px-6');
    expect(content.className).toContain('pb-4');
  });

  it('merges custom className', () => {
    render(
      <CardContent className="custom-content" data-testid="content">
        Content
      </CardContent>
    );
    const content = screen.getByTestId('content');

    expect(content.className).toContain('custom-content');
    expect(content.className).toContain('px-6');
  });
});

describe('CardFooter', () => {
  it('renders with children', () => {
    render(<CardFooter>Footer content</CardFooter>);

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);

    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'card-footer');
  });

  it('has flex layout', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId('footer');

    expect(footer.className).toContain('flex');
    expect(footer.className).toContain('items-center');
  });

  it('has padding classes', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId('footer');

    expect(footer.className).toContain('px-6');
    expect(footer.className).toContain('pb-6');
    expect(footer.className).toContain('pt-2');
  });

  it('merges custom className', () => {
    render(
      <CardFooter className="custom-footer" data-testid="footer">
        Footer
      </CardFooter>
    );
    const footer = screen.getByTestId('footer');

    expect(footer.className).toContain('custom-footer');
    expect(footer.className).toContain('flex');
  });
});

describe('Card composition', () => {
  it('renders complete card structure', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description here</CardDescription>
          <CardAction>
            <button>Action</button>
          </CardAction>
        </CardHeader>
        <CardContent>Main content area</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description here')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Main content area')).toBeInTheDocument();
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });

  it('supports nested components', () => {
    render(
      <Card data-testid="outer-card">
        <CardContent>
          <Card data-testid="inner-card" variant="outline">
            <CardContent>Nested card</CardContent>
          </Card>
        </CardContent>
      </Card>
    );

    expect(screen.getByTestId('outer-card')).toBeInTheDocument();
    expect(screen.getByTestId('inner-card')).toBeInTheDocument();
    expect(screen.getByText('Nested card')).toBeInTheDocument();
  });
});

describe('cardVariants', () => {
  it('exports cardVariants function', () => {
    expect(typeof cardVariants).toBe('function');
  });

  it('generates class string for default variant', () => {
    const classes = cardVariants();

    expect(classes).toContain('bg-card');
    expect(classes).toContain('shadow-sm');
  });

  it('generates class string for glass variant', () => {
    const classes = cardVariants({ variant: 'glass' });

    expect(classes).toContain('bg-card/80');
    expect(classes).toContain('backdrop-blur-xl');
  });

  it('generates class string for outline variant', () => {
    const classes = cardVariants({ variant: 'outline' });

    expect(classes).toContain('bg-transparent');
    expect(classes).toContain('border-2');
  });

  it('includes base classes in all variants', () => {
    const defaultClasses = cardVariants();
    const glassClasses = cardVariants({ variant: 'glass' });
    const outlineClasses = cardVariants({ variant: 'outline' });

    [defaultClasses, glassClasses, outlineClasses].forEach((classes) => {
      expect(classes).toContain('flex');
      expect(classes).toContain('flex-col');
      expect(classes).toContain('rounded-xl');
    });
  });
});
