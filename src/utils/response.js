import STATUS from '../constants/statusCodes';

export const successResponse = (status, data, res) => {
  res.statusCode = status || STATUS.HTTP_200_OK;
  return {
    data: data || {}
  };
};

export const errorResponse = (error, res) => {
  res.statusCode = error.status || STATUS.HTTP_500_INTERNAL_SERVER_ERROR;
  return {
    error: error || {}
  };
};
