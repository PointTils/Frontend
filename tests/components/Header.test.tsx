import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import Header from '@/src/components/Header';
import { renderWithProviders } from '../utils';

describe('components/Header', () => {
  it('renders uppercase title', () => {
    const { getByText } = renderWithProviders(<Header title="Home" />);
    expect(getByText('HOME')).toBeTruthy();
  });

  it('renders back button when requested and handles press', () => {
    const handleBack = jest.fn();
    const { getByTestId } = renderWithProviders(
      <Header title="Home" showBackButton handleBack={handleBack} />,
    );

    fireEvent.press(getByTestId('back-button'));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('does not render back button when not requested', () => {
    const { queryByTestId } = renderWithProviders(<Header title="Home" />);
    expect(queryByTestId('back-button')).toBeNull();
  });
});
