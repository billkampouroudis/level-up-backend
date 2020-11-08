import { dataTypes } from '../config/sequelize';

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
    brand_name: {
      type: STRING(45),
      allowNull: false
    },
    contact_phone: {
      type: STRING(20)
    },
    contact_email: {
      type: STRING(100),
      allowNull: false,
      unique: true
    },

    addressId: {
      type: INTEGER.UNSIGNED
    },
    admin_id: {
      type: INTEGER.UNSIGNED,
      allowNull: false
    }
  });
};

export const initStoreAssociations = () => {
  // Order.belongsToMany(Order, { through: 'address_user' });
};
