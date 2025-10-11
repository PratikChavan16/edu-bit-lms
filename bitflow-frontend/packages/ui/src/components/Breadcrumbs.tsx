'use client';

import React from 'react';

// Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
  onNavigate?: (href: string) => void;
}

export function Breadcrumbs({
  items,
  separator,
  maxItems,
  className = '',
  onNavigate,
}: BreadcrumbsProps) {
  // Default separator
  const defaultSeparator = (
    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const separatorElement = separator || defaultSeparator;

  // Handle collapse if maxItems is set
  let displayItems = items;
  if (maxItems && items.length > maxItems) {
    const firstItems = items.slice(0, 1);
    const lastItems = items.slice(-(maxItems - 2));
    displayItems = [
      ...firstItems,
      { label: '...', icon: undefined, href: undefined },
      ...lastItems,
    ];
  }

  const handleClick = (e: React.MouseEvent, item: BreadcrumbItem) => {
    if (item.href && onNavigate) {
      e.preventDefault();
      onNavigate(item.href);
    }
  };

  return (
    <nav className={`flex items-center ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={index} className="flex items-center gap-2">
              {/* Breadcrumb Item */}
              {isEllipsis ? (
                <span className="text-gray-400 font-medium">...</span>
              ) : item.href && !isLast ? (
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.icon && <span className="text-gray-500">{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span
                  className={`flex items-center gap-2 text-sm font-medium ${
                    isLast ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {item.icon && <span className="text-gray-500">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}

              {/* Separator */}
              {!isLast && <span className="flex-shrink-0">{separatorElement}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
