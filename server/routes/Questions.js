const express = require("express");
const router = express.Router();
let Questions = require("../functions/questions.js");
let MainPage = require("../functions/mainPage.js");
let SessionCheck = require("../functions/sessionCheck.js");
let UserProfilePage = require("../functions/userProfliePage.js");
let AnswersPage = require("../functions/answersPage.js")

router.get("/getAllQstns", function (req, res) {
  let filter = req.query.filter;
  //console.log(filter);

  if (filter === "newest") {
    MainPage.all_questions_in_newest(res);
  } else if (filter === "active") {
    MainPage.all_questions_in_active(res);
  } else if (filter === "unanswered") {
    MainPage.all_questions_in_unanswered(res);
  }
});

router.get("/userName", async function (req, res) {
  let userId = req.query.name;
  let user = await MainPage.get_user_by_id(userId);
  return res.send(user.first_name + " " + user.last_name);
});

router.get("/getQstnsByKeyWord", function (req, res) {
  let keyword = req.query.keyword;
  //console.log(keyword);
  MainPage.get_qstns_by_keyword(keyword, res);
});

router.get("/getQstnsByTag", function (req, res) {
  let tag = req.query.tagName;
  //console.log(tag);
  MainPage.get_qstns_by_tag(tag, res);
});

router.post("/addNewQstn", async function (req, res) {
  let newQuestionData = req.body;
  let user = await SessionCheck.get_login_user_2();
  Questions.add_new_qstn(newQuestionData, user, res);
});

router.get("/getQstnById", async function (req, res) {
  let qstnId = req.query.qstnId;
  let userId = req.query.userId; 
  let qstnData = await Questions.get_qstn_by_id(qstnId);

  if(userId === "-"){
    console.log("DO NOTHING")
  }else if(userId === "*"){
    let userData = await SessionCheck.get_login_user_2();
    let uid = userData._id; 
    let ansList = await AnswersPage.sort_answers_by_user(uid, qstnData.answers); 
    qstnData.answers = ansList;
  }else {
    let ansList = await AnswersPage.sort_answers_by_user(userId, qstnData.answers); 
    qstnData.answers = ansList;
  }

  res.send(qstnData);
});

router.post("/incrementViewOfQstnById", async function (req, res) {
  let qstnId = req.body.qstnId;
  //console.log("Try to get into here");
  //console.log(qstnId)
  Questions.increment_view_by_qstn_id(qstnId);
  res.send("DONE");
});

router.post("/incrementUpvoteById", async function (req, res) {
  let userData = await SessionCheck.get_login_user_2();

  if (userData.reputation >= 50) {
    let qstnId = req.body.qstnId;
    let ask_by = req.body.ask_by;

    Questions.increment_upvotes_by_qstn_id(qstnId);
    UserProfilePage.change_reputation_by(ask_by, 5);
    res.send("DONE");
  } else {
    res.send("Not enough reputation to vote");
  }
});


router.post("/incrementDownvoteById", async function (req, res) {
  let userData = await SessionCheck.get_login_user_2();

  if (userData.reputation >= 50) {
    let qstnId = req.body.qstnId;
    let ask_by = req.body.ask_by;

    Questions.increment_downvotes_by_qstn_id(qstnId);
    UserProfilePage.change_reputation_by(ask_by, -10);
    res.send("DONE");
  } else {
    res.send("Not enough reputation to vote");
  }
});

module.exports = router;
