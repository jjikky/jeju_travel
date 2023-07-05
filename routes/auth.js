const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.post("/sign", isNotLoggedIn, async (req, res, next) => {
  // 로그인 요청 처리
  const { email, password, nick, phone } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } }); // 가입된 유저인지 확인
    if (exUser) {
      return res.redirect("/sign?error=exist");
    }
    const hash = await bcrypt.hash(password, 12); //비밀번호 암호화
    await User.create({
      email,
      nick,
      password: hash,
      phone,
    });
    return res.redirect("/success");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    // local strategy를 이용해 로그인
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      // 로그인 실패
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout(req.user, (err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      //세션삭제
      req.session;
    });
    res.redirect("/");
  });
});

router.get("/kakao", passport.authenticate("kakao")); // 카카오로그인
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);
module.exports = router;
