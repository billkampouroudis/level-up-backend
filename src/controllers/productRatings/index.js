import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import jwt_decode from 'jwt-decode';
import findError from '../../utils/misc/errorHandling';
import {
  createProductRatingService,
  listProductRatingsService
} from './productRatingsServices';
import { paginationValues } from '../../utils/misc/pagination';

export async function createProductRating(req, res) {
  try {
    const { productId } = req.body;
    const productIdNumber = parseInt(productId);

    const tokenUser = jwt_decode(req.headers.authorization).user;

    const result = await createProductRatingService({
      ...req.body,
      productId: productIdNumber,
      userId: tokenUser.id
    });

    return successResponse(STATUS.HTTP_200_OK, result, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}

export async function listProductRatings(req, res) {
  try {
    const { productId } = req.body;
    const { page, pageSize } = req.query;
    const productIdNumber = parseInt(productId);

    const results = await listProductRatingsService(
      {
        ...req.body,
        productId: productIdNumber
      },
      req.query
    );

    return successResponse(
      STATUS.HTTP_200_OK,
      results.rows,
      res,
      paginationValues(page, pageSize, results.count)
    );
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}
