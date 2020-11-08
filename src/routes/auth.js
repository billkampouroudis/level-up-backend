import { Router } from 'express';
import { login, register } from '../controllers/auth';

const router = Router();

router.post('/login', async (req, res) => {
  res.json(await login(req, res));
});

router.post('/register', async (req, res) => {
  res.json(await register(req, res));
});

export default router;
