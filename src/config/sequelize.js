import Sequelize from 'sequelize';

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
  DB_HOST,
  DB_PORT
} = process.env;

export let sequelize;
export const loadDb = () => {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: DB_DIALECT || 'mysql',
    host: DB_HOST || 'localhost',
    port: DB_PORT || 3306
  });
};

export const dataTypes = Sequelize.DataTypes;
export const op = Sequelize.Op;
export const queryTypes = Sequelize.QueryTypes;
