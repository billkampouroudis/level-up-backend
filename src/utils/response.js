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

/**
 * Hides the given fields from the response object
 * @param {string[]} fieldsToHide
 * @param {Object} model
 */
export const prepareResponse = (fieldsToHide = [], model = {}) => {
  for (let field of fieldsToHide) {
    delete model[field];
  }

  return model;
};
