'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class of_orders_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  of_orders_details.init({
    ofOrderId: DataTypes.STRING,
    ProductId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    sum_price_each: DataTypes.DOUBLE
  }, {
    sequelize,
    paranoid: true,
    modelName: 'of_orders_details',
  });
  return of_orders_details;
};