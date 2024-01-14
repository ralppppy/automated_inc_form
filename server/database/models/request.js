"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Request.user = Request.belongsTo(models.EP_User, {
        as: "user",
        foreignKey: "requester_id",
      });
    }
  }
  Request.init(
    {
      full_name: DataTypes.STRING,
      subject: DataTypes.STRING,
      semester: DataTypes.STRING,
      school_year: DataTypes.STRING,
      course: DataTypes.STRING,
      rating: DataTypes.STRING,
      approve: DataTypes.BOOLEAN,
      requester_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Request",
    }
  );
  return Request;
};
