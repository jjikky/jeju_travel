const Sequelize = require("sequelize");

module.exports = class Review extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Review_Number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        Review_Text: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Review_Write_Date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        Review_Visit_Date: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Review_Star: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        Attraction_Number: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        Attraction_Name: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        creator: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Review",
        tableName: "review",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  // static associate(db) {
  //   db.Review.belongsTo(db.User, {
  //     foreignKey: "email",
  //     targetKey: "email",
  //   });
  //   db.Review.belongsTo(db.Attraction, {
  //     foreignKey: "Attraction_Number",
  //     targetKey: "Attraction_Number",
  //   });
  // }
};
