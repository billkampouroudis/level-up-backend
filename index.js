import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import initDatabase from './src/config/database';

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

import './src/config/passport';

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

(async () => {
  await initDatabase();

  // API Routes
  app.use('/api/auth', require('./src/routes/auth'));

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
