const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SongSchema = new Schema({
  title: String,
  album: String,
  artist: String
});

module.exports = SongSchema;
