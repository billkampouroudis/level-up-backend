import { dataTypes } from '../config/sequelize';
import { hashSync, compareSync } from 'bcrypt';
import { Address } from './Address';

const { STRING, INTEGER, TINYINT } = dataTypes;

export let User;
export const initUser = async (sequelize) => {
  User = sequelize.define(
    'users',
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: STRING(45),
        allowNull: false
      },
      last_name: {
        type: STRING(45),
        allowNull: false
      },
      level: {
        type: TINYINT.UNSIGNED,
        defaultValue: 1
      },
      xp: {
        type: TINYINT.UNSIGNED,
        defaultValue: 0
      },
      email: {
        type: STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      mobile_number_code: {
        type: STRING(3)
      },
      mobile_number: {
        type: STRING(100),
        validate: {
          isNumeric: true
        }
      },
      password: {
        type: STRING(60),
        allowNull: false
      },

      addressId: {
        type: INTEGER.UNSIGNED
      }
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = hashSync(user.password, 5);
        }
      }
    }
  );

  User.prototype.validPassword = function (password) {
    return compareSync(password, this.password);
  };
};

export const initUserAssociations = () => {
  User.belongsToMany(Address, { through: 'address_user' });
};
