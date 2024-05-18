const express = require("express");
const router = express.Router();
let AnsPage = require("../functions/answersPage.js");

router.get("/getCommentData/:commentId", async function (req, res) {
    let commentId = req.params.commentId;
    let comment = await AnsPage.get_comment_by_id(commentId);
    res.send(comment);
  });


module.exports = router;
