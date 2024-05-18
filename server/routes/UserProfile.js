const express = require("express");
const router = express.Router();
let SessionCheck = require("../functions/sessionCheck.js");
let userProfilePage = require("../functions/userProfliePage.js");
let adminProfilePage = require("../functions/adminProfilePage.js");
let Questions = require("../functions/questions.js");
let Tags = require("../functions/tagsPage.js");
let MainPage = require("../functions/mainPage.js");

router.get("/allUsers", async function (req, res) {
  console.log("Get all users");
  let userData = await SessionCheck.get_login_user_2();

  console.log(userData.user_status);
  if (userData.user_status === "ADMIN") {
    //get all users
    let usersList = await adminProfilePage.get_all_users();
    res.send(usersList);
  } else {
    res.status(404).send({
      message: "You dont have access to all user data",
    });
  }
});

router.get("/allQstns/:userId", async function (req, res) {
  console.log("Im inside allQstns from the user Profile page");
  let userId = req.params.userId;
  if (userId === "*") {
    userId = await SessionCheck.is_login();
  } else {
    //check if it's ADMIN
    let userData = await SessionCheck.get_login_user_2();

    if (userData.user_status !== "ADMIN") {
      res.status(404).send({
        message: "You dont have access right to view user profile",
      });
    }
  }
  let allQstns = await userProfilePage.get_all_qstns_by_user(userId);
  //console.log(allQstns);
  res.send(allQstns);
});

router.get("/allAns/:userId", async function (req, res) {
  let userId = req.params.userId;
  if (userId === "*") {
    userId = await SessionCheck.is_login();
  } else {
    //check if it's ADMIN
    let userData = await SessionCheck.get_login_user_2();

    if (userData.user_status !== "ADMIN") {
      res.status(404).send({
        message: "You dont have access right to view user profile",
      });
    }
  }
  let allQstns = await userProfilePage.get_all_qstns_answered_by_user(userId);
  //console.log(allQstns);
  res.send(allQstns);
});

router.get("/allTags/:userId", async function (req, res) {
  let userId = req.params.userId;
  if (userId === "*") {
    userId = await SessionCheck.is_login();
  } else {
    //check if it's ADMIN
    let userData = await SessionCheck.get_login_user_2();

    if (userData.user_status !== "ADMIN") {
      res.status(404).send({
        message: "You dont have access right to view user profile",
      });
    }
  }
  let allTags = await userProfilePage.get_all_tags_created_by_user(userId);

  //console.log("HERE ARE ALL THE TAGS");
  //console.log(allTags);
  res.send(allTags);
});

router.get("/getUsername/:userId", async function (req, res) {
  let userId = req.params.userId;
  if (userId === "*") {
    userId = await SessionCheck.is_login();
  } else {
    //check if it's ADMIN
    let userData = await SessionCheck.get_login_user_2();

    if (userData.user_status !== "ADMIN") {
      res.status(404).send({
        message: "You dont have access right to view user profile",
      });
    }
  }

  let username = await SessionCheck.get_username(userId);
  return res.send(username);
});

router.get("/getReputation/:userId", async function (req, res) {
  let userId = req.params.userId;
  if (userId === "*") {
    userId = await SessionCheck.is_login();
  } else {
    //check if it's ADMIN
    let userData = await SessionCheck.get_login_user_2();

    if (userData.user_status !== "ADMIN") {
      res.status(404).send({
        message: "You dont have access right to view user profile",
      });
    }
  }
  let reputation = await SessionCheck.get_login_user_reputation_2(userId);
  return res.send(reputation);
});

router.get("/getDateJoined/:userId", async function (req, res) {
  let userId = req.params.userId;
  if (userId === "*") {
    userId = await SessionCheck.is_login();
  } else {
    //check if it's ADMIN
    let userData = await SessionCheck.get_login_user_2();

    if (userData.user_status !== "ADMIN") {
      res.status(404).send({
        message: "You dont have access right to view user profile",
      });
    }
  }
  let date = await SessionCheck.get_login_user_date_joined(userId);

  return res.send(date);
});

router.get("/getQstnById/:qstnId", async function (req, res) {
  let qstnId = req.params.qstnId;
  let qstnData = await userProfilePage.get_qstnData_by_qstnID(qstnId);
  return res.send(qstnData);
});

router.post("/modifyQstn", async function (req, res) {
  let updatedQstnData = req.body;
  let qstnID = updatedQstnData.qstnId;
  console.log(updatedQstnData);
  console.log(qstnID);
  let userData = await SessionCheck.get_login_user_2();

  console.log(userData);
  try {
    Questions.modify_qstn(updatedQstnData, qstnID, userData, res);
  } catch (err) {
    console.log(err);
  }
});

router.get("/deleteQstn/:qstnId", async function (req, res) {
  let qstnId = req.params.qstnId;
  await Questions.delete_qstn(qstnId, res);
});

router.get("/getTagById/:tagId", function (req, res) {
  let tagId = req.params.tagId;
  console.log("This is the id: " + tagId);
  MainPage.get_tag_by_id(tagId, res);
});

router.post("/modifyTag", async function (req, res) {
  let updatedTagData = req.body;
  let tagID = updatedTagData.tagId;
  console.log(updatedTagData);
  console.log(tagID);

  try {
    Tags.modify_tag(updatedTagData, tagID, res);
  } catch (err) {
    console.log(err);
  }
});

router.post("/deleteTag", async function (req, res) {
  let tagData = req.body;
  let tagID = tagData.tagId;
  console.log(tagID);

  try {
    Tags.delete_tag(tagID, res); 
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
