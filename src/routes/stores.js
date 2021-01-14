import { Router } from 'express';
import {
  createStore,
  getStore,
  listStores,
  listProducts
} from '../controllers/stores';
import auth from '../middlewares/auth';

const stores = Router();

stores.post(
  '/',
  (req, res, next) => auth(req, res, next),
  async (req, res) => {
    res.json(await createStore(req, res));
  }
);

stores.get('/:storeId', async (req, res) => {
  res.json(await getStore(req, res));
});

stores.get('/', async (req, res) => {
  res.json(await listStores(req, res));
});

stores.get('/:storeId/products', async (req, res) => {
  res.json(await listProducts(req, res));
});

export default stores;
