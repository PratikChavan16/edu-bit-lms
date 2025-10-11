'use client';

import React, { useState } from 'react';

// Types
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'bordered';
  className?: string;
  fullWidth?: boolean;
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
  className = '',
  fullWidth = false,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  // Variant styles
  const variantStyles = {
    underline: {
      container: 'border-b border-gray-200',
      tab: (isActive: boolean, disabled?: boolean) => `
        px-4 py-3 font-medium text-sm transition-all
        ${
          disabled
            ? 'text-gray-400 cursor-not-allowed'
            : isActive
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
        }
      `,
    },
    pills: {
      container: 'bg-gray-100 rounded-lg p-1',
      tab: (isActive: boolean, disabled?: boolean) => `
        px-4 py-2 font-medium text-sm rounded-md transition-all
        ${
          disabled
            ? 'text-gray-400 cursor-not-allowed'
            : isActive
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }
      `,
    },
    bordered: {
      container: 'border border-gray-200 rounded-lg overflow-hidden',
      tab: (isActive: boolean, disabled?: boolean) => `
        px-4 py-3 font-medium text-sm border-r border-gray-200 last:border-r-0 transition-all
        ${
          disabled
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50'
        }
      `,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div
        className={`flex ${fullWidth ? '' : 'inline-flex'} ${currentVariant.container}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              disabled={tab.disabled}
              className={`
                ${currentVariant.tab(isActive, tab.disabled)}
                ${fullWidth ? 'flex-1' : ''}
                ${tab.disabled ? '' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{activeTabContent}</div>
    </div>
  );
}
