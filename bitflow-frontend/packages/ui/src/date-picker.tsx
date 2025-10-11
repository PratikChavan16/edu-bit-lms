'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className = '',
  error,
  label,
  required = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Get calendar days for current view
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      onChange?.(date);
      setIsOpen(false);
    }
  };

  // Navigate to previous month
  const handlePreviousMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
    );
  };

  const calendarDays = getCalendarDays();
  const today = new Date();

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
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value ? formatDate(value) : placeholder}
          </span>
          <Calendar className="h-4 w-4 text-gray-400" />
        </button>

        {/* Calendar Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-80 rounded-md border border-gray-300 bg-white p-4 shadow-lg">
            {/* Month/Year Navigation */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="rounded p-1 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-semibold">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="rounded p-1 hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} />;
                }

                const isSelected = value && isSameDay(date, value);
                const isToday = isSameDay(date, today);
                const isDisabled = isDateDisabled(date);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    disabled={isDisabled}
                    className={`
                      rounded p-2 text-sm transition-colors
                      ${isDisabled ? 'cursor-not-allowed text-gray-300' : 'hover:bg-gray-100'}
                      ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                      ${isToday && !isSelected ? 'border border-blue-500 font-semibold' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Today Button */}
            <div className="mt-4 border-t border-gray-200 pt-2">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="w-full rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
