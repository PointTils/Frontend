import InterpreterCard from '@/src/components/InterpreterCard';
import { Strings } from '@/src/constants/Strings';
import { renderWithProviders } from '@/tests/config';
import { fireEvent } from '@testing-library/react-native';
import React from 'react';

describe('components/InterpreterCard', () => {
  it('shows name, specialty, and rating', () => {
    const { getByText, queryByText } = renderWithProviders(
      <InterpreterCard
        photoUrl="https://example.com/avatar.jpg"
        fullName="Maria Souza"
        specialty="Intérprete de Libras"
        rating={4.5}
        showRating
        date="20/08/2025 11:30 - 12:30"
        location="Porto Alegre - RS"
      />,
    );

    expect(getByText('Maria Souza')).toBeTruthy();
    expect(getByText('Intérprete de Libras')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
    expect(queryByText('20/08/2025 11:30 - 12:30')).toBeTruthy();
  });

  it('hides rating when showRating is false', () => {
    const { queryByText } = renderWithProviders(
      <InterpreterCard
        photoUrl="https://example.com/avatar.jpg"
        fullName="João Silva"
        specialty="Intérprete Tátil"
        rating={3.8}
        showRating={false}
        date="22/08/2025 09:00 - 10:00"
        location="São Paulo - SP"
      />,
    );

    expect(queryByText('3.8')).toBeNull();
  });

  it('prefers subtitle over specialty when both are provided', () => {
    const subtitle = 'XXX.XXX.XXX-XX';
    const specialty = 'Especialidade Única';

    const { getByText, queryByText } = renderWithProviders(
      <InterpreterCard
        photoUrl="https://example.com/avatar.jpg"
        fullName="CPF/CNPJ Card"
        subtitle={subtitle}
        specialty={specialty}
        rating={0}
        showRating={false}
        date="01/01/2026 10:00 - 11:00"
        location="Online"
      />,
    );

    expect(getByText(subtitle)).toBeTruthy();
    expect(queryByText(specialty)).toBeNull();
  });

  it('renders pending badge with default label', () => {
    const { getByText } = renderWithProviders(
      <InterpreterCard
        photoUrl="https://example.com/avatar.jpg"
        fullName="Empresa XYZ"
        subtitle="XX.XXX.XXX/0001-YY"
        pending
        date="15/02/2026 14:00 - 15:00"
        location="Porto Alegre - RS"
      />,
    );

    expect(getByText('Pendente')).toBeTruthy();
  });

  it('hides location on search variant when isOnlineOnly is true', () => {
    const { getByText, queryByText } = renderWithProviders(
      <InterpreterCard
        variant="search"
        photoUrl="https://example.com/avatar.jpg"
        fullName="Somente Online"
        specialty="Intérprete"
        rating={5}
        modality="Online"
        isOnlineOnly
        location="Deveria não aparecer"
      />,
    );

    // Shows modality label and value
    expect(getByText(Strings.common.fields.modality)).toBeTruthy();
    expect(getByText('Online')).toBeTruthy();

    // Location label and value should be hidden
    expect(queryByText(Strings.common.fields.location)).toBeNull();
    expect(queryByText('Deveria não aparecer')).toBeNull();

    // Also ensure appointment-specific 'Data' label is not shown in search
    expect(queryByText(Strings.common.fields.date)).toBeNull();
  });

  it('calls onPress when the card is pressed', () => {
    const onPress = jest.fn();

    const { getByText } = renderWithProviders(
      <InterpreterCard
        photoUrl="https://example.com/avatar.jpg"
        fullName="Press Target"
        specialty="Intérprete"
        rating={4}
        showRating
        date="01/03/2026 09:00 - 10:00"
        location="Florianópolis - SC"
        onPress={onPress}
      />,
    );

    // Press on a child text; event should trigger the enclosing Pressable
    fireEvent.press(getByText('Press Target'));
    expect(onPress).toHaveBeenCalled();
  });
});
