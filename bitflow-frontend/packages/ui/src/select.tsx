'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  className = '',
  error,
  label,
  required = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search query
  const filteredOptions = searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected option(s)
  const selectedOptions = multiple
    ? options.filter((opt) => (value as string[])?.includes(opt.value))
    : options.find((opt) => opt.value === value);

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = (value as string[]) || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '');
  };

  // Get display text
  const getDisplayText = () => {
    if (multiple && Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      return selectedOptions.map((opt) => opt.label).join(', ');
    }
    if (!multiple && selectedOptions && !Array.isArray(selectedOptions)) {
      return selectedOptions.label;
    }
    return placeholder;
  };

  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : Boolean(value);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div ref={containerRef} className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            flex w-full items-center justify-between rounded-md border px-3 py-2
            text-left text-sm transition-colors
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white hover:border-gray-400'}
            ${isOpen ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
          `}
        >
          <span className={hasValue ? 'text-gray-900' : 'text-gray-500'}>
            {getDisplayText()}
          </span>
          <div className="flex items-center gap-1">
            {clearable && hasValue && !disabled && (
              <X
                className="h-4 w-4 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
              />
            )}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
            {searchable && (
              <div className="border-b border-gray-200 p-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple
                    ? (value as string[])?.includes(option.value)
                    : value === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      disabled={option.disabled}
                      className={`
                        flex w-full items-center justify-between px-3 py-2 text-left text-sm
                        transition-colors
                        ${option.disabled ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'}
                        ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                      `}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
