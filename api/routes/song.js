const express = require("express");
const mongoose = require("mongoose");
const postSchema = require("../schema/posts");
const songSchema = require("../schema/song");
const songRouter = express.Router();

const PostModel = mongoose.model("post", postSchema);
const SongModel = mongoose.model("song", songSchema);

//Adding Song
songRouter.post("/add/song", (req, res) => {
  var song = new SongModel(req.body);

  if (!req.cookies["name"]) {
    res.send("Not logged in").status(401);
  } else {
    song.save(function (err) {
      console.log(err);
    });
    res.send("Song saved!");
  }
});

//Find Song(s)/Artists/Albums
songRouter.get("/find/:name", (req, res) => {
  let name = req.params.name;

  PostModel.find({}).populate('song').sort({Date: -1}).exec(function (err, results){
    var matches = []
    for (i in results) {
      if (results[i].song.title == name) {matches.push(results[i])
      } else if (results[i].song.artist == name) {matches.push(results[i])
      } else if (results[i].song.album == name) {matches.push(results[i])
      }
    }
    res.send(JSON.stringify(matches))
  })
})


module.exports = songRouter;
