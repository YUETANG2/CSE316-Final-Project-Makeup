const express = require("express");
const router = express.Router();
let AnsPage = require("../functions/answersPage.js");
let SessionCheck = require("../functions/sessionCheck.js");

router.get("/getCommentData/:commentId", async function (req, res) {
    let commentId = req.params.commentId;
    let comment = await AnsPage.get_comment_by_id(commentId);
    res.send(comment);
  });

router.post("/addComment", async function (req, res){
    let postId = req.body.postId; 
    let comment = req.body.comment; 
    let user = await SessionCheck.get_login_user_2();

    console.log("INSIDE ADD COMMENT");
    console.log(postId);
    console.log(comment);

    try{
        await AnsPage.add_comment_by_id(user._id, postId, comment); 
        res.send("DONE");
    }catch(err){
        console.log(err);
        res.send("ERROR");
    }
})

module.exports = router;
