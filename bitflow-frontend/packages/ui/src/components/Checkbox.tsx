'use client';

import React from 'react';
import { cn } from '../lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      indeterminate = false,
      size = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              'rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-colors cursor-pointer',
              sizeClasses[size],
              {
                'border-red-500 focus:ring-red-500': error,
                'opacity-50 cursor-not-allowed': disabled,
              },
              className
            )}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
            }
            {...props}
          />
        </div>

        {(label || helperText || error) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  'font-medium text-gray-900',
                  labelSizeClasses[size],
                  {
                    'text-gray-400 cursor-not-allowed': disabled,
                    'cursor-pointer': !disabled,
                  }
                )}
              >
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {helperText && !error && (
              <p id={`${props.id}-helper`} className="text-sm text-gray-500 mt-0.5">
                {helperText}
              </p>
            )}
            {error && (
              <p id={`${props.id}-error`} className="text-sm text-red-500 mt-0.5">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
