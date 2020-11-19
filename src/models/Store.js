import { dataTypes } from '../config/sequelize';
import { StoreUser } from './StoreUser';
import { User } from './User';
import { Address } from './Address';
import { Product } from './Product';

const { INTEGER, STRING } = dataTypes;

export let Store;
export const initStore = async (sequelize) => {
  Store = sequelize.define('store', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    brandName: {
      type: STRING(45),
      allowNull: false
    },
    contactPhone: {
      type: STRING(20)
    },
    contactEmail: {
      type: STRING(100),
      allowNull: false,
      unique: true
    }
  });
};

export const initStoreAssociations = () => {
  Store.belongsToMany(User, { through: StoreUser });
  Store.belongsToMany(Address, { through: 'address_store' });
  Store.hasMany(Product);
};
