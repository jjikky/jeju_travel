/*
제주도 여행 플랫폼 입니다.
- 관광지 장소별 리뷰 기능
- 관광 장소 검색 기능
- 숙소 조회/검색 기능
- 지역별 숙소 조회/검색기능
- 액티비티 모음 페이지
- 본인이 쓴 리뷰 페이지 구축해서 로그인 유저와 비로그인 유저 ui구분
- 리뷰 crud 기능
- 장소별 리뷰보기
- local, kakao 로그인 (passport활용)
- 기본데이터(관광지,숙소,액티비티 데이터)mysql에 자동 삽입 기능
*/
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const nunjucks = require("nunjucks");
const { sequelize } = require("./models");
const passport = require("passport");
const session = require("express-session");
const passportConfig = require("./passport");
const { insertData } = require("./routes/middlewares");
const methodOverride = require("method-override");
require("dotenv").config();

var indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

var app = express();

// view engine setup
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });
passportConfig();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use("/", indexRouter);
app.use("/", authRouter);

insertData(); // insert mysql data
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log("3000포트에서 실행중");
});
