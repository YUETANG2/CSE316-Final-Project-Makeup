const express = require("express");
const router = express.Router();
//const jwt = require("jsonwebtoken");

let registrationPage = require("../functions/registrationPage.js");
let SessionCheck = require("../functions/sessionCheck.js");

async function saveSession(req, userStatus, userId) {
  try {
    req.session.user = {
      userPermission: userStatus, //Guest, USER, ADMIN
      userId: userId, //default: Guest
    };
    //console.log(req.session);
  } catch (err) {
    console.err(err);
  }
}

router.post("/", async (req, res) => {
  let is_login = await SessionCheck.is_login();
  //console.log("WTF IS GOING ONNNNNNN");
  //console.log(req.session);

  if (is_login) {
    let user = await SessionCheck.get_login_user(is_login);
    await saveSession(req, user.user_status, user._id);
    res.send("PASS");
  } else {
    res.send("STOP");
  }
});

router.post("/sign-up", async (req, res) => {
  console.log("im inside sign up");
  //console.log(req.body);

  let newUser = await registrationPage.add_new_user(req.body);

  if (newUser != null) {
    //set up session
    //console.log(newUser);
    console.log("newUser: " + newUser);
    await saveSession(req, newUser.user_status, newUser._id);
    SessionCheck.update_login_status(newUser._id);

    res.send("PASS");
  } else {
    res.status(404).send({
      message: "You already have an account",
    });
  }
});

router.post("/log-in", async (req, res) => {
  let userData = await registrationPage.verify_user(req.body);

  if (userData.length != 0) {
    await saveSession(req, userData[0].user_status, userData[0]._id);
    SessionCheck.update_login_status(userData[0]._id);

    res.send("Sign in successfully");
  } else {
    res.status(404).send({
      message: "You have entered an invalid username or password",
    });
  }
});

router.get("/sign-out", async (req, res) => {
  SessionCheck.update_login_status("Guest");
  await saveSession(req, "Guest", "Guest");

  res.send("You sign out successfully");
});

router.get("/adminOrUser", async (req, res) => {
  let userData = await SessionCheck.get_login_user_2();
  res.send(userData.user_status);
})

router.get("/userStatus", async (req, res) => {
  //console.log(req.session);
  let userId = await SessionCheck.is_login();

  if (userId != null) {
    res.send("Guest");
  } else {
    res.send("User");
  }
});

module.exports = router;
