const mongoose = require("mongoose");
const Song = require("./song");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  username: string,
  text: string,
  image: string,
  song: Song,
});
module.exports = PostSchema;
