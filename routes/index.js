var express = require("express");
const Activity = require("../models/activity");
const Attraction = require("../models/attraction");
const Area = require("../models/area");
const Resort = require("../models/resort");
const Review = require("../models/review");
const { isLoggedIn } = require("./middlewares");
var router = express.Router();

router.use((req, res, next) => {
  // 유저 정보 미들웨어
  res.locals.user = req.user;
  next();
});

router.get("/", async (req, res) => {
  // home에 어트랙션 정보 전달
  const attraction = await Attraction.findAll({});
  res.render("index", { attraction });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/search", async (req, res) => {
  const attraction = await Attraction.findAll({
    // 검색어와 일치하는 어트랙션 리턴
    where: { Attraction_Name: req.body.search },
  });

  res.render("location_detail", { attraction });
});

router.get("/success", (req, res) => {
  res.render("success");
});

router.get("/sign", (req, res) => {
  res.render("sign");
});

router.get("/write_review", async (req, res) => {
  const attraction = await Attraction.findAll({}); // 모든 어트랙션 데이터 전송
  res.render("write_review", { attraction });
});
router.get("/update_review/:id", async (req, res) => {
  const attraction = await Attraction.findAll({}); // 모든 어트랙션 데이터 전송
  const review = await Review.findOne({
    // 파라미터로 전달된 id가 리뷰넘버인 리뷰데이터 전송
    where: { Review_Number: req.params.id },
  });
  res.render("update_review", { attraction, review });
});
router.post("/write_review", isLoggedIn, async (req, res) => {
  let date = new Date();
  let review_max = await Review.max("Review_Number"); // 리뷰넘버값갱신을 위해 가장큰 넘버 +1을 대입
  if (review_max == null) {
    review_max = -1;
  }
  review_max += 1;

  let attraction = await Attraction.findOne({
    where: { Attraction_Number: req.body.Attraction_Number },
  });
  const review = await Review.create({
    // 리뷰생성
    email: req.user.nick,
    Review_Number: review_max,
    Review_Text: req.body.Review_Text,
    // 현재 날짜 구하기
    Review_Write_Date:
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2) +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds(),
    Review_Visit_Date: req.body.Review_Visit_Date,
    Review_Star: req.body.Review_Star,
    Attraction_Number: req.body.Attraction_Number,
    Attraction_Name: attraction.dataValues.Attraction_Name,
    creator: req.user.dataValues.nick,
  });
  res.send(
    "<script>alert('리뷰 작성을 성공하였습니다!');window.location.href=\"/\";</script>"
  );
});

router.post("/resort", (req, res) => {
  res.redirect("/resort/" + req.body.Area_Number);
});
router.get("/resort/:id", async (req, res) => {
  // 리조트 검색
  const area_all = await Area.findAll({});
  var area = [];
  var resort = [];
  if (req.params.id == "전체") {
    area = await Area.findAll({}); // 모든 지역검색
    resort = await Resort.findAll({}); //모든 숙소 검색
  } else {
    area = await Area.findByPk(req.params.id); // id와 같은 지역검색
    resort = await Resort.findAll({
      // 해당지역에 있는숙소 검색
      where: { Area_Number: req.params.id },
    });
  }
  res.render("resort_detail", { area, resort, area_all });
});

router.get("/activity", async (req, res) => {
  const activity = await Activity.findAll({});
  res.render("activity", { activity });
});

router.get("/activity/:num", async (req, res) => {
  var num = Number(req.params.num);
  const activity = await Activity.findOne({ where: { id: num } }); // 해당 액티비티 검색
  console.log(activity);
  var data = activity.dataValues;
  var img_arr = activity.Activity_Content_Img.split("@@@"); // @@@단위로 이어진 이미지 문자열을 배열로 분할
  res.render("activity_num", { num, img_arr, data });
});

// router.get("/test", async (req, res) => {
//   const temp = await Activity.findOne({ where: { id: 7 } });

