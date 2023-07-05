const Sequelize = require("sequelize");

module.exports = class Activity extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Activity_Name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Activity_Img: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        Activity_Location: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        Activity_Content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        Activity_Content_Img: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Activity",
        tableName: "activity",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
};
