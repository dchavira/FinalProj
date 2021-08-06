const express = require("express");
const mongoose = require("mongoose");
const songSchema = require("../schema/song");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const UserSchema = require("../schema/user");

const SongModel = mongoose.model("songs", songSchema);
const UserModel = mongoose.model("users", UserSchema);

//Adding Song
//Check dups?
userRouter.post("/add/song", (req, res) => {
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
userRouter.get("/find/:request/:name", (req, res) => {
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

  SongModel.find(search).exec(function (err, results) {
    if (err) {
      throw err;
    } else if (results.length == 0) {
      res.send("No results found");
    } else {
      res.send(JSON.stringify(results));
    }
  });
});

//change username
userRouter.post("/change/username", (req, res) => {
  let data = JSON.parse(req.body.user);
  UserModel.find({ username: data.username }).exec(async (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results.length === 1) {
        results[0].username = data.newUsername;
        results[0].save();
        res.cookie("login", {username: data.newUsername});
        res.clearCookie(data.username);
        res.status(200).send("Username Changed");
      } else {
        res.status(401).send("User doesn't exists");
      }
    }
  });
});

//change password
userRouter.post("/change/password", async (req, res) => {
  let data = JSON.parse(req.body.user);
  UserModel.find({ username: data.username }).exec(async (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results.length === 1) {
        const salt = await bcrypt.genSalt(10);
        bcrypt.hash(data.password, salt).then(async (hash) => {
          //console.log(results[0].password);
          results[0].password = hash;
          results[0].save();
          res.status(200).send("Password Changed");
        });
      } else {
        res.status(401).send("User doesn't exists");
      }
    }
  });
});

//delete user
userRouter.delete("/delete/:username", (req, res) => {
  var user = req.params.username;
  UserModel.deleteOne({ username: user }).exec((err, results) => {
    if (err) res.send(err);
    else res.send("deleted");
  });
});
module.exports = userRouter;
