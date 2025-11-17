import React from 'react';

import InterpreterReviewCard from '@/src/components/InterpreterReviewCard';
import { formatDate } from '@/src/utils/masks';
import { getSafeAvatarUri } from '@/src/utils/helpers';
import { renderWithProviders } from '../utils';

const mockReact = jest.requireActual<typeof import('react')>('react');
const mockReactNative =
  jest.requireActual<typeof import('react-native')>('react-native');

jest.mock('@/src/components/Rating', () => {
  return {
    __esModule: true,
    default: ({ rating }: { rating: number }) =>
      mockReact.createElement(mockReactNative.Text, null, `Rating: ${rating}`),
  };
});
jest.mock('@/src/components/ui/avatar', () => {
  return {
    Avatar: ({ children }: { children: React.ReactNode }) =>
      mockReact.createElement(mockReactNative.View, null, children),
    AvatarImage: ({ source }: { source: { uri: string | null } }) =>
      mockReact.createElement(
        mockReactNative.Text,
        null,
        `avatar:${source?.uri ?? ''}`,
      ),
  };
});
jest.mock('@/src/utils/masks', () => ({
  formatDate: jest.fn(),
}));
jest.mock('@/src/utils/helpers', () => ({
  getSafeAvatarUri: jest.fn(),
}));

const formatDateMock = formatDate as jest.MockedFunction<typeof formatDate>;
const mockGetSafeAvatarUri = getSafeAvatarUri as jest.MockedFunction<
  typeof getSafeAvatarUri
>;

describe('components/InterpreterReviewCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user details, rating, formatted date, and review text', () => {
    formatDateMock.mockReturnValue('10/02/2024');
    mockGetSafeAvatarUri.mockReturnValue('mock-avatar');

    const { getByText } = renderWithProviders(
      <InterpreterReviewCard
        userName="John Doe"
        userPhoto="photo-url"
        rating={4.5}
        reviewDate="2024-02-10"
        reviewText="Great experience"
      />,
    );

    expect(mockGetSafeAvatarUri).toHaveBeenCalledWith({
      remoteUrl: 'photo-url',
    });
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Rating: 4.5')).toBeTruthy();
    expect(getByText('10/02/2024')).toBeTruthy();
    expect(getByText('Great experience')).toBeTruthy();
    expect(getByText('avatar:mock-avatar')).toBeTruthy();
  });

  it('handles missing review text without rendering undefined', () => {
    formatDateMock.mockReturnValue('11/02/2024');
    mockGetSafeAvatarUri.mockReturnValue('avatar-fallback');

    const { queryByText } = renderWithProviders(
      <InterpreterReviewCard
        userName="Jane Roe"
        userPhoto={null}
        rating={5}
        reviewDate="2024-02-11"
      />,
    );

    expect(queryByText('undefined')).toBeNull();
    expect(mockGetSafeAvatarUri).toHaveBeenCalledWith({
      remoteUrl: null,
    });
  });
});
