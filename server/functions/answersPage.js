let Questions = require("../models/questions.js");
let Answers = require("../models/answers.js");
let Comments = require("../models/comments.js");
let Users = require("../models/users.js");

let UserProfilePage = require("../functions/userProfliePage.js");

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
    text: comment,
  };

  let newComment = await Comments.create(newCommentData);
  await newComment.save();

  let ans = await Answers.find({ _id: new ObjectId(postId) });
  let qstn = await Questions.find({ _id: new ObjectId(postId) });

  if (ans.length != 0) {
    console.log(ans);
    ans[0].comments.unshift(newComment._id);
    await ans[0].save();
  } else {
    qstn[0].comments.unshift(newComment._id);
    await qstn[0].save();
  }
};



exports.add_new_ans = async (newAnsData, userData, res) => {
  try {
    let formData = {
      text: newAnsData.text,
      ans_by: userData._id,
      comments: [],
    };

    let newAns = await Answers.create(formData);
    await newAns.save();

    let question = await Questions.find({ _id: new ObjectId(newAnsData.qId) });
    question[0].answers.unshift(newAns._id);
    await question[0].save();

    res.send("new answer added into MongoDB" + newAns);
  } catch (err) {
    console.error(err);
  }
};

exports.increment_comment_upvotes_by_id = async (commentId) => {
  let commentData = await Comments.find({ _id: new ObjectId(commentId) });
  let comment = commentData[0];
  comment.upvote++;
  await comment.save();
};

exports.increment_upvotes_by_ans_id = async (ansId) => {
  let ansData = await Answers.find({ _id: new ObjectId(ansId) });
  let ans = ansData[0];
  ans.upvote++;
  await ans.save();
};

exports.increment_downvotes_by_ans_id = async (ansId) => {
  let ansData = await Answers.find({ _id: new ObjectId(ansId) });
  let ans = ansData[0];
  ans.downvote++;
  await ans.save();
};

let get_answer_by_id = async (ansId) => {
  let answer = await Answers.find({ _id: ansId });
  return answer[0];
};

exports.sort_answers_by_user = async (userId, answersList) => {
  let answersList1 = [];
  let answersList2 = [];

  for (let ansId of answersList) {
    let ans = await get_answer_by_id(ansId);

    if (ans.ans_by.toString() === userId.toString()) {
      answersList1.push(ansId);
    } else {
      answersList2.push(ansId);
    }
  }

  return [...answersList1, ...answersList2];
};

exports.edit_answer_id = async (ansId, text, res) => {
  let answer = await Answers.find({ _id: ansId });
  answer[0].text = text;
  await answer[0].save();
  res.send("DONE");
};

let delete_ansId_from_qstn = async (ansId, qstnId) => {
  let qstnData = await Questions.find({ _id: new ObjectId(qstnId) });
  let qstn = qstnData[0];
  let newAnswersList = qstn.answers.filter(
    (answersId) => answersId.toString() !== ansId.toString()
  );
  qstn.answers = newAnswersList;
  await qstn.save();
};

let delete_comment_by_id = async (commentId) => {
  await Comments.deleteOne({ _id: commentId});
}


exports.delete_answer_by_id = async (ansId, qstnId, res) => {
  let ans = await Answers.find({ _id: new ObjectId(ansId)});
  let answer = ans[0];

  let reputation_change = answer.upvote * -5 + answer.downvote * 10;
  UserProfilePage.change_reputation_by(
    answer.ans_by.toString(),
    reputation_change
  );

  delete_ansId_from_qstn(ansId, qstnId);

  for(let commentId of answer.comments){
    await delete_comment_by_id(commentId);
  }
  await Answers.deleteOne({ _id: new ObjectId(ansId) });
  res.send("DONE");
};

exports.delete_comment_by_id = async (commentId) => {
  await Comments.deleteOne({ _id: commentId});
}