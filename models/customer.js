'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    otp_reg: DataTypes.STRING,
    otp_forgot_pass : DataTypes.STRING,
    is_verified : DataTypes.INTEGER,
    exp_otp_reg : DataTypes.BIGINT,
    exp_otp_forgot_pass : DataTypes.BIGINT
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Customer',
  });
  return Customer;
};