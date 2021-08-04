const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SongSchema = new Schema({
  title: String,
  artist: String,
  album: String
});

module.exports = SongSchema;
