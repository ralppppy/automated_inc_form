"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.client = User.hasOne(models.EP_ClientUser, {
      //   as: "client",
      //   foreignKey: "user_id",
      // });

      Request.requests = User.hasOne(models.Request, {
        as: "requests",
        foreignKey: "requester_id",
      });
    }
  }

  User.init(
    {
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phone_number: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.TEXT, allowNull: true },
      organization_id: { type: DataTypes.INTEGER, allowNull: true },
      is_student: { type: DataTypes.BOOLEAN, allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false },
      verification_token: { type: DataTypes.TEXT, allowNull: true },
      reset_password_token: { type: DataTypes.TEXT, allowNull: true },
      sort: { type: DataTypes.TEXT, allowNull: false },
      active_security: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_User",

      // defaultScope: {
      //   attributes: { exclude: ["password"] },
      // },
    }
  );
  return User;
};
