import { Router } from 'express';
import {
  createAddress,
  getAddress,
  listAddresses,
  partialUpdateAddress,
  removeAddress,
  setPrimaryAddress
} from '../controllers/addresses';
import auth from '../middlewares/auth';

const addresss = Router();

addresss.post(
  '/',
  (req, res, next) => auth(req, res, next),
  async (req, res) => {
    res.json(await createAddress(req, res));
  }
);

addresss.get('/:addressId', auth, async (req, res) => {
  res.json(await getAddress(req, res));
});

addresss.get('/', auth, async (req, res) => {
  res.json(await listAddresses(req, res));
});

addresss.patch('/:addressId', auth, async (req, res) => {
  res.json(await partialUpdateAddress(req, res));
});

addresss.delete('/:addressId', auth, async (req, res) => {
  res.json(await removeAddress(req, res));
});

addresss.post('/setPrimaryAddress', auth, async (req, res) => {
  res.json(await setPrimaryAddress(req, res));
});

export default addresss;
