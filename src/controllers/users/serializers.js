import { prepareResponse } from '../../utils/response';

export const authSerializer = (user) => {
  const fieldsToHide = ['password'];
  return prepareResponse(fieldsToHide, user);
};
