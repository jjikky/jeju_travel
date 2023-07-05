const Sequelize = require("sequelize");

module.exports = class Attraction extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Attraction_Number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        Attraction_Name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Attraction_Call: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Attraction_Kind: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Attraction_Report: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Attraction_Menu: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Attraction_Url: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        Area_Number: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Attraction_Addr: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        Attraction_Dong: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Attraction",
        tableName: "attraction",
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
  //   // db.Location.hasMany(db.Review);
  // }
};
