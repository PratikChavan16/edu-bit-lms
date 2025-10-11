'use client';

import React from 'react';

export interface ProgressCircleProps {
  value: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressCircle({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6', // blue-500
  backgroundColor = '#e5e7eb', // gray-200
  showLabel = true,
  label,
  className = '',
}: ProgressCircleProps) {
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Center label */}
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(clampedValue)}%
            </span>
          </div>
        )}
      </div>
      {/* Optional text label */}
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
}

export interface ProgressCircleGroupProps {
  items: Array<{
    value: number;
    label: string;
    color?: string;
  }>;
  size?: number;
  className?: string;
}

export function ProgressCircleGroup({
  items,
  size = 100,
  className = '',
}: ProgressCircleGroupProps) {
  return (
    <div className={`flex flex-wrap gap-6 ${className}`}>
      {items.map((item, index) => (
        <ProgressCircle
          key={index}
          value={item.value}
          label={item.label}
          color={item.color}
          size={size}
        />
      ))}
    </div>
  );
}
