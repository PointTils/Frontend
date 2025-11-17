import React from 'react';
import { Text } from 'react-native';

import InfoRow from '@/src/components/InfoRow';
import { renderWithProviders } from '../utils';

describe('components/InfoRow', () => {
  it('returns null when no value and onlyLabel is false', () => {
    const { toJSON } = renderWithProviders(<InfoRow label="Email" />);
    expect(toJSON()).toBeNull();
  });

  it('renders label and value when provided', () => {
    const { getByText } = renderWithProviders(
      <InfoRow label="Email" value="user@mail.com" />,
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('user@mail.com')).toBeTruthy();
  });

  it('renders label and icon when onlyLabel is true', () => {
    const { getByText, getByTestId, queryByText } = renderWithProviders(
      <InfoRow label="Phone" onlyLabel icon={<Text testID="icon">☎️</Text>} />,
    );

    expect(getByText('Phone')).toBeTruthy();
    expect(getByTestId('icon')).toBeTruthy();
    expect(queryByText('undefined')).toBeNull();
  });

  it('applies border wrapper and custom value color', () => {
    const { getByText, toJSON } = renderWithProviders(
      <InfoRow
        label="Status"
        value="Active"
        valueColor="text-typography-600"
        border
      />,
    );

    const valueNode = getByText('Active');
    expect(valueNode.props.className).toContain('text-typography-600');

    const tree = toJSON();
    expect(tree).not.toBeNull();
    const serializedTree = JSON.stringify(tree);
    expect(serializedTree).toContain('border');
  });
});
