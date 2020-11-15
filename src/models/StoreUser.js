import { dataTypes } from '../config/sequelize';
import { Store } from './Store';
import { User } from './User';

const { INTEGER, STRING } = dataTypes;

export let StoreUser;
export const initStoreUser = async (sequelize) => {
  StoreUser = sequelize.define('store_user', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userRole: {
      type: STRING,
      allowNull: false
    }
  });
};

export const initStoreUserAssociations = () => {
  StoreUser.belongsTo(Store);
  StoreUser.belongsTo(User);
};
