'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const fk = {
        foreignKey : 'customer_id'
      }

      models.Customer.hasOne(models.Cart, fk);
      models.Cart.belongsTo(models.Customer, fk);
      models.Cart.belongsToMany(models.Product, {through : models.Cart_detail});
      models.Cart.hasMany(models.Cart_detail);
      models.Cart_detail.belongsTo(models.Cart);

    }
  }
  Cart.init({
    customer_id: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Cart',
  });
  return Cart;
};