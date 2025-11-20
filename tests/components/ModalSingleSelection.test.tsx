// ModalSingleSelection.test.tsx
import ModalSingleSelection from '@/src/components/ModalSingleSelection';
import { Strings } from '@/src/constants/Strings';
import { render, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { Modal } from 'react-native';



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
  ChevronDownIcon: 'ChevronDownIcon',
}));

const mockItems = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const defaultProps = {
  items: mockItems,
  selectedValue: '',
  onSelectionChange: jest.fn(),
};

describe('ModalSingleSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder when no item is selected', () => {
    render(<ModalSingleSelection {...defaultProps} />);
    
    expect(screen.getByText(Strings.common.fields.select)).toBeTruthy();
  });

  it('renders with selected item label', () => {
    render(
      <ModalSingleSelection
        {...defaultProps}
        selectedValue="male"
      />
    );

    expect(screen.getByText('Male')).toBeTruthy();
  });

  it('opens modal when trigger is pressed', () => {
    render(<ModalSingleSelection {...defaultProps} />);

    fireEvent.press(screen.getByText(Strings.common.fields.select));

    expect(screen.getByText('Male')).toBeTruthy();
    expect(screen.getByText('Female')).toBeTruthy();
    expect(screen.getByText('Other')).toBeTruthy();
    expect(screen.getByText(Strings.common.buttons.cancel)).toBeTruthy();
  });

  it('selects an item and closes modal when item is pressed', () => {
    const onSelectionChange = jest.fn();
    render(
      <ModalSingleSelection
        {...defaultProps}
        onSelectionChange={onSelectionChange}
      />
    );

    // Abre o modal e seleciona um item
    fireEvent.press(screen.getByText(Strings.common.fields.select));
    fireEvent.press(screen.getByText('Female'));

    expect(onSelectionChange).toHaveBeenCalledWith('female');
    // Modal deve fechar após seleção
    expect(screen.queryByText('Male')).toBeFalsy();
  });

  it('closes modal when cancel button is pressed', () => {
    render(<ModalSingleSelection {...defaultProps} />);

    // Abre o modal
    fireEvent.press(screen.getByText(Strings.common.fields.select));
    expect(screen.getByText('Male')).toBeTruthy();

    // Fecha o modal
    fireEvent.press(screen.getByText(Strings.common.buttons.cancel));
    
    // Verifica que o modal foi fechado
    expect(screen.queryByText('Male')).toBeFalsy();
  });

  it('closes modal when overlay is pressed', () => {
    render(<ModalSingleSelection {...defaultProps} />);

    // Abre o modal
    fireEvent.press(screen.getByText(Strings.common.fields.select));
    
    // Encontra o overlay pressionando fora do conteúdo do modal
    // Busca pelo elemento que contém o texto de cancelamento e sobe na hierarquia
    const cancelButton = screen.getByText(Strings.common.buttons.cancel);
    const modalContent = cancelButton.parent?.parent; // View do conteúdo
    const overlay = modalContent?.parent; // Pressable do overlay
    
    if (overlay) {
      fireEvent.press(overlay);
    }

    // Verifica que o modal foi fechado
    expect(screen.queryByText('Male')).toBeFalsy();
  });

  it('handles modal onRequestClose (hardware back button)', () => {
    const { UNSAFE_root } = render(<ModalSingleSelection {...defaultProps} />);

    // Abre o modal
    fireEvent.press(screen.getByText(Strings.common.fields.select));
    
    // Encontra o modal usando a instância do componente
    const modalComponent = UNSAFE_root.findAllByType(Modal)[0];
    fireEvent(modalComponent, 'onRequestClose');

    expect(screen.queryByText('Male')).toBeFalsy();
  });

  it('shows no calendar available message when hasTimeSlots is false', () => {
    render(
      <ModalSingleSelection
        {...defaultProps}
        hasTimeSlots={false}
      />
    );

    fireEvent.press(screen.getByText(Strings.common.fields.select));

    expect(screen.getByText(Strings.toSchedule.noCalendarAvailable)).toBeTruthy();
    // Verifica que os itens normais não são mostrados
    expect(screen.queryByText('Male')).toBeFalsy();
  });

  it('uses custom placeholder text', () => {
    render(
      <ModalSingleSelection
        {...defaultProps}
        placeholderText="Choose an option"
      />
    );

    expect(screen.getByText('Choose an option')).toBeTruthy();
  });
});