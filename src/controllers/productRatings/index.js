import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import jwt_decode from 'jwt-decode';
import findError from '../../utils/misc/errorHandling';
import {
  createProductRatingService,
  listProductRatingsService
} from './productRatingsServices';
import { paginationValues } from '../../utils/misc/pagination';
import { models } from '../../models';
import { giveXpFromRating } from '../../utils/points/points';

export async function createProductRating(req, res) {
  try {
    const { User } = models;
    const { productId } = req.body;
    const productIdNumber = parseInt(productId);

    const tokenUser = jwt_decode(req.headers.authorization).user;

    const result = await createProductRatingService({
      ...req.body,
      productId: productIdNumber,
      userId: tokenUser.id
    });

    let user = await User.findOne({
      where: { id: tokenUser.id },
      attributes: {
        exclude: ['password']
      }
    });

    user.xp += giveXpFromRating();
    await user.save();

    return successResponse(STATUS.HTTP_200_OK, result, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}

export async function listProductRatings(req, res) {
  try {
    const { page, pageSize } = req.query;
    const results = await listProductRatingsService(req.query);

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
