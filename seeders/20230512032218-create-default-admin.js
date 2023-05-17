"use strict";
require("dotenv").config();
const { User } = require("../models/index.js");
const { hash } = require("../src/utils/bcrypt.util.js");
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await hash(process.env.PASSWORD_ADMIN);
    await User.create({
      name: "ADMIN",
      email: process.env.ADMIN,
      password: hashedPassword,
      role: "admin",
      phone_number: "0821000000000",
    });
  },

  async down(queryInterface, Sequelize) {
    await User.destroy({
      where: {
        email: process.env.ADMIN,
      },
    });
  },
};
