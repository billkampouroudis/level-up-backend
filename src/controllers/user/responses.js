import { prepareResponse } from '../../utils/response';

export const authResponse = (user) => {
  const fieldsToHide = ['password'];
  return prepareResponse(fieldsToHide, user);
};
