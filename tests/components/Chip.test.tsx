import React from 'react';
import { render } from '@testing-library/react-native';

import Chip from '@/src/components/Chip';

describe('components/Chip', () => {
  it('renders provided text', () => {
    const { getByText } = render(<Chip text="Example Chip" />);
    expect(getByText('Example Chip')).toBeTruthy();
  });
});
