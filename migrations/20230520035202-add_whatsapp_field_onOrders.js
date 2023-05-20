"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "On_orders",
      "whatsapp",
      {
        type: Sequelize.STRING,
      },
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("On_orders", "whatsapp");
  },
};