//   if (temp) {
//     res.send("데이터있음");
//   } else {
//     await Activity.create({
//       id: 0,
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//       Activity_Name: "[제주/서부] 아르떼뮤지엄",
//       Activity_Img:
//         "https://res.klook.com/image/upload/c_fill,w_1160,h_460/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/lrkpkp9aiqub0gxeunek.webp",
//       Activity_Location:
//         "위치-아르떼뮤지엄, 제주특별자치도 제주시 애월읍 어람비로 478(어음리 1503)",
//       Activity_Content:
//         "입장권@@@아동 10,000원@@@청소년13,000원@@@성인17,000원",
//       Activity_Content_Img:
//         "https://res.klook.com/image/upload/v1668071996/admin-markdown/vqpnq3grd2qi9qzyciaf.jpg@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_529/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/qf17kvevcennyzfdcbl3/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_496/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/qqzyk9kttgv9ddoln1t3/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_3560/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/q1qdcrnnhaor2o5lpdtx/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_379/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/ucidcyn8pwhsfg88x5lj/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_1040/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/a2kntlsqztfd1boujupc/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_0,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_982,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_1964,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_2946,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_3928,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_4910,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_5892,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_6874,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_7856,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_8838,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_9820,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_10802,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_11784,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_12766,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_13748,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_14730,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_15712,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_16694,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_17676,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/c_crop,x_0,y_18658,h_982,w_1295/activities/cz0oazsyaerzgidyzwr7/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_0,h_852,w_1295/activities/ftqrb4sxh6tpufhhsp4h/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/c_crop,x_0,y_852,h_852,w_1295/activities/ftqrb4sxh6tpufhhsp4h/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp@@@https://res.klook.com/images/fl_lossy.progressive,q_65/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/c_crop,x_0,y_1704,h_852,w_1295/activities/ftqrb4sxh6tpufhhsp4h/[%EC%A0%9C%EC%A3%BC%EC%84%9C%EB%B6%80]%EC%95%84%EB%A5%B4%EB%96%BC%EB%AE%A4%EC%A7%80%EC%97%84%EC%9E%85%EC%9E%A5%EA%B6%8C.webp",
//     });
//   }
//   res.send("생성완료");
// });

router.get("/my_review", isLoggedIn, async (req, res) => {
  // 내가쓴 리뷰
  const review = await Review.findAll({
    // 해당 유저가쓴 모든리뷰 불러오기
    where: { creator: req.user.dataValues.nick },
  });
  res.render("my_review", { review });
  console.log(review);
});
router.put("/my_review/:id", isLoggedIn, async (req, res) => {
  //리뷰수정
  let date = new Date();
  console.log(req.body);
  let attraction = await Attraction.findOne({
    where: { Attraction_Number: req.body.Attraction_Number },
  });
  await Review.update(
    // 리뷰 내용 업데이트
    {
      Review_Text: req.body.Review_Text,
      Review_Visit_Date: req.body.Review_Visit_Date,
      Review_Star: req.body.Review_Star,
      Attraction_Number: req.body.Attraction_Number,
      Attraction_Name: attraction.dataValues.Attraction_Name,
    },
    { where: { Review_Number: req.params.id } }
  );
  res.send(
    "<script>alert('리뷰 수정을 성공하였습니다!');window.location.href=\"/my_review\";</script>"
  );
});
router.delete("/my_review/:id", isLoggedIn, async (req, res) => {
  // id와 일치하는 리뷰 삭제
  await Review.destroy({
    where: { Review_Number: req.params.id },
  });
  const review = await Review.findAll({
    where: { creator: req.user.dataValues.nick },
  });
  res.render("my_review", { review });
});
router.get("/review/:name", async (req, res) => {
  const review = await Review.findAll({
    where: { Attraction_Name: req.params.name },
  });
  res.render("review", { review });
});
module.exports = router;
