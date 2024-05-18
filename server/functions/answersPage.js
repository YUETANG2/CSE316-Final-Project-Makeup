let Questions = require("../models/questions.js");
let Answers = require("../models/answers.js");
const { ObjectId } = require("mongodb");

exports.get_answers_page_data = async (qid, res) => {
  try {
    let question = await Questions.findById(qid);
    await question.populate("answers");
    ans_list = question.answers;

    ans_list.sort((ans1, ans2) => {
      return ans2.ans_date_time - ans1.ans_date_time;
    });
    console.log("here is ans list" + ans_list);

    res.send(ans_list);
  } catch (err) {
    console.error(err);
  }
};

exports.get_answers_page_qstn = async (qid, res) => {
  try {
    let question = await Questions.findById(qid);
    newViewCount = question.views + 1;
    console.log(newViewCount);
    await Questions.updateOne(
      { _id: qid },
      {
        $set: {
          views: newViewCount,
        },
      }
    );
    let q = await Questions.findById(qid);
    console.log("here is q" + q);

    res.send(q);
  } catch (err) {
    console.error(err);
  }
};

exports.get_answer_by_id = async (ansId) => {
  let answer = await Answers.find({ _id: new ObjectId(ansId) });
  return answer[0];
};
