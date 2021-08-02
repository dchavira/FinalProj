const express = require("express");
const mongoose = require("mongoose");
const userSchema = require("../schema/user");
const postRouter = express.Router();

const UserModel = mongoose.model("user", userSchema);

//Adding Song
//Check dups?
postRouter.post("/add/user", (req, res) => {
  var song = new UserModel(req.body);

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
postRouter.get("/find/:request/:name", (req, res) => {
  let subject = req.params.request.toLowerCase();
  let name = req.params.name.toLowerCase();
  name = name.charAt(0).toUpperCase() + name.slice(1);
  let search;

  /*THIS WOULD PROBABLY BE BETTER IF WE SEND THE INFO AS AN OBJECT AND SKIP 
  THIS PART TO SIMPLY FIND*/
  if (subject == "song") {
    search = { title: name };
  } else if (subject == "artist") {
    search = { artist: name };
  } else if (subject == "album") {
    search = { album: name };
  }

  UserModel.find(search).exec(function (err, results) {
    if (err) {
      throw err;
    } else if (results.length == 0) {
      res.send("No results found");
    } else {
      res.send(JSON.stringify(results));
    }
  });
});

module.exports = postRouter;
