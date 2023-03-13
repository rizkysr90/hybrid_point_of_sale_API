'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Customers', 'otp_reg', {
      type: Sequelize.STRING,
    }, {});
    await queryInterface.addColumn('Customers', 'otp_forgot_pass', {
      type: Sequelize.STRING,
    }, {});
    await queryInterface.addColumn('Customers', 'is_verified', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn('Customers', 'exp_otp_forgot_pass', {
      type: Sequelize.BIGINT,
    }, {});
    await queryInterface.addColumn('Customers', 'exp_otp_reg', {
      type: Sequelize.BIGINT,
    }, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Customers', 'otp_reg');
    await queryInterface.removeColumn('Customers', 'otp_forgot_pass');
    await queryInterface.removeColumn('Customers', 'is_verified');
    await queryInterface.removeColumn('Customers', 'exp_otp_forgot_pass');
    await queryInterface.removeColumn('Customers', 'exp_otp_reg');    
  }
};
