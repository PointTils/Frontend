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

export const handleBirthDateChange = (text: string) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 8);

  const formatted = cleaned
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');

  return formatted;
};

export const validateBirthDate = (date: string) => {
  const regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
  return regex.test(date);
};
