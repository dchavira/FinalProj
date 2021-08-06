const mongoose = require("mongoose");
const Song = require("./song");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  username: String,
  text: String,
  image: String,
  date: {type: Date, default: Date.now},
  song: {type: Schema.Types.ObjectId, ref: 'SongModel'} || null,
});
module.exports = PostSchema;
