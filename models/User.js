let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({

    username: { type: String },
    password: { type: String },

    dateOfCreate: { type: Date, default: Date.now },
    dateOfUpdate: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);