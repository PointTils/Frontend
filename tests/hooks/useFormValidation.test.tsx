import { act, renderHook } from '@testing-library/react-native';

import { FormField, useFormValidation } from '@/src/hooks/useFormValidation';

type EnterpriseContext = { type: string };

describe('hooks/useFormValidation', () => {
  it('updates value and clears previous error when setValue is called', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        name: {
          value: '',
          error: 'Required',
          validate: (value: string) => (value ? null : 'Required'),
        },
      }),
    );

    act(() => {
      result.current.setValue('name', 'John');
    });

    expect(result.current.fields.name.value).toBe('John');
    expect(result.current.fields.name.error).toBe('');
  });

  it('validateField stores error when rule fails', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        email: {
          value: '',
          error: '',
          validate: (value: string) => (value ? null : 'Email required'),
        },
      }),
    );

    let isValid = true;
    act(() => {
      isValid = result.current.validateField('email');
    });

    expect(isValid).toBe(false);
    expect(result.current.fields.email.error).toBe('Email required');
  });

  it('validateForm returns true when all fields are valid', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        email: {
          value: 'user@pointtils.com',
          error: '',
          validate: (value: string) => (value ? null : 'Email required'),
        },
        password: {
          value: 'secret123',
          error: '',
          validate: (value: string) =>
            value.length >= 8 ? null : 'Password too short',
        },
      }),
    );

    let isValid = false;
    act(() => {
      isValid = result.current.validateForm();
    });

    expect(isValid).toBe(true);
    expect(result.current.fields.email.error).toBe('');
    expect(result.current.fields.password.error).toBe('');
  });

  it('uses context inside validateForm when provided', () => {
    const initialFields: {
      cnpj: FormField<string, EnterpriseContext>;
    } = {
      cnpj: {
        value: '',
        error: '',
        validate: (value: string, ctx?: EnterpriseContext) => {
          if (ctx?.type !== 'enterprise') return null;
          return value ? null : 'CNPJ obrigatório';
        },
      },
    };

    const { result } = renderHook(() =>
      useFormValidation<typeof initialFields, EnterpriseContext>(initialFields),
    );

    let isValid = true;
    act(() => {
      isValid = result.current.validateForm({ type: 'enterprise' });
    });

    expect(isValid).toBe(false);
    expect(result.current.fields.cnpj.error).toBe('CNPJ obrigatório');

    act(() => {
      result.current.setValue('cnpj', '12345678901234');
    });

    act(() => {
      isValid = result.current.validateForm({ type: 'enterprise' });
    });

    expect(isValid).toBe(true);
    expect(result.current.fields.cnpj.error).toBe('');
  });

  it('clearErrors removes all error messages', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        email: {
          value: '',
          error: '',
          validate: (value: string) => (value ? null : 'Email required'),
        },
        password: {
          value: '',
          error: '',
          validate: (value: string) =>
            value.length >= 8 ? null : 'Password too short',
        },
      }),
    );

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.fields.email.error).toBe('Email required');
    expect(result.current.fields.password.error).toBe('Password too short');

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.fields.email.error).toBe('');
    expect(result.current.fields.password.error).toBe('');
  });
});
