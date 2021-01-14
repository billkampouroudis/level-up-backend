import { Router } from 'express';
import {
  createUser,
  getUser,
  listUsers,
  removeUser
} from '../controllers/users';
import auth from '../middlewares/auth';

const users = Router();

users.post('/', auth, async (req, res) => {
  res.json(await createUser(req, res));
});

users.get('/:userId', auth, async (req, res) => {
  res.json(await getUser(req, res));
});

users.get('/', auth, async (req, res) => {
  res.json(await listUsers(req, res));
});
users.delete('/:userId', auth, async (req, res) => {
  res.json(await removeUser(req, res));
});

export default users;
