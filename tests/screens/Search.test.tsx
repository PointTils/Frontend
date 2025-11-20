import SearchScreen from '@/app/interpreters/search';
import { render, screen, act } from '@testing-library/react-native';
import { useLocalSearchParams, router } from 'expo-router';
import React from 'react';

// ---- Mock utils ----
jest.mock('@/src/utils/masks', () => ({
  formatDateToISO: jest.fn((date: string) => date),
  mapModality: jest.fn((modality: string) => (modality === 'online' ? 'Online' : modality)),
}));

// ---- Mock expo-router ----
jest.mock('expo-router', () => {
  const original = jest.requireActual('expo-router');
  return {
    ...original,
    useLocalSearchParams: jest.fn(),
    router: {
      back: jest.fn(),
      push: jest.fn(),
    },
  };
});

// ---- Mock Header ----
jest.mock('@/src/components/Header', () => {
  const { Text } = require('react-native');
  const React = require('react');
  function MockHeader({ handleBack }: any) {
    return <Text testID="header-back" onPress={handleBack} />;
  }
  MockHeader.displayName = 'MockHeader';
  return MockHeader;
});

// ---- Mock InterpreterCard ----
jest.mock('@/src/components/InterpreterCard', () => {
  const { Text } = require('react-native');
  const React = require('react');
  function MockInterpreterCard({ fullName, onPress }: any) {
    return <Text testID={`interpreter-${fullName}`} onPress={onPress} />;
  }
  MockInterpreterCard.displayName = 'MockInterpreterCard';
  return MockInterpreterCard;
});

// ---- Mock SearchFilterBar ----
jest.mock('@/src/components/SearchFilterBar', () => {
  const { Text } = require('react-native');
  const React = require('react');

  let response: any = { data: [] };
  const setResponse = (newResponse: any) => {
    response = newResponse;
  };

  function MockSearchFilterBar({ onData }: any) {
    return (
      <Text
        testID="filter-bar"
        onPress={() => {
          onData(response);
        }}
      />
    );
  }

  MockSearchFilterBar.displayName = 'MockSearchFilterBar';
  MockSearchFilterBar.setResponse = setResponse;

  return MockSearchFilterBar;
});

// ---- Helpers ----
jest.useFakeTimers();

describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      name: 'Ana',
      specialty: 'Libras,Guia',
      gender: 'female',
      city: 'Curitiba',
      uf: 'PR',
      modality: 'online',
      date: '2025-12-10',
    });
  });

  it('renderiza a tela inicial corretamente', () => {
    render(<SearchScreen />);
    expect(screen.getByTestId('filter-bar')).toBeTruthy();
    expect(screen.getByTestId('header-back')).toBeTruthy();
  });

  it('aciona router.back ao clicar no botão de voltar', () => {
    render(<SearchScreen />);
    screen.getByTestId('header-back').props.onPress();
    expect(router.back).toHaveBeenCalled();
  });

  it('mostra "Nenhum resultado encontrado" quando não há dados', async () => {
    const SearchFilterBar: any = require('@/src/components/SearchFilterBar');
    SearchFilterBar.setResponse({ data: [] });

    render(<SearchScreen />);

    // Simula clique para carregar dados
    act(() => {
      screen.getByTestId('filter-bar').props.onPress();
      jest.runAllTimers();
    });

    expect(await screen.findByText('Nenhum resultado encontrado')).toBeTruthy();
  });

  it('mostra loading e depois exibe resultados', async () => {
    const SearchFilterBar: any = require('@/src/components/SearchFilterBar');
    SearchFilterBar.setResponse({
      data: [
        {
          id: '123',
          name: 'John Doe',
          picture: 'https://example.com/img.jpg',
          specialties: [{ name: 'Libras' }],
          professional_data: { rating: 4.5, modality: 'online' },
          locations: [{ city: 'São Paulo', uf: 'SP' }],
        },
      ],
    });

    render(<SearchScreen />);

    // Simula clique para carregar dados
    act(() => {
      screen.getByTestId('filter-bar').props.onPress();
    });

    // Loading aparece
    expect(screen.getByText('Carregando')).toBeTruthy();

    // Executa timers do setTimeout interno
    act(() => {
      jest.runAllTimers();
    });

    // Verifica se o card foi renderizado
    expect(await screen.findByTestId('interpreter-John Doe')).toBeTruthy();
  });

  it('navega corretamente ao clicar em um card', async () => {
    const SearchFilterBar: any = require('@/src/components/SearchFilterBar');
    SearchFilterBar.setResponse({
      data: [
        {
          id: '123',
          name: 'John Doe',
          picture: 'https://example.com/img.jpg',
          specialties: [{ name: 'Libras' }],
          professional_data: { rating: 4.5, modality: 'online' },
          locations: [{ city: 'São Paulo', uf: 'SP' }],
        },
      ],
    });

    render(<SearchScreen />);

    act(() => {
      screen.getByTestId('filter-bar').props.onPress();
      jest.runAllTimers();
    });

    act(() => {
      screen.getByTestId('interpreter-John Doe').props.onPress();
    });

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/interpreters/[id]',
      params: { id: '123' },
    });
  });
});
