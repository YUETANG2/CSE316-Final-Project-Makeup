// Tag Document Schema
const mongoose = require('mongoose');

var Schema = mongoose.Schema; 

var TagSchema = new Schema(
    {
        name: {type: String},
        create_by: {type: Schema.Types.ObjectId, ref: 'User'},
        other_users: [{type: Schema.Types.ObjectId, ref: 'User'}]
    }
);

TagSchema.virtual("url").get(function () {
    return 'posts/tag/' + this._id; 
});

module.exports = mongoose.model('Tag', TagSchema);
