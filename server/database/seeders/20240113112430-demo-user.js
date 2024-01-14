"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "EP_Users",
      [
        {
          id: "1",
          first_name: "Ralp",
          last_name: "Doe 23",
          email: "ralpr.yosores@exact-construct.ch",
          password:
            "$2a$10$ENXyFytn/tsGbB.iLS/W2.sOEBGc9J2IyWa3.EnDOZV.ar0iMSCoW",
          organization_id: "1",
          is_student: "1",
          is_active: "1",
          verification_token: null,
          reset_password_token: null,
          sort: "0",
          active_security: "1",
          createdAt: "2023-07-05 11:38:14",
          updatedAt: "2023-11-03 02:00:03",
        },
        {
          id: "2",
          first_name: "Ralp",
          last_name: "Yosores",
          email: "ralpyosores@gmail.com",
          password:
            "$2a$10$xKtDGYYIpBrQVhzlJqn0XuUzAcw6fUpDlcN6C4cXYl/0GXQqgNt/q",
          organization_id: "1",
          is_student: "1",
          is_active: "1",
          verification_token: null,
          reset_password_token: null,
          sort: "0",
          active_security: "1",
          createdAt: "2023-07-06 01:33:22",
          updatedAt: "2023-11-28 06:31:10",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};