import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import ModalBannerHome from '../../src/components/ModalBannerHome';
import { renderWithProviders } from '../utils';

jest.mock('../../src/assets/svgs/BannerHome', () => 'BannerHomeMock');

describe('components/ModalBannerHome', () => {
  const defaultProps = {
    backgroundColor: '#123456',
    title: 'Complete your profile',
  };

  it('renders the provided title', () => {
    const { getByText } = renderWithProviders(
      <ModalBannerHome {...defaultProps} />,
    );

    expect(getByText(defaultProps.title)).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithProviders(
      <ModalBannerHome {...defaultProps} onPress={onPress} />,
    );

    fireEvent.press(getByTestId('banner-home-button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
