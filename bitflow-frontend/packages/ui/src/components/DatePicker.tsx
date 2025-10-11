'use client';

import React, { useState } from 'react';
import { Button } from './Button';

// Types
export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  format?: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date',
  disabled = false,
  className = '',
  format = 'dd/mm/yyyy',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return placeholder;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'mm/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-mm-dd':
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };

  // Get days in month
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if date is same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Handle date selection
  const handleDateClick = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateDisabled(selectedDate)) return;

    onChange?.(selectedDate);
    setIsOpen(false);
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Navigate years
  const goToPreviousYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth()));
  };

  const goToNextYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth()));
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onChange?.(today);
    setIsOpen(false);
  };

  // Clear selection
  const clearDate = () => {
    onChange?.(null);
    setIsOpen(false);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  return (
    <div className={`relative ${className}`}>
      {/* Input */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2 text-left border rounded-lg transition-all
          ${disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }
          ${value ? 'text-gray-900' : 'text-gray-500'}
        `}
      >
        <div className="flex items-center justify-between">
          <span>{formatDate(value || null)}</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </button>

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Calendar */}
          <div className="absolute z-20 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousYear}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="text-sm font-semibold text-gray-900">
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>

              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={goToNextYear}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSelected = value && isSameDay(date, value);
                const isToday = isSameDay(date, today);
                const isDisabled = isDateDisabled(date);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    disabled={isDisabled}
                    className={`
                      aspect-square rounded-lg text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isToday
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        : isDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Button variant="secondary" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="secondary" size="sm" onClick={clearDate}>
                Clear
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
