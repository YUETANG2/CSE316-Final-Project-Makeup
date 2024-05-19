let Questions = require("../models/questions.js");
let Answers = require("../models/answers.js");
let Comments = require("../models/comments.js");
const { ObjectId } = require("mongodb");

exports.get_answers_page_data = async (qid, res) => {
  try {
    let question = await Questions.findById(qid);
    await question.populate("answers");
    ans_list = question.answers;

    ans_list.sort((ans1, ans2) => {
      return ans2.ans_date_time - ans1.ans_date_time;
    });
    //console.log("here is ans list" + ans_list);

    res.send(ans_list);
  } catch (err) {
    console.error(err);
  }
};

exports.get_answers_page_qstn = async (qid, res) => {
  try {
    let question = await Questions.findById(qid);
    newViewCount = question.views + 1;
    //console.log(newViewCount);
    await Questions.updateOne(
      { _id: qid },
      {
        $set: {
          views: newViewCount,
        },
      }
    );
    let q = await Questions.findById(qid);
    res.send(q);
  } catch (err) {
    console.error(err);
  }
};

exports.get_answer_by_id = async (ansId) => {
  let answer = await Answers.find({ _id: new ObjectId(ansId) });
  return answer[0];
};

exports.get_comment_by_id = async (commentId) => {
  let comment = await Comments.find({ _id: new ObjectId(commentId) });
  return comment[0];
};

exports.add_comment_by_id = async (userId, postId, comment) => {
  let newCommentData = {
    comment_by: userId, 
    text: comment
  }

  let newComment = await Comments.create(newCommentData)
  await newComment.save(); 

  let ans = await Answers.find({_id: new ObjectId(postId)});
  let qstn = await Questions.find({_id: new ObjectId(postId)});

  if(ans.length != 0){
    console.log(ans);
    ans[0].comments.unshift(newComment._id);
    await ans[0].save()
  }else{
    qstn[0].comments.unshift(newComment._id); 
    await qstn[0].save()
  }
}

exports.add_new_ans = async (newAnsData, userData, res) => {
  try{      
      let formData = {
          text: newAnsData.text, 
          ans_by: userData._id,
          comments: []
      }

      let newAns = await Answers.create(formData);
      await newAns.save(); 

      let question = await Questions.find({_id: new ObjectId(newAnsData.qId)});
      question[0].answers.unshift(newAns._id);
      await question[0].save();

      res.send('new answer added into MongoDB' + newAns); 
  }catch(err){
      console.error(err);
  }
}

