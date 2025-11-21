import UploadInput from '@/src/components/UploadInput';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Toast } from 'toastify-react-native';

import { pickFile } from '../../src/utils/helpers';

// mock do seletor de arquivo
jest.mock('../../src/utils/helpers', () => ({
  pickFile: jest.fn(),
}));

// mock do Toast
jest.mock('toastify-react-native', () => ({
  Toast: {
    show: jest.fn(),
  },
}));

// mock dos ícones para evitar problema nativo
jest.mock('lucide-react-native', () => ({
  Paperclip: () => null,
  Upload: () => null,
  X: () => null,
}));

// mock do useColors para não depender de ThemeProvider/Providers
jest.mock('../../src/hooks/useColors', () => ({
  useColors: () => ({
    primaryBlue: '#0000ff',
    detailsGray: '#999999',
    text: '#000000',
  }),
}));

describe('components/UploadInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adiciona um arquivo quando pickFile retorna um arquivo (modo single)', async () => {
    const file = { name: 'doc1.pdf' };
    (pickFile as jest.Mock).mockResolvedValueOnce(file);

    const onChange = jest.fn();

    const { getByTestId, getByText } = render(
      <UploadInput multiple={false} onChange={onChange} />,
    );

    fireEvent.press(getByTestId('upload-button'));

    await waitFor(() => expect(pickFile).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith([file]));

    expect(getByText(file.name)).toBeTruthy();
  });

  it('evita adicionar arquivo duplicado quando multiple é true', async () => {
    const file = { name: 'duplicate.pdf' };
    (pickFile as jest.Mock)
      .mockResolvedValueOnce(file) // primeira vez
      .mockResolvedValueOnce(file); // duplicado

    const onChange = jest.fn();

    const { getByTestId } = render(
      <UploadInput multiple onChange={onChange} />,
    );

    const uploadButton = getByTestId('upload-button');

    // 1º arquivo
    fireEvent.press(uploadButton);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));

    // 2º arquivo (duplicado)
    fireEvent.press(uploadButton);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1); // não chama de novo
    });

    expect(Toast.show).toHaveBeenCalled(); // toast de duplicado
  });

  it('remove um arquivo existente ao clicar em remove-existing', async () => {
    const existing = [
      {
        id: '1',
        name: 'existing.pdf',
        url: 'http://example.com/existing.pdf',
      },
    ];
    const onExistingChange = jest.fn();

    const { getByTestId, queryByText, getByText } = render(
      <UploadInput
        multiple
        existing={existing}
        onChange={() => {}}
        onExistingChange={onExistingChange}
      />,
    );

    // garante que renderizou o arquivo existente
    expect(getByText(existing[0].name)).toBeTruthy();

    fireEvent.press(getByTestId('remove-existing-0'));

    await waitFor(() =>
      expect(onExistingChange).toHaveBeenCalledWith([]),
    );

    expect(queryByText(existing[0].name)).toBeNull();
  });

  it('remove um arquivo novo ao clicar em remove-file', async () => {
    const file = { name: 'newfile.pdf' };
    (pickFile as jest.Mock).mockResolvedValueOnce(file);

    const onChange = jest.fn();

    const { getByTestId, getByText, queryByText } = render(
      <UploadInput multiple onChange={onChange} />,
    );

    fireEvent.press(getByTestId('upload-button'));

    await waitFor(() => expect(getByText(file.name)).toBeTruthy());

    fireEvent.press(getByTestId('remove-file-0'));

    await waitFor(() => expect(onChange).toHaveBeenCalledWith([]));

    expect(queryByText(file.name)).toBeNull();
  });

  it('não chama pickFile quando maxFiles já foi atingido', async () => {
    const onChange = jest.fn();
    const existing = [
      {
        id: '1',
        name: 'already.pdf',
        url: 'http://example.com/already.pdf',
      },
    ];

    const { getByTestId } = render(
      <UploadInput
        multiple
        maxFiles={1}
        existing={existing}
        onChange={onChange}
      />,
    );

    fireEvent.press(getByTestId('upload-button'));

    await waitFor(() => {
      expect(pickFile).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });

    expect(Toast.show).toHaveBeenCalled(); // toast: limite atingido
  });
});
