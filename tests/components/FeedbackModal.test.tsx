import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import FeedbackModal from '@/src/components/FeedbackModal';
import { Strings } from '@/src/constants/Strings';
import { renderWithProviders } from '../utils';

const mockPost = jest.fn();

jest.mock('@/src/hooks/useApi', () => ({
  useApiPost: () => ({
    post: mockPost,
    loading: false,
  }),
}));

const { Toast } = jest.requireMock('toastify-react-native');

type FeedbackModalProps = React.ComponentProps<typeof FeedbackModal>;

describe('components/FeedbackModal', () => {
  const renderComponent = (props: Partial<FeedbackModalProps> = ({} = {})) =>
    renderWithProviders(
      <FeedbackModal
        visible
        onClose={props.onClose ?? jest.fn()}
        appointmentId="appointment-123"
        interpreterName="Ana"
        {...props}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockPost.mockResolvedValue({ success: true });
  });

  it('renders interpreter name and placeholder', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    expect(getByText('Ana')).toBeTruthy();
    expect(
      getByPlaceholderText(Strings.feedbackModal.placeholder),
    ).toBeTruthy();
  });

  it('shows warning toast when submitting without rating', () => {
    const { getByTestId } = renderComponent();

    fireEvent.press(getByTestId('feedback-submit'));

    expect(mockPost).not.toHaveBeenCalled();
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        text1: Strings.feedbackModal.toast.noRatingTitle,
      }),
    );
  });

  it('submits rating successfully and closes modal', async () => {
    const onClose = jest.fn();
    const { getByTestId, getByPlaceholderText, getByText } = renderComponent({
      onClose,
    });

    fireEvent.press(getByTestId('feedback-star-2'));

    fireEvent.changeText(
      getByPlaceholderText(Strings.feedbackModal.placeholder),
      ' Great experience ',
    );

    fireEvent.press(getByText(Strings.feedbackModal.submitButton));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith({
        appointment_id: 'appointment-123',
        description: 'Great experience',
        stars: 2,
      });
      expect(onClose).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          text1: Strings.feedbackModal.toast.successTitle,
        }),
      );
    });
  });

  it('handles submission error without closing modal', async () => {
    const { Toast } = require('toastify-react-native');
    mockPost.mockResolvedValueOnce({ success: false, message: 'error' });

    const onClose = jest.fn();
    const { getByTestId, getByText } = renderComponent({ onClose });

    fireEvent.press(getByTestId('feedback-star-3'));
    fireEvent.press(getByText(Strings.feedbackModal.submitButton));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          text1: Strings.feedbackModal.toast.errorTitle,
        }),
      );
    });
  });
});
