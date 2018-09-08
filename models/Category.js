let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CategorySchema = new Schema({

    name: { type: String },
    description: { type: String },

    dateOfCreate: { type: Date, default: Date.now },
    dateOfUpdate: { type: Date }
});

module.exports = mongoose.model('Category', CategorySchema);