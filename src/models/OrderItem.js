import { dataTypes } from '../config/sequelize';
import { Order } from './Order';
import { Product } from './Product';

const { INTEGER, DECIMAL, SMALLINT } = dataTypes;

export let OrderItem;
export const initOrderItem = async (sequelize) => {
  OrderItem = sequelize.define(
    'order_item',
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      quantity: {
        type: SMALLINT.UNSIGNED,
        allowNull: false
      },
      price: {
        type: DECIMAL(10, 2),
        allowNull: false
      },
      productId: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: 'product_order_unique'
      },
      orderId: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: 'product_order_unique'
      }
    },
    {
      timestamps: false,
      hooks: {
        beforeCreate: (productItem) => {
          const price = parseFloat(productItem.price) || 0;
          productItem.price = price.toFixed(2);
        },
        beforeUpdate: (productItem) => {
          const price = parseFloat(productItem.price) || 0;
          productItem.price = price.toFixed(2);
        }
      }
    }
  );
};

export const initOrderItemAssociations = () => {
  OrderItem.belongsTo(Product);
  OrderItem.belongsTo(Order);
};
