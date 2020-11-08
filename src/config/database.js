import { sequelize, loadDb } from './sequelize';
import initModels from '../models/index';

const initDatabase = async () => {
  try {
    loadDb();
    await initModels(sequelize);
    sequelize.sync();
  } catch (error) {
    console.log(error);
  }
};

export default initDatabase;
