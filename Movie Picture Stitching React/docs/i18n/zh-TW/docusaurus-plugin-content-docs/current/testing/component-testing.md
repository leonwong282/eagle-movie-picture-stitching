# 元件測試

元件測試驗證 React 元件能正確渲染並回應使用者互動。Eagle React Template 使用 **@testing-library/react** 進行以使用者為中心的測試。

## 設定

### 自訂 Render 函式

模板提供一個自訂 render 函式，將元件包裝在必要的 providers 中：

```typescript title="src/test/test-utils.tsx"
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { ToastProvider } from '@/components';
import i18n from '@/lib/i18n';

// 建立測試 i18n 實例
const testI18n = i18n.cloneInstance();
testI18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: {} },
  },
});

interface WrapperProps {
  children: React.ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  return (
    <I18nextProvider i18n={testI18n}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </I18nextProvider>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// 重新匯出所有內容
export * from '@testing-library/react';
export { customRender as render };
```

### 使用自訂 Render

```typescript
// 使用自訂 render 而非 @testing-library/react
import { render, screen, fireEvent } from '@/test/test-utils';
import { MyComponent } from '@/components';

describe('MyComponent', () => {
  it('renders with providers', () => {
    render(<MyComponent />);
    // 元件可存取 i18n、toast 等
  });
});
```

## 測試 UI 元件

### Button 元件

```typescript title="src/components/ui/Button.test.tsx"
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { Button } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('applies default variant styles', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('variants', () => {
    it.each([
      ['default', 'bg-primary'],
      ['destructive', 'bg-destructive'],
      ['outline', 'border'],
      ['secondary', 'bg-secondary'],
      ['ghost', 'hover:bg-accent'],
      ['link', 'text-primary'],
    ])('renders %s variant with correct styles', (variant, expectedClass) => {
      render(<Button variant={variant as any}>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass(expectedClass);
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-8');
    });

    it('renders default size', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-12');
    });

    it('renders icon size', () => {
      render(<Button size="icon">🔍</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10');
    });
  });

  describe('states', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick} disabled>Click</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick} isLoading>Click</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('as child', () => {
    it('renders as anchor when asChild with Link', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveTextContent('Link Button');
    });
  });
});
```

### Card 元件

```typescript title="src/components/ui/Card.test.tsx"
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';

describe('Card', () => {
  it('renders with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
        <CardContent>Content here</CardContent>
        <CardFooter>Footer text</CardFooter>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Content here')).toBeInTheDocument();
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('applies glass variant', () => {
    render(<Card variant="glass" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('backdrop-blur');
  });

  it('forwards ref to root element', () => {
    const ref = { current: null };
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
```

## 測試表單元件

### Input 元件

```typescript title="src/components/ui/Input.test.tsx"
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { Input } from './Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(onChange).toHaveBeenCalled();
  });

  it('supports controlled value', () => {
    const { rerender } = render(<Input value="initial" readOnly />);
    expect(screen.getByRole('textbox')).toHaveValue('initial');
    
    rerender(<Input value="updated" readOnly />);
    expect(screen.getByRole('textbox')).toHaveValue('updated');
  });

  it('shows error state', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
```

### Select 元件

```typescript title="src/components/ui/Select.test.tsx"
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './Select';

describe('Select', () => {
  const renderSelect = (props = {}) => {
    return render(
      <Select {...props}>
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    );
  };

  it('renders with placeholder', () => {
    renderSelect();
    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    renderSelect();
    
    fireEvent.click(screen.getByRole('combobox'));
    
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('selects option on click', async () => {
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });
    
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByText('Option 2'));
    
    expect(onValueChange).toHaveBeenCalledWith('option2');
  });

  it('displays selected value', () => {
    renderSelect({ value: 'option1' });
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('disables trigger when disabled', () => {
    renderSelect({ disabled: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
```

### Checkbox 元件

```typescript title="src/components/ui/Checkbox.test.tsx"
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders checked when checked prop is true', () => {
    render(<Checkbox checked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onCheckedChange when clicked', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles between states', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    
    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it('supports indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });

  it('is disabled when disabled prop is true', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={onCheckedChange} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
```

## 測試覆蓋層元件

### Dialog 元件

