const express = require("express");
const router = express.Router();
let AnsPage = require("../functions/answersPage.js");
let SessionCheck = require("../functions/sessionCheck.js");
let UserProfilePage = require("../functions/userProfliePage.js");

router.get("/getAnswersPageData", function (req, res) {
  let qid = req.query.id;
  AnsPage.get_answers_page_data(qid, res);
});

router.get("/getAnswersPageQstn", function (req, res) {
  let qid = req.query.id;
  AnsPage.get_answers_page_qstn(qid, res);
});

router.get("/getUsername/:userId", async function (req, res) {
  let userId = req.params.userId;

  let username = await SessionCheck.get_username(userId);
  return res.send(username);
});

router.get("/getAnswerData/:ansId", async function (req, res) {
  let andId = req.params.ansId;
  let answer = await AnsPage.get_answer_by_id(andId);
  res.send(answer);
});

router.post("/addNewAnswer", async function (req, res) {
  let newAnswerData = req.body;
  console.log(newAnswerData);
  let user = await SessionCheck.get_login_user_2();
  AnsPage.add_new_ans(newAnswerData, user, res);
});

router.post("/incrementUpvoteById", async function (req, res) {
  let userData = await SessionCheck.get_login_user_2();

  if (userData.reputation >= 50) {
    let ansId = req.body.ansId;
    let ans_by = req.body.ans_by;

    AnsPage.increment_upvotes_by_ans_id(ansId);
    UserProfilePage.change_reputation_by(ans_by, 5);

    res.send("DONE");
  } else {
    res.send("Not enough reputation to vote");
  }
});

router.post("/incrementDownvoteById", async function (req, res) {
  let userData = await SessionCheck.get_login_user_2();

  if (userData.reputation >= 50) {
    let ansId = req.body.ansId;
    let ans_by = req.body.ans_by;

    AnsPage.increment_downvotes_by_ans_id(ansId);
    UserProfilePage.change_reputation_by(ans_by, -10);
    res.send("DONE");
  } else {
    res.send("Not enough reputation to vote");
  }
});


//this is not working 
router.get("/canModifyAnswer", async function (req, res) {
  let ans_by = req.query.ans_by;
  let pageStatus = req.query.pageStatus;

  console.log("CAN I MODIFY ANS"); 
  console.log(ans_by);
  console.log(pageStatus);
  let isSent = false; 

  if (pageStatus === "-") {
    console.log("DO NOTHING");
  } else if (pageStatus === "*") {
    let user = await SessionCheck.get_login_user_2();
    if (user._id.toString() === ans_by.toString()) {
      console.log("THIS IS TRUE 1")
      isSend = true; 
      res.send("true");
    }
  } else {
    if (ans_by.toString() === pageStatus.toString()) {
      console.log("THIS IS TRUE 2")
      isSend = true; 
      res.send("true");
    }
  }

  if(!isSent){
    res.send("false");
  }
});

module.exports = router;
