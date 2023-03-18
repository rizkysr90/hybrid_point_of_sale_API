'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('On_orders', 'lat', {
      type: Sequelize.FLOAT,
    }, {});
    await queryInterface.addColumn('On_orders', 'lng', {
      type: Sequelize.FLOAT,
    }, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('On_orders', 'lat');
    await queryInterface.removeColumn('On_orders', 'lng');

   
  }
};
