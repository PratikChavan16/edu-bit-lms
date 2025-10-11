import * as React from "react";
import { cn } from "../lib/utils";

// Note: These are simple HTML select wrappers
// For more complex dropdowns, consider using a library like Radix UI

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

// These are placeholder exports for compatibility
// They're not used with native HTML select, but exported to avoid import errors
export const SelectTrigger = Select;
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectItem = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => (
  <option value={value} className={className}>{children}</option>
);
export const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <option value="" disabled>{placeholder}</option>
);

export { Select };
