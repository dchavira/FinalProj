const mongoose = require("mongoose");
const Song = require("./song");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  username: String,
  text: String,
  date: {type: Date, default: Date.now},
  song: Song || null,
});
module.exports = PostSchema;
