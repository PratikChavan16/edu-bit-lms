/**
 * Card Component
 * 
 * Glassmorphic card component matching the design
 * Creates frosted glass effect with backdrop blur
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl transition-all duration-300',
          {
            // Glass variant (matches login design)
            'bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl':
              variant === 'glass',

            // Default variant
            'bg-white border border-gray-200 shadow-sm': variant === 'default',

            // Padding variants
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-8': padding === 'md',
            'p-12': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
