// |----------------| Require Libraries |----------------| //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
// |----------------| Require Libraries |----------------| //

// |-------------------| User Schema |-------------------| //
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// |-------------------| User Schema |-------------------| //

// === User Schema Passport Plugin === //
/* Adds 2 Mongoose camps that we don't see, this are "user" (makes it unique for every user) and "password" */
UserSchema.plugin(passportLocalMongoose);

// === User Schema Export === //
module.exports = mongoose.model('User', UserSchema);