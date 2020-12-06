const { errorResponse } = require('../utils/response');

/**
 * Handles the errors that occure inside the application
 * @param {*} err
 */
// eslint-disable-next-line no-unused-vars
const errorHandling = (err, req, res, next) => {
  res.json(errorResponse(err, res));
};

export default errorHandling;
