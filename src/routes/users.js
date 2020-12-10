import { Router } from 'express';
import {
  createUser,
  getUser,
  listUsers,
  partialUpdateUser,
  removeUser
} from '../controllers/users';
import auth from '../middlewares/auth';

const users = Router();

users.post(
  '/',
  (req, res, next) => auth(req, res, next),
  async (req, res) => {
    res.json(await createUser(req, res));
  }
);

users.get('/:userId', async (req, res) => {
  res.json(await getUser(req, res));
});

users.get('/', async (req, res) => {
  res.json(await listUsers(req, res));
});

users.patch(
  '/:userId',
  (req, res, next) => auth(req, res, next),
  async (req, res) => {
    res.json(await partialUpdateUser(req, res));
  }
);

users.delete(
  '/:userId',
  (req, res, next) => auth(req, res, next),
  async (req, res) => {
    res.json(await removeUser(req, res));
  }
);

export default users;
