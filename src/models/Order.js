import { dataTypes } from '../config/sequelize';
import { User } from './User';
import { OrderItem } from './OrderItem';
import { Store } from './Store';
import { Address } from './Address';

const { INTEGER, STRING, DATE } = dataTypes;

export let Order;
export const initOrder = async (sequelize) => {
  Order = sequelize.define(
    'order',
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: STRING,
        allowNull: false,
        defaultValue: 'in_cart',
        validate: {
          isIn: [['in_cart', 'registered', 'sent', 'closed']]
        }
      },
      registeredAt: {
        type: DATE
      },
      addressId: {
        type: INTEGER.UNSIGNED
      },
      storeId: {
        type: INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      privateColumns: ['userId']
    }
  );
};

export const initOrderAssociations = async () => {
  Order.belongsTo(User);
  Order.hasMany(OrderItem, { as: 'orderItems' });
  Order.belongsTo(Store);
  Order.belongsTo(Address);
};
