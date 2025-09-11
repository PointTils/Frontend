import { useState, useCallback } from 'react';

type ValidationRule<T> = (value: T) => string | null;

type FormField<T> = {
  value: T;
  error: string;
  validate: ValidationRule<T>;
};

type FormFields = Record<string, FormField<any>>;

/**
 * Custom hook for form validation with real-time error handling
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { fields, setValue, validateForm, clearErrors } = useFormValidation({
 *   email: {
 *     value: '',
 *     error: '',
 *     validate: (value: string) => {
 *       if (!value.trim()) return 'Email is required';
 *       if (!validateEmail(value)) return 'Invalid email';
 *       return null;
 *     },
 *   },
 * });
 *
 * // In your component JSX
 * <InputField
 *   value={fields.email.value}
 *   onChangeText={(text) => setValue('email', text)}
 *   placeholder="email@example.com"
 * />
 * {fields.email.error && (
 *   <Text className="text-red-600">
 *     {fields.email.error}
 *   </Text>
 * )}
 *
 * // Form submission
 * const handleSubmit = () => {
 *   if (validateForm()) {
 *     // All fields are valid, proceed with submission
 *     const formData = {
 *       email: fields.email.value,
 *     };
 *     // Submit form...
 *   }
 * };
 * ```
 */
export function useFormValidation<T extends FormFields>(initialFields: T) {
  const [fields, setFields] = useState(initialFields);

  const setValue = useCallback(
    <K extends keyof T>(fieldName: K, value: T[K]['value']) => {
      setFields((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          value,
          error: prev[fieldName].error ? '' : prev[fieldName].error,
        },
      }));
    },
    [],
  );

  const validateField = useCallback(
    <K extends keyof T>(fieldName: K): boolean => {
      const field = fields[fieldName];
      const error = field.validate(field.value);

      if (error) {
        setFields((prev) => ({
          ...prev,
          [fieldName]: { ...prev[fieldName], error },
        }));
        return false;
      }

      return true;
    },
    [fields],
  );

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const updatedFields = { ...fields } as T;

    (Object.keys(fields) as (keyof T)[]).forEach((fieldName) => {
      const field = fields[fieldName];
      const error = field.validate(field.value);

      if (error) {
        updatedFields[fieldName] = { ...field, error } as T[keyof T];
        isValid = false;
      }
    });

    setFields(updatedFields);
    return isValid;
  }, [fields]);

  const clearErrors = useCallback(() => {
    setFields((prev) => {
      const clearedFields = { ...prev } as T;
      (Object.keys(clearedFields) as (keyof T)[]).forEach((fieldName) => {
        clearedFields[fieldName] = {
          ...clearedFields[fieldName],
          error: '',
        } as T[keyof T];
      });
      return clearedFields;
    });
  }, []);

  return {
    fields,
    setValue,
    validateField,
    validateForm,
    clearErrors,
  };
}
