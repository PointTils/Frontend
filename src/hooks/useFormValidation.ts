import { useState, useCallback } from 'react';

type ValidationRule<T, C = undefined> = (
  value: T,
  context?: C,
) => string | null;

export type FormField<T, C = undefined> = {
  value: T;
  error: string;
  validate: ValidationRule<T, C>;
};

export type FormFields<C = undefined> = Record<string, FormField<any, C>>;

/**
 * Custom hook for form validation with optional context
 *
 * @example
 * ```tsx
 * // Sem contexto
 * const { fields, setValue, validateForm } = useFormValidation({
 *   email: {
 *     value: '',
 *     error: '',
 *     validate: (value) => {
 *       if (!value.trim()) return 'Email is required';
 *       if (!validateEmail(value)) return 'Invalid email';
 *       return null;
 *     },
 *   },
 * });
 *
 * // Com contexto
 * const { fields, setValue, validateForm } = useFormValidation<
     FormFields<{ type: string }>, // cada campo sabe que pode receber ctx
     { type: string }              // o tipo do contexto
   >({
 *   cnpj: {
 *     value: '',
 *     error: '',
 *     validate: (value, ctx?: { type: string }) => {
 *       if (ctx?.type !== 'enterprise') return null;
 *       if (!value.trim()) return 'CNPJ obrigatório';
 *       if (!validateCnpj(value)) return 'CNPJ inválido';
 *       return null;
 *     },
 *   },
 * });
 *
 * // Submissão com contexto
 * const isValid = validateForm({ type: 'enterprise' });
 * ```
 */

export function useFormValidation<T extends FormFields<C>, C = undefined>(
  initialFields: T,
) {
  // Removed JSON.parse/stringify to preserve functions like 'validate'
  const [fields, setFields] = useState<T>(initialFields);

  const setValue = useCallback(
    <K extends keyof T>(fieldName: K, value: T[K]['value']) => {
      setFields((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          value,
          // Clears error on value change; remove if not desired
          error: prev[fieldName].error ? '' : prev[fieldName].error,
        },
      }));
    },
    [],
  );

  const validateField = useCallback(
    <K extends keyof T>(fieldName: K, context?: C): boolean => {
      const field = fields[fieldName];
      const error = field.validate(field.value, context);

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

  const validateForm = useCallback(
    (context?: C): boolean => {
      let isValid = true;
      const updatedFields = { ...fields } as T;

      (Object.keys(fields) as (keyof T)[]).forEach((fieldName) => {
        const field = fields[fieldName];
        const error = field.validate(field.value, context);

        if (error) {
          updatedFields[fieldName] = { ...field, error } as T[keyof T];
          isValid = false;
        }
      });

      setFields(updatedFields);
      return isValid;
    },
    [fields],
  );

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
