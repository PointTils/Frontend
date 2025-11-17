import React from 'react';

import StarRating from '@/src/components/Rating';
import { renderWithProviders } from '../utils';

// Override icon mock
jest.mock('lucide-react-native', () => ({
  StarIcon: jest.fn(() => null),
}));
const StarIconMock = require('lucide-react-native').StarIcon as jest.Mock;

describe('components/Rating', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default stars and rating text', () => {
    const { getByText, toJSON } = renderWithProviders(
      <StarRating rating={3} />,
    );

    expect(getByText('3')).toBeTruthy();
    expect(StarIconMock).toHaveBeenCalledTimes(10);

    const calls = StarIconMock.mock.calls;
    const baseCalls = calls.slice(0, 5);
    const overlayCalls = calls.slice(5);

    baseCalls.forEach(([props]: [Record<string, unknown>]) => {
      expect(props.stroke).toBe('#999999');
      expect(props.fill).toBe('none');
      expect(props.width).toBe(24);
    });

    overlayCalls.forEach(([props]: [Record<string, unknown>]) => {
      expect(props.stroke).toBe('#007bff');
      expect(props.fill).toBe('#007bff');
    });

    expect(JSON.stringify(toJSON())).toContain('"width":72');

    const ratingText = getByText('3');
    expect(ratingText.props.className).toContain('text-md');
  });

  it('uses custom color and adjusts text size for small stars', () => {
    const { getByText, toJSON } = renderWithProviders(
      <StarRating rating={4.5} size={12} color="#ff00aa" />,
    );

    const calls = StarIconMock.mock.calls;
    const overlayCalls = calls.slice(5);

    overlayCalls.forEach(([props]: [Record<string, unknown>]) => {
      expect(props.stroke).toBe('#ff00aa');
      expect(props.fill).toBe('#ff00aa');
      expect(props.width).toBe(12);
    });

    expect(JSON.stringify(toJSON())).toContain('"width":54');

    const ratingText = getByText('4.5');
    expect(ratingText.props.className).toContain('text-sm');
  });
});
