'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer_Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const fk = {
        foreignKey : 'CustomerId'
      }

      models.Customer.hasMany(models.Customer_Address, fk);
      models.Customer_Address.belongsTo(models.Customer, fk);
    }
  }
  Customer_Address.init({
    recipient_name: DataTypes.STRING,
    recipient_phone_number: DataTypes.STRING,
    street: DataTypes.STRING,
    province: DataTypes.STRING,
    state: DataTypes.STRING,
    district: DataTypes.STRING,
    village: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    isPrimaryAddress: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Customer_Address',
  });
  return Customer_Address;
};