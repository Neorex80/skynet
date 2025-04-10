import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { ValidationError } from '../utils/errors';

/**
 * Form field configuration interface
 */
interface FormField<T> {
  name: keyof T;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validations?: Array<{
    validator: (value: any, formData?: T) => boolean;
    message: string;
  }>;
}

/**
 * UseForm hook return type
 */
export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
}

/**
 * Custom hook for form handling with validation
 * 
 * @param initialValues Initial form values
 * @param fields Form fields configuration with validation rules
 * @param onSubmit Form submission handler
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  fields: FormField<T>[],
  onSubmit: (values: T) => void | Promise<void>
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback((field: keyof T): boolean => {
    const fieldConfig = fields.find(f => f.name === field);
    
    if (!fieldConfig) return true;
    
    const value = values[field];
    
    // Check required fields
    if (fieldConfig.required && (value === undefined || value === null || value === '')) {
      setErrors(prev => ({ ...prev, [field]: `${fieldConfig.label} is required` }));
      return false;
    }
    
    // Check custom validations
    if (fieldConfig.validations) {
      for (const validation of fieldConfig.validations) {
        if (!validation.validator(value, values)) {
          setErrors(prev => ({ ...prev, [field]: validation.message }));
          return false;
        }
      }
    }
    
    // Clear errors if validation passes
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    
    return true;
  }, [fields, values]);

  /**
   * Validate all form fields
   */
  const validateForm = useCallback((): boolean => {
    const fieldKeys = fields.map(field => field.name);
    const validationResults = fieldKeys.map(field => validateField(field));
    
    return validationResults.every(Boolean);
  }, [fields, validateField]);

  /**
   * Handle form field changes
   */
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    const parsedValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked
      : type === 'number' 
        ? value === '' ? '' : Number(value)
        : value;
    
    setValues(prev => ({ ...prev, [name]: parsedValue }));
    
    // If field was previously touched, validate on change
    if (touched[name as keyof T]) {
      validateField(name as keyof T);
    }
  }, [touched, validateField]);

  /**
   * Handle field blur events
   */
  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof T);
  }, [validateField]);

  /**
   * Set a field value programmatically
   */
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // If field was previously touched, validate on change
    if (touched[field]) {
      validateField(field);
    }
  }, [touched, validateField]);

  /**
   * Set a field error programmatically
   */
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  /**
   * Reset the form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    
    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    
    setTouched(allTouched);
    
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      // Handle validation errors from the server
      if (error instanceof ValidationError && error.errors) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        
        // Map server validation errors to form fields
        Object.entries(error.errors).forEach(([field, message]) => {
          newErrors[field as keyof T] = message;
        });
        
        setErrors(prev => ({ ...prev, ...newErrors }));
      } else {
        // Re-throw other errors
        throw error;
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [fields, onSubmit, validateForm, values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid: Object.keys(errors).length === 0,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    resetForm,
    handleSubmit,
    validateField,
    validateForm,
  };
}

export default useForm;