// Question Document Schema
const mongoose = require('mongoose');

var Schema = mongoose.Schema; 

var QuestionSchema = new Schema(
    {
        title: {type: String, required: true, maxLength: 100},
        summary: {type: String, required: true, maxLength: 140}, 
        text: {type: String},
        tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
        answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        asked_by: {type: Schema.Types.ObjectId, ref: 'User'},
        ask_date_time: {type: Date, default: Date.now},
        views: {type: Number, default: 0},
        upvote: {type: Number, defaut: 0},
        downvote: {type: Number, defult: 0}
    }
);

QuestionSchema.virtual("url").get(function () {
    return 'posts/question/'+ this._id; 
});


module.exports = mongoose.model('Question', QuestionSchema);