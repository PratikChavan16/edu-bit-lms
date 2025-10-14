'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import { createUniversitySchema, type CreateUniversityInput } from '@bitflow/api-client/validation';
import { validateForm, handleApiError } from '@bitflow/api-client/validation';
import { toast } from '@bitflow/ui/toast';
import { Card, CardContent, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";
import { ArrowLeft, Loader2 } from 'lucide-react';

interface UniversityFormData {
  name: string;
  slug: string;
  domain: string;
  status: 'live' | 'setup' | 'suspended' | 'archived';
  timezone: string;
  storage_limit_gb: number;
}

export default function NewUniversityPage() {
  const { token } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<UniversityFormData>({
    name: '',
    slug: '',
    domain: '',
    status: 'setup',
    timezone: 'Asia/Kolkata',
    storage_limit_gb: 100,
  });
  
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? (value ? parseInt(value) : 0) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    // Validate form data
    const validation = validateForm(createUniversitySchema, formData);
    
    if (!validation.success) {
      const errors = (validation as { success: false; errors: Record<string, string[]> }).errors;
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0][0];
      toast.error('Validation Error', firstError);
      setLoading(false);
      return;
    }

    // TypeScript now knows validation.success is true
    const validatedData = validation.data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/universities`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validatedData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          // Laravel validation errors
          const firstError = Object.values(result.errors)[0] as string[];
          toast.error('Validation Error', firstError[0]);
        } else {
          toast.error('Error', result.message || 'Failed to create university');
        }
        setLoading(false);
        return;
      }

      toast.success('Success', 'University created successfully');
      
      // Redirect to the new university's detail page
      if (result.data) {
        router.push(`/universities/${result.data.id}`);
      } else {
        router.push('/universities');
      }
    } catch (err) {
      handleApiError(err, 'Failed to create university');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/universities')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Universities
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add New University</h1>
          <p className="text-muted-foreground mt-1">Create a new university in the system</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    University Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., University of Mumbai"
                    required
                    disabled={loading}
                  />
                  {fieldErrors.name && (
                    <p className="text-sm text-red-600">{fieldErrors.name[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium">
                    University Slug
                  </label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g., mumbai-university"
                    disabled={loading}
                  />
                  {fieldErrors.slug && (
                    <p className="text-sm text-red-600">{fieldErrors.slug[0]}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from name if left empty
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  >
                    <option value="setup">Setup</option>
                    <option value="live">Live</option>
                    <option value="suspended">Suspended</option>
                    <option value="archived">Archived</option>
                  </select>
                  {fieldErrors.status && (
                    <p className="text-sm text-red-600">{fieldErrors.status[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="timezone" className="text-sm font-medium">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="domain" className="text-sm font-medium">
                  Domain
                </label>
                <Input
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="e.g., myuni.bitflow.local"
                  disabled={loading}
                />
                {fieldErrors.domain && (
                  <p className="text-sm text-red-600">{fieldErrors.domain[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="storage_limit_gb" className="text-sm font-medium">
                  Storage Limit (GB)
                </label>
                <Input
                  id="storage_limit_gb"
                  name="storage_limit_gb"
                  type="number"
                  value={formData.storage_limit_gb}
                  onChange={(e) => handleChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'storage_limit_gb',
                      value: e.target.value,
                    }
                  })}
                  placeholder="e.g., 100"
                  min="1"
                  max="10000"
                  disabled={loading}
                />
                {fieldErrors.storage_limit_gb && (
                  <p className="text-sm text-red-600">{fieldErrors.storage_limit_gb[0]}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Default storage allocation for this university (1-10,000 GB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Side Information */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <p className="text-sm text-blue-900">
                    <strong>📋 What you're creating:</strong>
                  </p>
                  <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                    <li>A new university instance</li>
                    <li>Unique domain: <code className="bg-blue-100 px-1 rounded">{formData.domain || formData.slug || '[slug]'}.bitflow.local</code></li>
                    <li>Auto-generated slug from name if not provided</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <p className="text-sm text-green-900">
                  <strong>✨ Next steps:</strong> After creating the university, you can add colleges, departments, and other details from the university detail page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/universities')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create University'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