```typescript title="src/components/ui/Dialog.test.tsx"
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './Dialog';
import { Button } from './Button';

describe('Dialog', () => {
  const renderDialog = (props = {}) => {
    return render(
      <Dialog {...props}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description text</DialogDescription>
          </DialogHeader>
          <div>Dialog body content</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  it('does not render content initially', () => {
    renderDialog();
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', async () => {
    renderDialog();
    
    fireEvent.click(screen.getByText('Open Dialog'));
    
    expect(await screen.findByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog description text')).toBeInTheDocument();
  });

  it('closes dialog when close button is clicked', async () => {
    renderDialog();
    
    fireEvent.click(screen.getByText('Open Dialog'));
    await screen.findByText('Dialog Title');
    
    fireEvent.click(screen.getByText('Cancel'));
    
    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });
  });

  it('closes dialog when clicking overlay', async () => {
    renderDialog();
    
    fireEvent.click(screen.getByText('Open Dialog'));
    await screen.findByText('Dialog Title');
    
    // 點擊覆蓋層（背景）
    fireEvent.click(screen.getByRole('dialog').parentElement!);
    
    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });
  });

  it('closes dialog on Escape key', async () => {
    renderDialog();
    
    fireEvent.click(screen.getByText('Open Dialog'));
    await screen.findByText('Dialog Title');
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });
  });

  it('calls onOpenChange when state changes', async () => {
    const onOpenChange = vi.fn();
    renderDialog({ onOpenChange });
    
    fireEvent.click(screen.getByText('Open Dialog'));
    
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('supports controlled open state', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Controlled Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
  });
});
```

### Toast 元件

```typescript title="src/components/ui/Toast.test.tsx"
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@/test/test-utils';
import { ToastProvider, useToast, toast } from './Toast';

function ToastTrigger() {
  const { addToast } = useToast();
  
  return (
    <div>
      <button onClick={() => addToast(toast.success('Success!'))}>
        Show Success
      </button>
      <button onClick={() => addToast(toast.error('Error!', 'Details'))}>
        Show Error
      </button>
    </div>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderToasts = () => {
    return render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );
  };

  it('shows success toast', async () => {
    renderToasts();
    
    fireEvent.click(screen.getByText('Show Success'));
    
    expect(await screen.findByText('Success!')).toBeInTheDocument();
  });

  it('shows error toast with description', async () => {
    renderToasts();
    
    fireEvent.click(screen.getByText('Show Error'));
    
    expect(await screen.findByText('Error!')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('auto-dismisses after duration', async () => {
    renderToasts();
    
    fireEvent.click(screen.getByText('Show Success'));
    expect(await screen.findByText('Success!')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(4000); // 預設持續時間
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Success!')).not.toBeInTheDocument();
    });
  });

  it('can show multiple toasts', async () => {
    renderToasts();
    
    fireEvent.click(screen.getByText('Show Success'));
    fireEvent.click(screen.getByText('Show Error'));
    
    expect(await screen.findByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });
});
```

## 使用 User Events 測試

對於更真實的互動，使用 `@testing-library/user-event`：

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { Form } from './Form';

describe('Form', () => {
  it('submits form with user input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<Form onSubmit={onSubmit} />);
    
    // 在輸入欄位中輸入
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    
    // 選擇選項
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Option 1'));
    
    // 勾選核取方塊
    await user.click(screen.getByLabelText('Accept terms'));
    
    // 提交表單
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      option: 'option1',
      acceptTerms: true,
    });
  });
});
```

## 無障礙測試

### 使用 jest-axe

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 測試鍵盤導航

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { Menu } from './Menu';

describe('Menu Keyboard Navigation', () => {
  it('supports arrow key navigation', () => {
    render(<Menu items={['Item 1', 'Item 2', 'Item 3']} />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(screen.getByText('Item 1')).toHaveFocus();
    
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(screen.getByText('Item 2')).toHaveFocus();
    
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    expect(screen.getByText('Item 1')).toHaveFocus();
  });

  it('closes on Escape', () => {
    render(<Menu items={['Item 1']} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
```

## 最佳實踐

### 1. 查詢優先順序

依此優先順序使用查詢：

```typescript
// 1. 無障礙查詢（優先）
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email address');

// 2. 語意查詢
screen.getByText('Welcome');
screen.getByTitle('Close');

// 3. Test ID（最後手段）
screen.getByTestId('custom-element');
```

### 2. 避免實作細節

```typescript
// ❌ 不好：測試實作
expect(component.state.isOpen).toBe(true);
expect(wrapper.find('.dropdown-menu').length).toBe(1);

// ✅ 好：測試行為
expect(screen.getByRole('menu')).toBeVisible();
```

### 3. 對非同步使用 findBy

```typescript
// ❌ 不好：可能導致不穩定的測試
fireEvent.click(button);
expect(screen.getByText('Loaded')).toBeInTheDocument();

// ✅ 好：等待非同步更新
fireEvent.click(button);
expect(await screen.findByText('Loaded')).toBeInTheDocument();
```

## 相關資源

- [測試概觀](./overview.md) - 測試設定
- [Hook 測試](./hook-testing.md) - 測試自訂 hooks
- [E2E 測試](./e2e-testing.md) - 端對端測試
