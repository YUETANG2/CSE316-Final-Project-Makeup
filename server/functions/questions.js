let Questions = require("../models/questions.js");
let Tags = require("../models/tags.js");
const { ObjectId } = require("mongodb");

/******************** Helper Functions *****************/

let add_new_user_to_tag = async (tag, user) => {
  console.log("hello" + tag.other_users);
  if (
    !tag.other_users.includes(user._id) &&
    tag.create_by.toString() != user._id.toString()
  ) {
    tag.other_users.push(user._id);
    await tag.save();
  }
  //console.log(tag);
};

let remove_tag_from_qstn = async (tagId, qstn) => {
  //console.log("trying to delete");
  //console.log(qstn.tags);
  //console.log(tagId);
  let indexToRemove = -1;
  for (let i in qstn.tags) {
    if (qstn.tags[i].valueOf() === tagId.valueOf()) {
      indexToRemove = i;
      break;
    }
  }

  if (indexToRemove === -1) {
    //console.log("Can't find the tag");
  } else {
    qstn.tags.splice(indexToRemove, 1);
    await qstn.save();

    //find if user's no other qstn using this tag
    let qstnsWithTag = await Questions.find({
      $and: [
        { asked_by: qstn.asked_by }, // Matches documents with the same asked_by value
        { tags: { $elemMatch: { $eq: tagId } } }, // Matches documents where tags array contains tagId
      ],
    });

   //console.log("all the questions");
   //console.log(qstnsWithTag);

    if (qstnsWithTag.length === 0) {
      let tag = await Tags.find({ _id: tagId });
      //console.log("User");
      //console.log(qstn.asked_by);

      //console.log(tag);
      let index = -1;
      for (let i in tag[0].other_users) {
        //console.log(tag[0].other_users[i].valueOf());
        //console.log(qstn.asked_by.valueOf());
        if (tag[0].other_users[i].valueOf() === qstn.asked_by.valueOf()) {
          index = i;
          break;
        }
      }

      if (index === -1) {
        //console.log("Can't find the user in the tag");
      } else {
        tag[0].other_users.splice(index, 1);
        await tag[0].save();
        //console.log(tag);
      }
    }
  }
  //console.log(qstn);
};


let remove_tag_from_qstn2 = async (tagId, qstn) => {
  //console.log("trying to delete");
  //console.log(qstn.tags);
  //console.log(tagId);
  let indexToRemove = -1;
  for (let i in qstn.tags) {
    if (qstn.tags[i].valueOf() === tagId.valueOf()) {
      indexToRemove = i;
      break;
    }
  }

  if (indexToRemove === -1) {
    console.log("Can't find the tag");
  } else {
    qstn.tags.splice(indexToRemove, 1);
    await qstn.save();
  }
  //console.log(qstn);
};

/******************** Main Functions *****************/

exports.modify_qstn = async (updatedQstnData, qstnID, userData, res) => {
  let qstn = await Questions.findById(qstnID);
  let existingTagIds = qstn.tags; //tag Ids
  let newTags = updatedQstnData.tags; //just the name

  let newTagsIds = [];

  for (let newTag of newTags) {
    let tag = await Tags.find({ name: newTag });

    if (tag.length > 0) {
      newTagsIds.push(tag[0]._id);
    } else {
      if (userData.reputation >= 50) {
        let Tag = await Tags.create({
          name: newTag,
          create_by: userData._id,
          other_users: [],
        });

        //console.log(Tag);
        newTagsIds.push(Tag._id);
      } else {
        res.status(404).send({
          message: "err-tag-reputation-points",
        });
      }
    }
  }

  let removedTagIds = existingTagIds.filter((tagId) => {
    let test = (tagId) => {
      for (let newTagsId of newTagsIds) {
        if (tagId.valueOf() === newTagsId.valueOf()) {
          return false;
        }
      }
      return true;
    };
    return test(tagId);
  });

  try {
    for (let tagId of removedTagIds) {
      await remove_tag_from_qstn(tagId, qstn);
    }
  } catch (err) {
    console.log(err);
  }

  let addedTagIds = newTagsIds.filter((newTag) => {
    let test = (newTag) => {
      for (let existingTagId of existingTagIds) {
        if (existingTagId.valueOf() === newTag.valueOf()) {
          return false;
        }
      }
      return true;
    };
    return test(newTag);
  });

  try {
    //modify the qstnData
    qstn.title = updatedQstnData.title;
    qstn.summary = updatedQstnData.summary;
    qstn.text = updatedQstnData.text;
    qstn.tags.push(...addedTagIds);
    await qstn.save();
    //console.log(qstn);
    res.send("Done");
  } catch (err) {
    console.error(err);
  }
};

