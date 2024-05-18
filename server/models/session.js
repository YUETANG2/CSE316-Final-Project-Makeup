// Tag Document Schema
const mongoose = require('mongoose');

var Schema = mongoose.Schema; 

var SessionSchema = new Schema(
    {
        user: {type: String, default: "Guest"}
    }
);

SessionSchema.virtual("url").get(function () {
    return 'posts/session/' + this._id; 
});

module.exports = mongoose.model('Session', SessionSchema);