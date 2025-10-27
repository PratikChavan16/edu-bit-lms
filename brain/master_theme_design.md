# Bitflow LMS - Master Theme & Design System

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Status**: Production Ready

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Icon System](#icon-system)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Dark Mode](#dark-mode)
9. [Accessibility](#accessibility)
10. [TailwindCSS Configuration](#tailwindcss-configuration)

---

## Design Philosophy

### Core Principles

1. **Clarity Over Cleverness**: Every UI element should have a clear purpose
2. **Consistency**: Use the same patterns across all 14 portals
3. **Accessibility First**: WCAG 2.1 AA compliance minimum
4. **Performance**: CSS bundle < 50KB gzipped
5. **Mobile-First**: Design for smallest screen, enhance upward

### Design Goals

- **Professional**: Suitable for educational institutions
- **Modern**: Clean, contemporary aesthetic
- **Trustworthy**: Convey reliability and security
- **Efficient**: Minimize cognitive load
- **Inclusive**: Work for users with diverse abilities

---

## Color System

### Primary Colors

```css
/* Blue - Primary Brand Color */
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;  /* Main */
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;
--color-primary-950: #172554;
```

### Neutral Colors

```css
/* Slate - Text and Backgrounds */
--color-neutral-50: #f8fafc;
--color-neutral-100: #f1f5f9;
--color-neutral-200: #e2e8f0;
--color-neutral-300: #cbd5e1;
--color-neutral-400: #94a3b8;
--color-neutral-500: #64748b;
--color-neutral-600: #475569;
--color-neutral-700: #334155;
--color-neutral-800: #1e293b;
--color-neutral-900: #0f172a;
--color-neutral-950: #020617;
```

### Semantic Colors

```css
/* Success - Green */
--color-success-50: #f0fdf4;
--color-success-500: #22c55e;
--color-success-700: #15803d;

/* Warning - Amber */
--color-warning-50: #fffbeb;
--color-warning-500: #f59e0b;
--color-warning-700: #b45309;

/* Error - Red */
--color-error-50: #fef2f2;
--color-error-500: #ef4444;
--color-error-700: #b91c1c;

/* Info - Cyan */
--color-info-50: #ecfeff;
--color-info-500: #06b6d4;
--color-info-700: #0e7490;
```

### Usage Guidelines

| Use Case | Color | Example |
|----------|-------|---------|
| Primary Actions | `primary-600` | Submit buttons, active states |
| Secondary Actions | `neutral-600` | Cancel buttons, secondary CTAs |
| Success Messages | `success-600` | Form success, completed tasks |
| Error Messages | `error-600` | Validation errors, failed actions |
| Warning Alerts | `warning-600` | Pending approvals, low stock |
| Info Notices | `info-600` | Helpful tips, non-critical info |
| Text Primary | `neutral-900` | Headings, body text |
| Text Secondary | `neutral-600` | Captions, metadata |
| Borders | `neutral-200` | Dividers, input borders |
| Backgrounds | `neutral-50` | Page backgrounds |

---

## Typography

### Font Families

```css
/* Primary: Inter (Google Fonts) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace: JetBrains Mono (for code) */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Headings: Same as primary for consistency */
--font-headings: var(--font-sans);
```

### Type Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights

```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Typography Examples

```html
<!-- Heading 1 -->
<h1 class="text-4xl font-bold text-neutral-900 leading-tight">
  Dashboard Overview
</h1>

<!-- Heading 2 -->
<h2 class="text-3xl font-semibold text-neutral-800 leading-snug">
  Recent Activity
</h2>

<!-- Body Text -->
<p class="text-base font-normal text-neutral-700 leading-relaxed">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</p>

<!-- Caption -->
<span class="text-sm text-neutral-600">
  Last updated: 2 hours ago
</span>

<!-- Label -->
<label class="text-sm font-medium text-neutral-700">
  Email Address
</label>
```

---

## Spacing & Layout

### Spacing Scale (8px base)

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

### Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Pill shape */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
```

---

## Component Library

### Button Component

```typescript
// TypeScript Interface
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}
```

```tsx
// React Component
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  children
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner className="mr-2" />}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
```

### Input Component

```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required,
  disabled,
  value,
  onChange
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-all',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error ? 'border-error-500' : 'border-neutral-300',
            disabled && 'bg-neutral-100 cursor-not-allowed'
          )}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-600">{helperText}</p>
      )}
    </div>
  );
};
```

### Card Component

```tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  footer,
  className
}) => {
  return (
    <div className={cn('bg-white rounded-xl shadow-md border border-neutral-200', className)}>
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
            {subtitle && <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};
```

### DataTable Component

```tsx
interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading,
  onSort,
  onRowClick
}: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-semibold text-neutral-700"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8">
                <Spinner size="lg" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-neutral-600">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-neutral-200 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-neutral-50'
                )}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-neutral-900">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
```

### Modal Component

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn('relative bg-white rounded-xl shadow-xl w-full', sizes[size])}>
        {title && (
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## Icon System

**Library**: [Lucide React](https://lucide.dev/) (v0.294.0)

```bash
pnpm add lucide-react
```

### Common Icons

```tsx
import {
  Home, Users, Book, Calendar, FileText,
  Bell, Settings, LogOut, Search, Filter,
  Plus, Edit, Trash2, Eye, Download,
  Check, X, AlertCircle, Info, ChevronDown
} from 'lucide-react';
```

### Icon Usage

```tsx
// Default size (24px)
<Home />

// Custom size
<Users className="w-5 h-5" />

// With color
<Bell className="w-6 h-6 text-primary-600" />

// In button
<button className="flex items-center gap-2">
  <Plus className="w-4 h-4" />
  Add Student
</button>
```

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## Dark Mode

```css
/* Dark mode color overrides */
.dark {
  --color-bg-primary: var(--color-neutral-900);
  --color-bg-secondary: var(--color-neutral-800);
  --color-text-primary: var(--color-neutral-50);
  --color-text-secondary: var(--color-neutral-400);
  --color-border: var(--color-neutral-700);
}
```

---

## Accessibility

- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: All interactive elements have visible focus rings
- **ARIA Labels**: All icons and buttons have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Semantic HTML and ARIA attributes

---

## TailwindCSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { /* Blue scale */ },
        neutral: { /* Slate scale */ },
        success: { /* Green scale */ },
        warning: { /* Amber scale */ },
        error: { /* Red scale */ },
        info: { /* Cyan scale */ }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
```
