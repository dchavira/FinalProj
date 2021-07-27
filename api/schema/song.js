const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SongSchema = new Schema({
  title: string,
  album: string,
  artist: string,
  image: image,
  file: string,
});

module.exports = SongSchema;
