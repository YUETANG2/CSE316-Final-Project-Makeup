let Questions = require("../models/questions.js");
let Answers = require("../models/answers.js");
let Tags = require("../models/tags.js");
const { ObjectId } = require("mongodb");

exports.get_all_qstns_by_user = async (UserId) => {
  let allQstnsList = await Questions.find({ asked_by: new ObjectId(UserId) });
  return allQstnsList;
};

exports.get_all_tags_created_by_user = async (userId) => {
  try {
    let tags_list = await Tags.find({ create_by: new ObjectId(userId) });
    return tags_list;
  } catch (err) {
    console.log(err);
  }
};

exports.get_all_qstns_answered_by_user = async (UserId) => {
  let Id = new ObjectId(UserId);
  let allAnsList = await Answers.find({ ans_by: Id });
  let allQstnsList = await Questions.find({ answers: { $in: allAnsList } });

  allQstnsList.sort((qstn1, qstn2) => {
    return qstn2.ask_date_time - qstn1.ask_date_time;
  });

  return allQstnsList;
};

exports.get_qstnData_by_qstnID = async (qstnId) => {
  let qstnList = await Questions.find({ _id: new ObjectId(qstnId) });
  let qstn = qstnList[0];
  let tagIdList = qstn.tags;
  let tagNameList = "";

  for (let tagId of tagIdList) {
    let tagData = await Tags.find({ _id: tagId });
    if (tagData.length > 0) {
      tagNameList += tagData[0].name + " ";
    }
  }

  let qstnData = {
    title: qstn.title,
    summary: qstn.summary,
    text: qstn.text,
    tags: tagNameList,
  };

  return qstnData;
};
