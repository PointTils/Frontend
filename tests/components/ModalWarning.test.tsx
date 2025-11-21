import { fireEvent } from '@testing-library/react-native';
import React from 'react';

import ModalWarning from '../../src/components/ModalWarning';
import { renderWithProviders } from '../utils';

describe('components/ModalWarning', () => {
  const defaultProps = {
    visible: true,
    title: 'Quase lá!',
    text:
      'Recebemos seu cadastro como intérprete. Nossa equipe fará a validação dos dados e, após aprovação, você poderá acessar sua conta.',
    buttonTitle: 'Entendi',
  };

  it('renders the provided title and text when visible', () => {
    const { getByText } = renderWithProviders(
      <ModalWarning
        visible={defaultProps.visible}
        onClose={() => {}}
        title={defaultProps.title}
        text={defaultProps.text}
        buttonTitle={defaultProps.buttonTitle}
      />,
    );

    expect(getByText(defaultProps.title)).toBeTruthy();
    expect(getByText(defaultProps.text)).toBeTruthy();
  });

  it('calls onClose when the confirmation button is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = renderWithProviders(
      <ModalWarning
        visible
        onClose={onClose}
        title={defaultProps.title}
        text={defaultProps.text}
        buttonTitle={defaultProps.buttonTitle}
      />,
    );

    fireEvent.press(getByText(defaultProps.buttonTitle));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render content when not visible', () => {
    const { queryByText } = renderWithProviders(
      <ModalWarning
        visible={false}
        onClose={() => {}}
        title={defaultProps.title}
        text={defaultProps.text}
        buttonTitle={defaultProps.buttonTitle}
      />,
    );

    expect(queryByText(defaultProps.title)).toBeNull();
    expect(queryByText(defaultProps.text)).toBeNull();
  });
});
