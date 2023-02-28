'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.addColumn('of_orders_details', 'snap_product_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Snap_products',
          key: 'id',
        }
      }, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('of_orders_details', 'snap_product_id');
  }
};
