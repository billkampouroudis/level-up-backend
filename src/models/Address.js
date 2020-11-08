import { dataTypes } from '../config/sequelize';
import { User } from './User';

const { STRING, TINYINT, INTEGER, SMALLINT } = dataTypes;

export let Address;
export const initAddress = async (sequelize) => {
  Address = sequelize.define(
    'addresses',
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      street: {
        type: STRING(100),
        allowNull: false
      },
      number: {
        type: SMALLINT.UNSIGNED,
        allowNull: false
      },
      zip_code: {
        type: STRING(20),
        allowNull: false
      },
      city: {
        type: STRING(100),
        allowNull: false
      },
      country: {
        type: STRING(100),
        allowNull: false
      },
      floor: {
        type: TINYINT.UNSIGNED
      }
    },
    {
      timestamps: false
    }
  );
};

export const initAddressAssociations = async () => {
  Address.belongsToMany(User, { through: 'address_user' });
};
