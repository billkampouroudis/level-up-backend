import { sequelize, loadDb } from './sequelize';
import initModels, { models } from '../models/index';
import fs from 'fs';
import path from 'path';
import sequelizeFixtures from 'sequelize-fixtures';

const initDatabase = async () => {
  try {
    loadDb();
    await initModels(sequelize);

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });

      const fixturesPath = '../models/fixtures';
      const directoryPath = path.join(__dirname, fixturesPath);
      fs.readdir(directoryPath, async function (err, files) {
        if (err) {
          throw err;
        }
        await sequelizeFixtures.loadFile(
          path.join(directoryPath, files[0]),
          models
        );
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default initDatabase;
