import { Router } from 'express';
import {
  createStore,
  getStore,
  listStores,
  partialUpdateStore,
  removeStore,
  listProducts
} from '../controllers/stores';

const auth = Router();

auth.post('/', async (req, res) => {
  res.json(await createStore(req, res));
});

auth.get('/:storeId', async (req, res) => {
  res.json(await getStore(req, res));
});

auth.get('/', async (req, res) => {
  res.json(await listStores(req, res));
});

auth.get('/:storeId/products', async (req, res) => {
  res.json(await listProducts(req, res));
});

auth.patch('/:storeId', async (req, res) => {
  res.json(await partialUpdateStore(req, res));
});

auth.delete('/:storeId', async (req, res) => {
  res.json(await removeStore(req, res));
});

export default auth;
