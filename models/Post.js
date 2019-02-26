let mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

let Schema = mongoose.Schema;


let PostSchema = new Schema({
    user: { type: String },

    title: { type: String },
    content: { type: String },
    image: { type: String },
    categories: [{ type: String }],

    hashTags: [{ type: String }],
    comments: [{ type: String }],

    views: { type: Number },

    dateOfCreate: { type: Date, default: Date.now },
    dateOfUpdate: { type: Date }

});

PostSchema.plugin(mongoosePaginate);

PostSchema.index({"title": "text"});

module.exports = mongoose.model('Post', PostSchema);