export const ParametersKeys = {
  faq: 'FAQ',
  test_contact_email: 'TEST_CONTACT_EMAIL',
} as const;

export interface ParameterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    key: string;
    value: string; // JSON string
  };
}
