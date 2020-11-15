import { Router } from 'express';
import { login, register } from '../controllers/auth';

const auth = Router();

auth.post('/login', async (req, res) => {
  res.json(await login(req, res));
});

auth.post('/register', async (req, res) => {
  res.json(await register(req, res));
});

export default auth;
