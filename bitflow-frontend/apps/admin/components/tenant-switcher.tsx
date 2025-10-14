'use client';

import { useEffect } from 'react';
import { Button } from '@bitflow/ui/button';
import { Building2, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@bitflow/ui/cn';
import { useTenantStore } from '@bitflow/api-client/tenant/useTenant';
import { useAuthStore } from '@bitflow/api-client/auth/useAuth';

interface TenantSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TenantSwitcher({
  open,
  onOpenChange,
}: TenantSwitcherProps) {
  const { token } = useAuthStore();
  const { 
    currentTenant, 
    availableTenants, 
    isLoading,
    setCurrentTenant, 
    fetchTenants 
  } = useTenantStore();

  // Fetch tenants when dialog opens
  useEffect(() => {
    if (open && token && availableTenants.length === 0) {
      fetchTenants(token);
    }
  }, [open, token]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Switch University Context</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-2 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a university to manage. Your view will be filtered to show only data for the selected institution.
          </p>
        </div>

        {/* University List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading universities...</span>
            </div>
          ) : availableTenants.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No universities found</p>
            </div>
          ) : (
            availableTenants.map((university) => (
              <button
                key={university.id}
                onClick={() => {
                  setCurrentTenant(university);
                  onOpenChange(false);
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted',
                  currentTenant?.id === university.id && 'border-primary bg-primary/5'
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{university.name}</p>
                  <p className="text-sm text-muted-foreground">{university.slug}</p>
                </div>
                {currentTenant?.id === university.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
                {university.status !== 'live' && (
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    {university.status}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
