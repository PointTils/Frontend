import ModalMultipleSelection from '@/src/components/ModalMultipleSelection';
import { Strings } from '@/src/constants/Strings';
import { render, fireEvent, screen } from '@testing-library/react-native';
import type React from 'react';



// Mock do useColors
jest.mock('@/src/hooks/useColors', () => ({
  useColors: () => ({
    mandatory: '#ff0000',
    fieldGray: '#cccccc',
    background: '#ffffff',
    primaryBlue: '#007aff',
    text: '#000000',
    detailsGray: '#666666',
    disabled: '#999999',
    modalOverlay: 'rgba(0,0,0,0.5)',
  }),
}));

// Mock dos ícones
jest.mock('lucide-react-native', () => ({
  CheckIcon: () => 'CheckIcon',
  ChevronDownIcon: () => 'ChevronDownIcon',
}));

// Mock dos componentes customizados com display name
jest.mock('@/src/components/ui/text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const TextComponent = React.forwardRef((props: React.JSX.IntrinsicAttributes, ref: any) => <Text ref={ref} {...props} />);
  TextComponent.displayName = 'Text';
  return { Text: TextComponent };
});

jest.mock('@/src/components/ui/view', () => {
  const React = require('react');
  const { View } = require('react-native');
  const ViewComponent = React.forwardRef((props: React.JSX.IntrinsicAttributes, ref: any) => <View ref={ref} {...props} />);
  ViewComponent.displayName = 'View';
  return { View: ViewComponent };
});

const mockItems = [
  { label: 'Medical', value: 'medical' },
  { label: 'Legal', value: 'legal' },
  { label: 'Education', value: 'education' },
];

const defaultProps = {
  items: mockItems,
  selectedValues: [],
  onSelectionChange: jest.fn(),
};

describe('ModalMultipleSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder when no items are selected', () => {
    render(<ModalMultipleSelection {...defaultProps} />);
    
    expect(screen.getByText(Strings.common.fields.select)).toBeTruthy();
  });

  it('renders with single selected item label', () => {
    render(
      <ModalMultipleSelection
        {...defaultProps}
        selectedValues={['medical']}
      />
    );

    expect(screen.getByText('Medical')).toBeTruthy();
  });

  it('opens modal when trigger is pressed', () => {
    render(<ModalMultipleSelection {...defaultProps} />);

    fireEvent.press(screen.getByText(Strings.common.fields.select));

    expect(screen.getByText('Medical')).toBeTruthy();
    expect(screen.getByText('Legal')).toBeTruthy();
    expect(screen.getByText('Education')).toBeTruthy();
    expect(screen.getByText(Strings.common.buttons.cancel)).toBeTruthy();
  });

  it('selects an item when pressed', () => {
    const onSelectionChange = jest.fn();
    render(
      <ModalMultipleSelection
        {...defaultProps}
        onSelectionChange={onSelectionChange}
      />
    );

    // Abre o modal e seleciona um item
    fireEvent.press(screen.getByText(Strings.common.fields.select));
    fireEvent.press(screen.getByText('Medical'));

    expect(onSelectionChange).toHaveBeenCalledWith(['medical']);
  });

  it('does not show check icon for unselected items in modal', () => {
    render(<ModalMultipleSelection {...defaultProps} />);

    // Abre o modal
    fireEvent.press(screen.getByText(Strings.common.fields.select));

    const unselectedItemContainer = screen.getByText('Medical').parent;
    // O ícone não deve estar presente para itens não selecionados
    expect(unselectedItemContainer.children).not.toContain('CheckIcon');
  });

  it('closes modal when cancel button is pressed', () => {
    render(<ModalMultipleSelection {...defaultProps} />);

    // Abre o modal
    fireEvent.press(screen.getByText(Strings.common.fields.select));
    expect(screen.getByText('Medical')).toBeTruthy();

    // Fecha o modal
    fireEvent.press(screen.getByText(Strings.common.buttons.cancel));
    
    // Verifica que o modal foi fechado
    expect(screen.queryByText('Medical')).toBeFalsy();
  });

  it('handles modal onRequestClose by using cancel button', () => {
    render(<ModalMultipleSelection {...defaultProps} />);

    // Abre o modal
    fireEvent.press(screen.getByText(Strings.common.fields.select));
    
    // Usa o cancel button como proxy para onRequestClose
    fireEvent.press(screen.getByText(Strings.common.buttons.cancel));

    expect(screen.queryByText('Medical')).toBeFalsy();
  });

  it('uses custom placeholder text', () => {
    render(
      <ModalMultipleSelection
        {...defaultProps}
        placeholderText="Select specialties"
      />
    );

    expect(screen.getByText('Select specialties')).toBeTruthy();
  });

  it('renders with correct text color when items are selected', () => {
    render(
      <ModalMultipleSelection
        {...defaultProps}
        selectedValues={['medical']}
      />
    );

    const triggerText = screen.getByText('Medical');
    expect(triggerText.props.style.color).toBe('#000000');
  });

  it('renders with correct text color for placeholder', () => {
    render(<ModalMultipleSelection {...defaultProps} />);

    const placeholderText = screen.getByText(Strings.common.fields.select);
    expect(placeholderText.props.style.color).toBe('#666666');
  });

  it('handles single selection display text when item is found', () => {
    render(
      <ModalMultipleSelection
        {...defaultProps}
        selectedValues={['medical']}
      />
    );

    expect(screen.getByText('Medical')).toBeTruthy();
  });

  it('maintains selection state when toggling items', () => {
    const onSelectionChange = jest.fn();
    render(
      <ModalMultipleSelection
        {...defaultProps}
        selectedValues={['medical']}
        onSelectionChange={onSelectionChange}
      />
    );

    // Abre o modal e alterna um item
    fireEvent.press(screen.getByText('Medical'));
    fireEvent.press(screen.getByText('Legal'));

    expect(onSelectionChange).toHaveBeenCalledWith(['medical', 'legal']);
  });

  it('handles empty items array', () => {
    render(
      <ModalMultipleSelection
        {...defaultProps}
        items={[]}
      />
    );

    // Deve renderizar normalmente mesmo sem items
    expect(screen.getByText(Strings.common.fields.select)).toBeTruthy();
  });
});