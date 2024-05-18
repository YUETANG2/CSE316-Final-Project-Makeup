// Comment Document Schema
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  text: { type: String, required: true, maxLength: 140},
  comment_by: {type: Schema.Types.ObjectId, ref: 'User'},
  comment_date_time: { type: Date, default: Date.now },
  upvote: {type: Number, default: 0},
});

CommentSchema.virtual("url").get(function () {
    return 'posts/comment/'+ this._id; 
});

module.exports = mongoose.model("Comment", CommentSchema);