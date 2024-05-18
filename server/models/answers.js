// Answer Document Schema
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  text: { type: String },
  ans_by: {type: Schema.Types.ObjectId, ref: 'User'},
  ans_date_time: { type: Date, default: Date.now },
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  upvote: {type: Number, default: 0},
  downvote: {type: Number, default: 0}
});

AnswerSchema.virtual("url").get(function () {
    return 'posts/answer/'+ this._id; 
});

module.exports = mongoose.model("Answer", AnswerSchema);
