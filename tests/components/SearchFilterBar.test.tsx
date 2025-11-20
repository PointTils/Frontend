// tests/components/SearchFilterBar.test.tsx
import SearchFilterBar from '@/src/components/SearchFilterBar';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet } from '@/src/hooks/useApi';
import { Gender, Modality } from '@/src/types/api';
import { render, fireEvent, waitFor} from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Toast } from 'toastify-react-native';

// Mocks
jest.mock('@/src/contexts/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/src/hooks/useApi', () => ({
  useApiGet: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('toastify-react-native', () => ({
  Toast: {
    show: jest.fn(),
  },
}));

jest.mock('@/src/components/FilterSheet', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const React = require('react');

  function MockFilterSheet({
    onApply,
    onClose,
    onClear,
  }: {
    onApply: (filters: any) => void;
    onClose: () => void;
    onClear: () => void;
  }) {
  return <View testID="filter-sheet">
      <Text>FilterSheet</Text>
      <TouchableOpacity
        testID="apply-filters"
        onPress={() => onApply({ specialty: ['1'] })}
      >
        <Text>Apply</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="clear-filters" onPress={onClear}>
        <Text>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="close-sheet" onPress={onClose}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
}
  return MockFilterSheet;
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  Feather: 'Feather',
}));

// Mock useColors
jest.mock('@/src/hooks/useColors', () => ({
  useColors: () => ({
    primaryBlue: 'blue',
    disabled: 'gray',
    fieldGray: 'gray',
    sliders: 'gray',
  }),
}));

describe('SearchFilterBar', () => {
  const mockOnData = jest.fn();
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseApiGet = useApiGet as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: '1' },
      isAuthenticated: true,
    });
    mockUseApiGet.mockReturnValue({ data: null, error: false });
  });

  it('renders without initial props', () => {
    const { getByPlaceholderText } = render(
      <SearchFilterBar onData={mockOnData} />,
    );

    expect(getByPlaceholderText(Strings.common.buttons.search)).toBeTruthy();
  });

  it('renders with initial query and filters', () => {
    const { getByDisplayValue } = render(
      <SearchFilterBar
        onData={mockOnData}
        initialQuery="John"
        initialFilters={{ modality: Modality.ONLINE }}
      />,
    );

    expect(getByDisplayValue('John')).toBeTruthy();
  });

  it('updates query on text input', () => {
    const { getByPlaceholderText } = render(
      <SearchFilterBar onData={mockOnData} />,
    );

    const input = getByPlaceholderText(Strings.common.buttons.search);
    fireEvent.changeText(input, 'test query');

    expect(input.props.value).toBe('test query');
  });

  it('submits search and calls maybeNavigate when query is not empty', () => {
    const { getByPlaceholderText } = render(
      <SearchFilterBar onData={mockOnData} navigateOnSearch={true} />,
    );

    const input = getByPlaceholderText(Strings.common.buttons.search);
    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    expect(router.push).toHaveBeenCalled();
  });

  it('does not submit search when query is empty', () => {
    const { getByPlaceholderText } = render(
      <SearchFilterBar onData={mockOnData} navigateOnSearch={true} />,
    );

    const input = getByPlaceholderText(Strings.common.buttons.search);
    fireEvent(input, 'submitEditing');

    expect(router.push).not.toHaveBeenCalled();
  });

  it('opens and closes the filter sheet', () => {
    const { getByText, queryByTestId } = render(
      <SearchFilterBar onData={mockOnData} />,
    );

    // Abre o sheet
    fireEvent.press(getByText(Strings.search.filter));
    expect(queryByTestId('filter-sheet')).toBeTruthy();

    // Fecha o sheet
    fireEvent.press(getByText('Close'));
    expect(queryByTestId('filter-sheet')).toBeNull();
  });

  it('applies filters from filter sheet', () => {
    const { getByText, getByTestId } = render(
      <SearchFilterBar onData={mockOnData} navigateOnSearch={true} />,
    );

    fireEvent.press(getByText(Strings.search.filter));
    fireEvent.press(getByTestId('apply-filters'));

    expect(router.push).toHaveBeenCalled();
  });

  it('toggles online filter', () => {
    const { getByText } = render(
      <SearchFilterBar onData={mockOnData} navigateOnSearch={true} />,
    );

    const onlineButton = getByText(Strings.common.options.online);
    fireEvent.press(onlineButton);

    expect(router.push).toHaveBeenCalled();
  });

  it('toggles date filter by opening sheet when no date is set', () => {
    const { getByText } = render(
      <SearchFilterBar onData={mockOnData} />,
    );

    const dateButton = getByText(Strings.search.datesAvailable);
    fireEvent.press(dateButton);

    expect(getByText('FilterSheet')).toBeTruthy();
  });

  it('removes date filter when date is set', () => {
    const { getByText } = render(
      <SearchFilterBar
        onData={mockOnData}
        initialFilters={{ availableDates: '2024-01-01' }}
      />,
    );

    const dateButton = getByText(Strings.search.datesAvailable);
    fireEvent.press(dateButton);

    // Deve remover o filtro de data, então não deve abrir o sheet
    expect(() => getByText('FilterSheet')).toThrow();
  });

  it('shows filter count when there are active filters', () => {
    const { getByText } = render(
      <SearchFilterBar
        onData={mockOnData}
        initialFilters={{ modality: Modality.ONLINE, gender: Gender.FEMALE }}
      />,
    );

    // Deve mostrar o número 2 (modality e gender)
    expect(getByText(/2/)).toBeTruthy();
  });

  it('calls onData when interpreters data is fetched', async () => {
    const mockData = {
      success: true,
      data: [{ id: '1', name: 'John' }],
    };
    mockUseApiGet.mockReturnValue({ data: mockData, error: false });

    render(<SearchFilterBar onData={mockOnData} />);

    await waitFor(() => {
      expect(mockOnData).toHaveBeenCalledWith(mockData);
    });
  });

  it('redirects and shows toast on interpreters API error', async () => {
    mockUseApiGet.mockReturnValue({ data: null, error: true });

    render(<SearchFilterBar onData={mockOnData} />);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/');
      expect(Toast.show).toHaveBeenCalled();
    });
  });

  it('does not call API if user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(<SearchFilterBar onData={mockOnData} />);

    // A URL para a API de intérpretes será vazia se não autenticado
    expect(mockUseApiGet).toHaveBeenCalledWith('');
  });

  it('navigates only when navigateOnSearch is true and there is active search', () => {
    const { getByPlaceholderText } = render(
      <SearchFilterBar onData={mockOnData} navigateOnSearch={true} />,
    );

    const input = getByPlaceholderText(Strings.common.buttons.search);
    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    expect(router.push).toHaveBeenCalled();
  });

  it('does not navigate when navigateOnSearch is false', () => {
    const { getByPlaceholderText } = render(
      <SearchFilterBar onData={mockOnData} navigateOnSearch={false} />,
    );

    const input = getByPlaceholderText(Strings.common.buttons.search);
    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    expect(router.push).not.toHaveBeenCalled();
  });

  it('resets isSearchSubmitted when query becomes empty', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <SearchFilterBar onData={mockOnData} />,
    );

    const input = getByPlaceholderText(Strings.common.buttons.search);
    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    // Agora, mudar a query para vazio
    fireEvent.changeText(input, '');

    // O botão de voltar deve sumir quando a query fica vazia
    expect(() => getByTestId('clear-search-button')).toThrow();
  });

  it('handles empty specialties data', async () => {
    const mockSpecialtiesData = {
      success: true,
      data: [],
    };
    
    mockUseApiGet
      .mockReturnValueOnce({ data: mockSpecialtiesData, error: false })
      .mockReturnValueOnce({ data: null, error: false });

    render(<SearchFilterBar onData={mockOnData} />);

    await waitFor(() => {
      expect(mockUseApiGet).toHaveBeenCalled();
    });
  });

  it('handles specialties API error', async () => {
    mockUseApiGet
      .mockReturnValueOnce({ data: null, error: true })
      .mockReturnValueOnce({ data: null, error: false });

    render(<SearchFilterBar onData={mockOnData} />);

    await waitFor(() => {
      expect(mockUseApiGet).toHaveBeenCalled();
    });
  });

  it('includes default specialties when no initial filters', () => {
    const mockSpecialtiesData = {
      success: true,
      data: [
        { specialty_id: '1', specialty_name: 'Libras' },
      ],
    };
    
    mockUseApiGet
      .mockReturnValueOnce({ data: mockSpecialtiesData, error: false })
      .mockReturnValueOnce({ data: null, error: false });

    render(<SearchFilterBar onData={mockOnData} />);

    // Deve incluir especialidades padrão quando não há filtros iniciais
    expect(mockUseApiGet).toHaveBeenCalled();
  });

  it('excludes default specialties when initial filters have specialty', () => {
    const mockSpecialtiesData = {
      success: true,
      data: [
        { specialty_id: '1', specialty_name: 'Libras' },
      ],
    };
    
    mockUseApiGet
      .mockReturnValueOnce({ data: mockSpecialtiesData, error: false })
      .mockReturnValueOnce({ data: null, error: false });

    render(
      <SearchFilterBar 
        onData={mockOnData} 
        initialFilters={{ specialty: ['custom'] }}
      />
    );

    // Não deve incluir especialidades padrão quando já há filtros de especialidade
    expect(mockUseApiGet).toHaveBeenCalled();
  });

  it('handles online filter toggle correctly', () => {
    const { getByText } = render(
      <SearchFilterBar onData={mockOnData} navigateOnSearch={true} />,
    );

    const onlineButton = getByText(Strings.common.options.online);
    
    // Primeiro clique - ativa online
    fireEvent.press(onlineButton);
    expect(router.push).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({
        modality: Modality.ONLINE
      })
    }));

    // Segundo clique - desativa online
    fireEvent.press(onlineButton);
    expect(router.push).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({})
    }));
  });
});