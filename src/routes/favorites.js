import { Router } from 'express';
import {
  createFavorite,
  listFavorites,
  removeFavorite
} from '../controllers/favorites';
import auth from '../middlewares/auth';

const products = Router();

products.post(
  '/:productId',
  (req, res, next) => auth(req, res, next),
  async (req, res) => {
    res.json(await createFavorite(req, res));
  }
);

products.get('/', auth, async (req, res) => {
  res.json(await listFavorites(req, res));
});

products.delete('/:productId', auth, async (req, res) => {
  res.json(await removeFavorite(req, res));
});

export default products;
