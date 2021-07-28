const express = require("express");
const mongoose = require("mongoose");
const songSchema = require("../schema/song");
const songRouter = express.Router();

const songModel = mongoose.model("songs", songSchema);

songRouter.post("/add/song", (req, res) => {
  var song = new songModel({
    title: req.body.title,
    album: req.body.album,
    artist: req.body.artist,
    image: req.body.image,
    file: req.body.file,
  });
  console.log(req.cookies);
  if (!req.cookies["name"]) {
    res.send("Not logged in").status(401);
  } else {
    song.save(function (err) {
      console.log(err);
    });
    res.send("Song saved!");
  }
});

module.exports = songRouter;
