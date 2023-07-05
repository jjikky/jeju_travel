const Sequelize = require("sequelize");

module.exports = class Area extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Area_Number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        Area_Province: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Area_City: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Area_Dong: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Area",
        tableName: "area",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
};
