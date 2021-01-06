import STATUS from '../constants/statusCodes';

export const successResponse = (status, data, res, pagination = {}) => {
  res.statusCode = status || STATUS.HTTP_200_OK;
  return {
    ...pagination,
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
 * @param {Object|Object[]} model
 */
export const prepareResponse = (fieldsToHide = [], model) => {
  if (!model) {
    return null;
  }

  let _model = [];

  if (Array.isArray(model)) {
    for (let item of model) {
      let _item = item.toJSON();

      for (let field of fieldsToHide) {
        delete _item[field];
        _model.push(_item);
      }
    }

    return _model;
  }

  for (let field of fieldsToHide) {
    delete model[field];
  }

  return model;
};
