const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SongSchema = new Schema({
  title: String,
  album: String,
  artist: String,
  image: String,
  file: String,
});

module.exports = SongSchema;
