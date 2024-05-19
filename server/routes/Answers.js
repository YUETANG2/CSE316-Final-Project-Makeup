const express = require("express");
const router = express.Router();
let AnsPage = require("../functions/answersPage.js");
let SessionCheck = require("../functions/sessionCheck.js");

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


router.post("/incrementView/")


module.exports = router;
