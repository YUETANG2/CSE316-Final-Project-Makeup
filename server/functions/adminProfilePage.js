let User = require("../models/users.js");
const { ObjectId } = require("mongodb");

exports.get_all_users = async () => {
  let usersList = await User.find({ user_status: { $ne: "ADMIN" } });
  console.log("ALL USERS");

  return usersList;
};