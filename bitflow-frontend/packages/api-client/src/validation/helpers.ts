import { z } from 'zod';
import { toast } from '@bitflow/ui/toast';

/**
 * Validates form data against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with data or errors
 */
export function validateForm<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // Convert Zod errors to field-level errors
  const errors: Record<string, string[]> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });
  
  return { success: false, errors };
}

/**
 * Handles API errors and displays appropriate toasts
 * @param error - Error object from API
 * @param defaultMessage - Default message if no specific error message
 */
export function handleApiError(error: any, defaultMessage = 'An error occurred') {
  if (error.response?.data?.message) {
    toast.error('Error', error.response.data.message);
  } else if (error.response?.data?.errors) {
    // Laravel validation errors
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0] as string[];
    toast.error('Validation Error', firstError[0]);
  } else if (error.message) {
    toast.error('Error', error.message);
  } else {
    toast.error('Error', defaultMessage);
  }
}

/**
 * Displays validation errors as toast notifications
 * @param errors - Field-level validation errors
 */
export function displayValidationErrors(errors: Record<string, string[]>) {
  const firstField = Object.keys(errors)[0];
  const firstError = errors[firstField][0];
  toast.error('Validation Error', firstError);
}

/**
 * Higher-order function to wrap form submit handlers with validation and error handling
 * @param schema - Zod schema to validate against
 * @param onSubmit - Submit handler function
 * @returns Wrapped submit handler
 */
export function withValidation<T extends z.ZodType>(
  schema: T,
  onSubmit: (data: z.infer<T>) => Promise<void> | void
) {
  return async (data: unknown) => {
    const result = validateForm(schema, data);
    
    if (!result.success) {
      displayValidationErrors((result as { success: false; errors: Record<string, string[]> }).errors);
      return { success: false, errors: (result as { success: false; errors: Record<string, string[]> }).errors };
    }
    
    try {
      await onSubmit(result.data);
      return { success: true };
    } catch (error) {
      handleApiError(error);
      return { success: false, error };
    }
  };
}
