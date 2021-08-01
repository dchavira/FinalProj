const express = require("express");
const mongoose = require("mongoose");
const songSchema = require("../schema/song");
const songRouter = express.Router();

const SongModel = mongoose.model("songs", songSchema);

//Adding Song
//Check dups?
songRouter.post("/add/song", (req, res) => {
  var song = new SongModel(req.body);
  /*var song = new SongModel({
    title: req.body.title,
    album: req.body.album,
    artist: req.body.artist,
    image: req.body.image,
    file: req.body.file,
  });*/
  
  if (!req.cookies["name"]) {
    res.send("Not logged in").status(401);
  } else {
    song.save(function (err) { console.log(err); });
    res.send("Song saved!");
  }
})

//Find Song(s)/Artists/Albums
songRouter.get("/find/:request/:name", (req, res) => {
  let subject = req.params.request.toLowerCase();
  let name = req.params.name.toLowerCase();
  name = name.charAt(0).toUpperCase() + name.slice(1);
  let search;
  
  /*THIS WOULD PROBABLY BE BETTER IF WE SEND THE INFO AS AN OBJECT AND SKIP 
  THIS PART TO SIMPLY FIND*/
  if (subject == "song") {
    search = {title: name}
  } else if (subject == "artist") {
    search = {artist: name}
  } else if (subject == "album") {
    search = {album: name}
  }

  SongModel.find(search).exec(function(err, results) {
    if (err) { throw err
    } else if (results.length == 0) {
      res.send("No results found");
    }else {
      res.send(JSON.stringify(results));
    }
  })
})


module.exports = songRouter;
