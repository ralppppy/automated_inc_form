"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Requests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      requester_id: {
        type: Sequelize.INTEGER,
      },
      full_name: {
        type: Sequelize.STRING,
      },
      subject: {
        type: Sequelize.STRING,
      },
      semester: {
        type: Sequelize.STRING,
      },
      school_year: {
        type: Sequelize.STRING,
      },
      course: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.STRING,
      },

      approve: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Requests");
  },
};
