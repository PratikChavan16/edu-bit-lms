'use client';

import React from 'react';
import { cn } from '../lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  helperText?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  helperText,
  required,
  disabled,
  orientation = 'vertical',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: {
      radio: 'w-4 h-4',
      label: 'text-sm',
      helper: 'text-xs',
    },
    md: {
      radio: 'w-5 h-5',
      label: 'text-base',
      helper: 'text-sm',
    },
    lg: {
      radio: 'w-6 h-6',
      label: 'text-lg',
      helper: 'text-base',
    },
  };

  const handleChange = (optionValue: string) => {
    if (onChange && !disabled) {
      onChange(optionValue);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
        role="radiogroup"
        aria-label={label}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${name}-error` : helperText ? `${name}-helper` : undefined
        }
      >
        {options.map((option) => {
          const isChecked = value === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <label
              key={option.value}
              className={cn(
                'flex items-start gap-3 cursor-pointer',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={() => handleChange(option.value)}
                disabled={isDisabled}
                className={cn(
                  'mt-0.5 border-gray-300 text-blue-600',
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  sizeClasses[size].radio
                )}
              />
              <div className="flex-1">
                <span
                  className={cn(
                    'font-medium text-gray-900',
                    sizeClasses[size].label
                  )}
                >
                  {option.label}
                </span>
                {option.helperText && (
                  <p
                    className={cn(
                      'text-gray-500 mt-0.5',
                      sizeClasses[size].helper
                    )}
                  >
                    {option.helperText}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
      {helperText && !error && (
        <p id={`${name}-helper`} className="mt-2 text-xs text-gray-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';
