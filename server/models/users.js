// User Document Schema
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  join_date: { type: Date, default: Date.now },
  reputation: { type: Number, default: 0 },
  user_status: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
});

UserSchema.virtual("url").get(function () {
  return "posts/user/" + this._id;
});

module.exports = mongoose.model("User", UserSchema);
