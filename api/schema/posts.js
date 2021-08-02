const mongoose = require("mongoose");
const Song = require("./song");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  username: String,
  text: String,
  image: String,
  date: String,
  song: Song || null,
});
module.exports = PostSchema;
