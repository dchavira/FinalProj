const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  image: String,
});

module.exports = UserSchema;
