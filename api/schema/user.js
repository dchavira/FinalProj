const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  image: String,
  topSongs: [],
  userPosts: [],
});

module.exports = UserSchema;
