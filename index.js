import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import initDatabase from './src/config/database';
import initPassport from './src/config/passport';

// Routes
import auth from './src/routes/auth';

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

initPassport();

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

(async () => {
  await initDatabase();

  // API Routes
  app.use('/api/auth', auth);

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
