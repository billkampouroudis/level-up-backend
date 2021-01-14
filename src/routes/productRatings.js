import { Router } from 'express';
import {
  createProductRating,
  listProductRatings
} from '../controllers/productRatings';
import auth from '../middlewares/auth';

const productRatings = Router();

// Create
productRatings.post('/', auth, async (req, res) => {
  res.json(await createProductRating(req, res));
});

// List
productRatings.get('/', async (req, res) => {
  res.json(await listProductRatings(req, res));
});

export default productRatings;
