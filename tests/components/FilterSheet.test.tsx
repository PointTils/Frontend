import FilterSheet from '@/src/components/FilterSheet';
import { Strings } from '@/src/constants/Strings';
import { Modality } from '@/src/types/api';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Toast } from 'toastify-react-native';

// ---- Mocks de componentes internos ----
jest.mock('@/src/components/ModalMultipleSelection', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  
  function MockModalMultipleSelection({ selectedValues, onSelectionChange }: any) {
    return (
      <View>
        <Text
          testID="multiple-selection"
          onPress={() => onSelectionChange(['Libras'])}
        >
          {selectedValues.join(', ')}
        </Text>
      </View>
    );
  }
  
  return MockModalMultipleSelection;
});

jest.mock('@/src/components/ModalSingleSelection', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  
  function MockModalSingleSelection({ selectedValue, onSelectionChange }: any) {
    return (
      <View>
        <Text
          testID="single-selection"
          onPress={() => onSelectionChange('female')}
        >
          {selectedValue}
        </Text>
      </View>
    );
  }
  
  return MockModalSingleSelection;
});

jest.mock('@/src/components/ui/button', () => {
  const { TouchableOpacity } = require('react-native');
  const React = require('react');
  
  function Button({ children, onPress }: any) {
  return <TouchableOpacity testID="button" onPress={onPress}>
      {children}
    </TouchableOpacity>
}
  
  return { Button };
});

jest.mock('@/src/components/HapticTab', () => {
  const { TouchableOpacity } = require('react-native');
  const React = require('react');
  
  function MockHapticTab({ children, onPress }: any) {
    return (
      <TouchableOpacity testID="haptic-tab" onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }
  
  return MockHapticTab;
});

jest.mock('@/src/utils/masks', () => ({
  formatDateTime: jest.fn((date) => date.toISOString()),
}));

// ---- Mock do DateTimePicker ----
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  const React = require('react');
  
  function MockDateTimePicker({ onChange }: any) {
    React.useEffect(() => {
      // Simula a mudança de data após o componente montar
      const timer = setTimeout(() => {
        onChange({}, new Date('2025-12-10T10:00:00'));
      }, 0);
      return () => clearTimeout(timer);
    }, [onChange]);

    return <View testID="date-time-picker" />;
  }
  
  return MockDateTimePicker;
});

// ---- Mock do hook useApiGet ----
jest.mock('@/src/hooks/useApi', () => ({
  useApiGet: jest.fn(() => ({
    data: null,
    error: false,
  })),
}));

// ---- Mocks router e toast ----
const mockRouterPush = jest.spyOn(router, 'push').mockImplementation(jest.fn());
jest.spyOn(Toast, 'show').mockImplementation(jest.fn());

jest.useFakeTimers();

describe('FilterSheet', () => {
  const mockOnApply = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnClear = jest.fn();

  const defaultProps = {
    onApply: mockOnApply,
    onClose: mockOnClose,
    onClear: mockOnClear,
    filter: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente', () => {
    render(<FilterSheet {...defaultProps} />);
    expect(screen.getByText(Strings.common.fields.modality)).toBeTruthy();
    expect(screen.getByText(Strings.common.buttons.search)).toBeTruthy();
    expect(screen.getByText(Strings.common.buttons.clean)).toBeTruthy();
  });

  // it('fecha o modal ao tocar na sombra', () => {
  //   render(<FilterSheet {...defaultProps} />);
  //   const overlay = screen.getByTestId('filter-sheet-overlay');
  //   fireEvent.press(overlay);
  //   expect(mockOnClose).toHaveBeenCalled();
  // });

  it('aplica filtros ao clicar no botão aplicar', () => {
    render(<FilterSheet {...defaultProps} />);
    fireEvent.press(screen.getByTestId('button'));
    expect(mockOnApply).toHaveBeenCalled();
  });

  it('limpa filtros ao clicar no botão limpar', () => {
    render(<FilterSheet {...defaultProps} />);
    fireEvent.press(screen.getByTestId('haptic-tab'));
    expect(mockOnApply).toHaveBeenCalledWith({});
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('permite selecionar especialidades', () => {
    render(<FilterSheet {...defaultProps} />);
    fireEvent.press(screen.getByTestId('multiple-selection'));
  });

  it('permite selecionar gênero', () => {
    render(<FilterSheet {...defaultProps} />);
    fireEvent.press(screen.getByTestId('single-selection'));
  });

  it('exibe campos de localização se modalidade incluir PERSONALLY', () => {
    render(
      <FilterSheet
        {...defaultProps}
        filter={{ modality: Modality.PERSONALLY }}
      />,
    );
    expect(screen.getByText(Strings.common.fields.location)).toBeTruthy();
  });

  // it('altera estado de data corretamente', () => {
  //   render(<FilterSheet {...defaultProps} />);
  //   const dateInput = screen.getByPlaceholderText('DD/MM/AAAA HH:mm');
    
  //   act(() => {
  //     fireEvent.press(dateInput);
  //   });
    
  //   // Avança os timers para garantir que o useEffect seja executado
  //   jest.runAllTimers();
    
  //   expect(dateInput.props.value).not.toBe('');
  // });

  it('chama router e toast em erro de API', () => {
    // Simula erro de API
    const { useApiGet } = require('@/src/hooks/useApi');
    useApiGet.mockReturnValue({ data: null, error: true });

    render(<FilterSheet {...defaultProps} />);
    expect(mockRouterPush).toHaveBeenCalledWith('/');
    expect(Toast.show).toHaveBeenCalled();
  });
});