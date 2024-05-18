let Tags = require("../models/tags.js");
let Questions = require("../models/questions.js");

const { ObjectId } = require("mongodb");

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
    console.log("Can't find the tag");
  } else {
    qstn.tags.splice(indexToRemove, 1);
    await qstn.save();
  }
  //console.log(qstn);
};

exports.delete_tag = async (tagID, res) => {
  let tag = await Tags.findById(tagID);

  if (tag.other_users.length === 0) {
    try {
      const response = await Tags.deleteOne({ _id: tag._id });

      if (response.deletedCount !== 1) {
        throw new NotFoundError("Bookmark NOT_FOUND with id: " + bookmarkId);
      } else {
        let qstnList = await Questions.find({
          tags: { $elemMatch: { $eq: tagID } },
        });

        for (let qstn of qstnList) {
          await remove_tag_from_qstn(tagID, qstn);
        }
        res.send("Done");
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(404).send({
      message: "err-tag-in-use",
    });
  }
};

exports.modify_tag = async (updatedTagData, tagID, res) => {
  let tag = await Tags.findById(tagID);
  let newTagName = updatedTagData.name; //just the name
  console.log("NEW TAG NAME");
  console.log(newTagName);

  if (tag.name != newTagName) {
    if (tag.other_users.length === 0) {
      try {
        //modify the tagData
        tag.name = newTagName;
        await tag.save();
        console.log(tag);
      } catch (err) {
        console.error(err);
      }
    } else {
      res.status(404).send({
        message: "err-tag-in-use",
      });
    }
  }
  res.send("Done");
};

exports.get_all_tags = async (res) => {
  try {
    let tags_list = await Tags.find({});
    //console.log("here are the tags" + tags_list);
    res.send(tags_list);
  } catch (err) {
    console.error(err);
  }
};

exports.get_tag_num_of_qstns = async (res) => {
  try {
    let tags_list = await Tags.find({});
    //NOT COMPLETE
    res.send(tags_list);
  } catch (err) {
    console.error(err);
  }
};