exports.add_new_qstn = async (newQstnData, userData, res) => {
  let tagList = newQstnData.tags;
  let tagIdList = [];

  let isGood = true;

  for (let tag of tagList) {
    //console.log(tag);
    let tags = await Tags.find({ name: tag });

    if (tags.length != 0) {
      //include this user in this tag's userList
      await add_new_user_to_tag(tags[0], userData);
      tagIdList.push(tags[0]._id);
    } else {
      //user has enough reputation points
      if (userData.reputation >= 50) {
        let newTag = await Tags.create({
          name: tag,
          create_by: userData._id,
          other_users: [],
        });

        console.log(newTag);
        tagIdList.push(newTag._id);
      } else {
        res.status(404).send({
          message: "err-tag-reputation-points",
        });
        isGood = false;
      }
    }
  }

  try {
    if (isGood) {
      let formData = {
        title: newQstnData.title,
        summary: newQstnData.summary,
        text: newQstnData.text,
        tags: tagIdList,
        answers: [],
        upvote: 0,
        downvote: 0,
        asked_by: userData._id,
      };

      let newQstn = await Questions.create(formData);
      //console.log("this is the new question");
      //console.log(newQstn);
      await newQstn.save();
    }
    res.send("new question added into MongoDB");
  } catch (err) {
    console.error(err);
  }
};


let delete_tag = async (tagID) => {
  let tag = await Tags.findById(tagID);

  if (tag.other_users.length === 0) {
    try {
      const response = await Tags.deleteOne({ _id: tag._id });

      if (response.deletedCount !== 1) {
        console.log("Bookmark NOT_FOUND with id: " + bookmarkId);
      } else {
        let qstnList = await Questions.find({
          tags: { $elemMatch: { $eq: tagID } },
        });

        for (let qstn of qstnList) {
          await remove_tag_from_qstn2(tagID, qstn);
        }
        res.send("Done");
      }
    } catch (err) {
      console.error(err);
    }
  } 
};

exports.delete_qstn = (qstnId, res) => {
  //remove tags and update tag's userList

  //remove comments

  //remove answers

  //

  res.send("Done");
};

exports.get_qstn_by_id = async (qstnId) => {
  let qstnData = await Questions.find({_id: new ObjectId(qstnId)})
  //console.log(qstnData);
  return qstnData[0];
}

exports.increment_view_by_qstn_id = async(qstnId) => {
  let qstnData = await Questions.find({_id: new ObjectId(qstnId)})
  let qstn = qstnData[0]; 
  //console.log(qstn);
  qstn.views++; 
  await qstn.save(); 
}

exports.increment_upvotes_by_qstn_id = async(qstnId) => {
  let qstnData = await Questions.find({_id: new ObjectId(qstnId)})
  let qstn = qstnData[0]; 
  qstn.upvote++; 
  await qstn.save();
}

exports.increment_downvotes_by_qstn_id = async(qstnId) => {
  let qstnData = await Questions.find({_id: new ObjectId(qstnId)})
  let qstn = qstnData[0]; 
  qstn.downvote++; 
  await qstn.save();
}

