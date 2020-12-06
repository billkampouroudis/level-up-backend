import { Router } from 'express';
import {
  createStore,
  getStore,
  listStores,
  partialUpdateStore,
  removeStore,
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

stores.patch(
  '/:storeId',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await partialUpdateStore(req, res));
  }
);

stores.delete(
  '/:storeId',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await removeStore(req, res));
  }
);

export default stores;
