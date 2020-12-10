import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import initDatabase from './src/config/database';
import initPassport from './src/config/passport';
import errorHandling from './src/middlewares/errorHandling';

// Routes
import auth from './src/routes/auth';
import products from './src/routes/products';
import stores from './src/routes/stores';
import favorites from './src/routes/favorites';
import users from './src/routes/users';

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

initPassport();

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

app.use(express.static('public'));

(async () => {
  await initDatabase();

  // API Routes
  app.use('/api/auth', auth);
  app.use('/api/products', products);
  app.use('/api/stores', stores);
  app.use('/api/favorites', favorites);
  app.use('/api/users', users);

  app.use(errorHandling);

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
