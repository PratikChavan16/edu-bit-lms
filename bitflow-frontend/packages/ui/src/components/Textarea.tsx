'use client';

import React from 'react';
import { cn } from '../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'glass';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      resize = 'vertical',
      className,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'w-full rounded-lg border px-4 py-2.5 text-sm transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      {
        'resize-none': resize === 'none',
        'resize-y': resize === 'vertical',
        'resize-x': resize === 'horizontal',
        'resize': resize === 'both',
      }
    );

    const variants = {
      default: cn(
        baseStyles,
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
      ),
      glass: cn(
        baseStyles,
        'bg-white/10 backdrop-blur-md border-white/20',
        error
          ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20'
          : 'focus:border-white/40 focus:ring-white/10',
        'text-white placeholder:text-white/60'
      ),
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          required={required}
          className={cn(variants[variant], className)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
          }
          {...props}
        />
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${props.id}-error`} className="mt-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
