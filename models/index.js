const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Review = require("./review");
const Activity = require("./activity");
const Area = require("./area");
const Attraction = require("./attraction");
const Resort = require("./resort");

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Review = Review;
db.Activity = Activity;
db.Area = Area;
db.Attraction = Attraction;
db.Resort = Resort;

User.init(sequelize);
Review.init(sequelize);
Activity.init(sequelize);
Area.init(sequelize);
Attraction.init(sequelize);
Resort.init(sequelize);

User.associate(db);

module.exports = db;
