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
songRouter.get("/find/:request/:name", (req, res) => {
  let subject = req.params.request;
  let name = req.params.name;
  let search;

  if (subject == "song") {
    search = { title: name };
  } else if (subject == "artist") {
    search = { artist: name };
  } else if (subject == "album") {
    search = { album: name };
  }
  
  SongModel.find(search).exec(function (err, results) {
    var matches = []
    if (err) {throw err; } 
    else {
      for (i in results) {
        PostModel.findOne({song: results[i]._id})
        .populate('song')
        .exec(function (error, post){
          if (error) {console.log(error) }
          else {
            matches.push(post)
            console.log("pushed")
          }
        })
      }
      console.log("bye")
    res.send(JSON.stringify(matches))
    }
  })
  
})


module.exports = songRouter;
