'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class On_orders_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  On_orders_detail.init({
    OnOrderId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    sum_price_each: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'On_orders_detail',
  });
  return On_orders_detail;
};