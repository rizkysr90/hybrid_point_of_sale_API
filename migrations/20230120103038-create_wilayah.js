'use strict';
const fs = require('node:fs/promises');
const {sequelize} = require('../models/index');
const path = require('node:path');
module.exports = {
  async up (queryInterface, Sequelize) {
      return fs.readFile(`${path.dirname(__dirname)}/migrations/wilayah_2022.sql`).then(sql => sequelize.query(sql.toString()))
      // console.log( path.dirname(__dirname));
      // return fs.readFile(`${path.dirname(__dirname)}/migrations/wilayah_2022.sql`).then(sql => 
      // {
      //   var promises = []
      //   var statements = sql.toString().split(';')
      //   console.log('STATEMENT', statements);
      //   for (var statement of statements)
      //       if (statement.trim() != '') promises.push(sequelize.query(statement))
      //   return Promise.all(promises)
      //  })    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('wilayah_2022');
  }
};
