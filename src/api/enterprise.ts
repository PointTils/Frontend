import api from '@/src/api';
import type {
  EnterpriseRegisterPayload,
  EnterpriseRegisterResponse,
} from '@/src/types/api';

export const registerEnterprise = async (
  payload: EnterpriseRegisterPayload,
): Promise<EnterpriseRegisterResponse> => {
  const { data } = await api.post<EnterpriseRegisterResponse>(
    '/enterprise-users/register',
    payload,
  );
  return data;
};

export default { registerEnterprise };
