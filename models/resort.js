const Sequelize = require("sequelize");

module.exports = class Resort extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Resort_Number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        Resort_Name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Resort_Call: {
          type: Sequelize.STRING(100),
        },
        Resort_Url: {
          type: Sequelize.STRING(1000),
        },
        Area_Number: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Resort",
        tableName: "resort",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  // static associate(db) {
  //   db.Attraction.belongsTo(db.Area, {
  //     foreignKey: "Area_Number",
  //     targetKey: "Area_Number",
  //   });
  // }
};
