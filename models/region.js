'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class region extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  region.init({
    kode: DataTypes.STRING,
    nama: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'region',
  });
  return region;
};