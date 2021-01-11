import { dataTypes } from '../config/sequelize';
import { Store } from './Store';
import { User } from './User';
import { Order } from './Order';

const { STRING, TINYINT, INTEGER, SMALLINT } = dataTypes;

export let Address;
export const initAddress = async (sequelize) => {
  Address = sequelize.define(
    'address',
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: STRING(45),
        allowNull: false
      },
      lastName: {
        type: STRING(45),
        allowNull: false
      },
      street: {
        type: STRING(100),
        allowNull: false
      },
      number: {
        type: SMALLINT.UNSIGNED,
        allowNull: false
      },
      zipCode: {
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
      },
      primary: {
        type: TINYINT.UNSIGNED
      }
    },
    {
      timestamps: false
    }
  );
};

export const initAddressAssociations = async () => {
  Address.belongsTo(User);
  Address.belongsTo(Store);
  Address.hasMany(Order);
};
