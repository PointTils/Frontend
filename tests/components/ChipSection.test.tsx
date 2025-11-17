import React from 'react';
import { render } from '@testing-library/react-native';

import ChipsSection from '@/src/components/ChipSection';

describe('components/ChipSection', () => {
  it('returns null when no items are provided', () => {
    const { toJSON } = render(<ChipsSection />);
    expect(toJSON()).toBeNull();
  });

  it('renders a chip for each item', () => {
    const items = ['First', 'Second', 'Third'];
    const { getAllByText } = render(<ChipsSection items={items} />);
    expect(getAllByText(/First|Second|Third/)).toHaveLength(items.length);
  });
});
