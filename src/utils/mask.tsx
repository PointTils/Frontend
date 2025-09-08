export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const handlePhoneChange = (text: string) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 11);

  const formatted = cleaned
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  return formatted;
};

export const handleCnpjChange = (text: string) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 14);

  const formatted = cleaned
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  return formatted;
};

export const validateCnpj = (cnpj: string) => {
  return cnpj.replace(/\D/g, '').length === 14;
};

export const handleCpfChange = (text: string) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 11); // Máx 11 dígitos

  const formatted = cleaned
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');

  return formatted;
};

export const validateCpf = (cpf: string) => {
  return cpf.replace(/\D/g, '').length === 11;
};

export const formatDate = (date: Date) =>{
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export const validateBirthday = (birthday: string) => {
  const cleaned = birthday.replace(/\D/g, '');
  if (cleaned.length !== 8) return false; 

  const day = parseInt(cleaned.substring(0, 2), 10);
  const month = parseInt(cleaned.substring(2, 4), 10);
  const year = parseInt(cleaned.substring(4, 8), 10);

  const dateObj = new Date(year, month - 1, day);

  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};