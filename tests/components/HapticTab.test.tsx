import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import HapticTab from '@/src/components/HapticTab';
import { getHapticTab, renderWithProviders } from '../utils';

describe('HapticTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers haptic feedback and forwards onPressIn', () => {
    const handlePressIn = jest.fn();
    const { getByTestId } = renderWithProviders(
      <HapticTab testID="tab" onPressIn={handlePressIn}>
        <Text>Tab</Text>
      </HapticTab>,
    );

    fireEvent(getByTestId('tab'), 'pressIn');

    expect(getHapticTab()).toHaveBeenCalledWith('Light');
    expect(handlePressIn).toHaveBeenCalledTimes(1);
  });

  it('triggers haptic feedback without onPressIn handler', () => {
    const { getByTestId } = renderWithProviders(
      <HapticTab testID="tab">
        <Text>Tab</Text>
      </HapticTab>,
    );

    fireEvent(getByTestId('tab'), 'pressIn');

    expect(getHapticTab()).toHaveBeenCalledWith('Light');
  });
});
