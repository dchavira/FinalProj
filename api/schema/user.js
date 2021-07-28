const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  friends: [],
  topSongs: [],
  userPosts: [],
});

module.exports = UserSchema;
