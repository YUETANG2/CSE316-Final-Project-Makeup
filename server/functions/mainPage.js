let Questions = require("../models/questions.js");
let Tags = require("../models/tags.js");
let Answers = require("../models/answers.js");
let User = require("../models/users.js");

exports.get_user_by_id = async (userID) => {
  let user = await User.findById(userID);
  return user;
};

exports.all_questions_in_newest = async (res) => {
  try {
    let qstn_list = await Questions.find({});

    qstn_list.sort((qstn1, qstn2) => {
      return qstn2.ask_date_time - qstn1.ask_date_time;
    });

    res.send(qstn_list);
  } catch (err) {
    console.error(err);
  }
};

async function mostRecentAns(answersList) {
  //contains the answer_id
  let answerObjectList = [];

  answersList = answersList.answers;
  for (let index in answersList) {
    let answer = await Answers.findById(answersList[index].toString());
    answerObjectList.push(answer);
  }

  answerObjectList.sort((ans1, ans2) => {
    return ans2.ans_date_time - ans1.ans_date_time;
  });

  return answerObjectList[0];
}

exports.all_questions_in_active = async (res) => {
  try {
    let qstn_list = await Questions.find({ answers: { $ne: [] } });

    let n = qstn_list.length;
    let swapped;

    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        let mostRecentAnsDate1 = await mostRecentAns(qstn_list[i]);
        let mostRecentAnsDate2 = await mostRecentAns(qstn_list[i + 1]);
        if (
          mostRecentAnsDate1.ans_date_time - mostRecentAnsDate2.ans_date_time <=
          0
        ) {
          // Swap elements if they are in the wrong order
          let temp = qstn_list[i];
          qstn_list[i] = qstn_list[i + 1];
          qstn_list[i + 1] = temp;
          swapped = true;
        }
      }
      // Optimized: After each pass, the largest element will be sorted, so reduce the range of comparison
      n--;
    } while (swapped);

    let empty_ans_qstn_list = await Questions.find({ answers: { $eq: [] } });

    for (let qstn of empty_ans_qstn_list) {
      qstn_list.push(qstn);
    }

    res.send(qstn_list);
  } catch (err) {
    console.error(err);
  }
};

exports.all_questions_in_unanswered = async (res) => {
  try {
    let qstn_list = await Questions.find({ answers: [] });

    res.send(qstn_list);
  } catch (err) {
    console.error(err);
  }
};

exports.get_tag_by_id = async (id, res) => {
  try {
    let tag = await Tags.findById(id);
    console.log(tag);
    res.send(tag.name);
  } catch (err) {
    console.error(err);
  }
};

exports.get_qstns_by_tag = async (tag, res) => {
  try {
    let tag_id = await Tags.find({ name: tag });
    let qstns = await Questions.find({ tags: { $in: [tag_id[0]._id] } });
    res.send(qstns);
  } catch (err) {
    console.error(err);
  }
};

exports.get_qstns_by_keyword = async (keyword, res) => {
  try {
    let qstns = await Questions.find({
      $or: [
        { title: { $regex: new RegExp("\\b" + keyword + "\\b", "i") } },
        { text: { $regex: new RegExp("\\b" + keyword + "\\b", "i") } },
      ],
    });

    //console.log(qstns);
    res.send(qstns);
  } catch (err) {
    console.error(err);
  }
};
