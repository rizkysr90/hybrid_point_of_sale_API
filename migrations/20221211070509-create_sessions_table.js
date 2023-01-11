'use strict';
const {store} = require('../app.js')
module.exports = {
  async up (queryInterface, Sequelize) {
       await store.sync()
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.dropTable('Sessions');
  }
};
