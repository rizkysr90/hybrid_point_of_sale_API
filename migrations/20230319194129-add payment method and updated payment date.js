'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('On_orders', 'pay_method', {
      type: Sequelize.STRING,
    }, {});
    await queryInterface.addColumn('On_orders', 'paidAt', {
      type: Sequelize.DATE,
    }, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('On_orders', 'pay_method');
    await queryInterface.removeColumn('On_orders', 'paidAt');

  }
};
