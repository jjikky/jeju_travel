const Activity = require("../models/activity");
const Area = require("../models/area");
const Attraction = require("../models/attraction");
const Resort = require("../models/resort");

exports.isLoggedIn = (req, res, next) => {
  // 로그인 된 사용자인지 판별
  if (req.isAuthenticated()) {
    next();
  } else {
    // res.status(403).send("로그인 필요");
    res.redirect("/login");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};

exports.insertData = async (req, res, next) => {
  // 데이터 삽입
  const {
    activity_data,
    area_data,
    attraction_data,
    resort_data,
  } = require("../public/data/mysql_data");

  setTimeout(() => insertQuery(), 3000);
  async function insertQuery() {
    // 데이터가 있으면 삽입x 없으면 삽입
    const temp = await Activity.findOne({ where: { id: 1 } });
    if (temp) {
      console.log("data exist");
    } else {
      for (var i = 0; i < activity_data.length; i++) {
        await Activity.create({
          // activity생성
          id: activity_data[i][0],
          createdAt: activity_data[i][1],
          updatedAt: activity_data[i][2],
          Activity_Name: activity_data[i][3],
          Activity_Img: activity_data[i][4],
          Activity_Location: activity_data[i][5],
          Activity_Content: activity_data[i][6],
          Activity_Content_Img: activity_data[i][7],
        });
      }
      for (var i = 0; i < area_data.length; i++) {
        await Area.create({
          // area생성
          createdAt: area_data[i][0],
          updatedAt: area_data[i][1],
          Area_Number: area_data[i][2],
          Area_Province: area_data[i][3],
          Area_City: area_data[i][4],
          Area_Dong: area_data[i][5],
        });
      }
      for (var i = 0; i < attraction_data.length; i++) {
        await Attraction.create({
          //attraction생성
          createdAt: attraction_data[i][0],
          updatedAt: attraction_data[i][1],
          Attraction_Number: attraction_data[i][2],
          Attraction_Name: attraction_data[i][3],
          Attraction_Call: attraction_data[i][4],
          Attraction_Kind: attraction_data[i][5],
          Attraction_Report: attraction_data[i][6],
          Attraction_Menu: attraction_data[i][7],
          Area_Number: attraction_data[i][8],
          Attraction_Url: attraction_data[i][9],
        });
      }
      for (var i = 0; i < resort_data.length; i++) {
        await Resort.create({
          // resort생성
          createdAt: resort_data[i][0],
          updatedAt: resort_data[i][1],
          Resort_Number: resort_data[i][2],
          Resort_Name: resort_data[i][3],
          Resort_Call: resort_data[i][4],
          Resort_Url: resort_data[i][5],
          Area_Number: resort_data[i][6],
        });
      }
      console.log("생성완료");
    }
  }
};
