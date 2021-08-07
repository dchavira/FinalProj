const express = require("express");
const mongoose = require("mongoose");
const postSchema = require("../schema/posts");
const songSchema = require("../schema/song");
const postRouter = express.Router();

const PostModel = mongoose.model("post", postSchema);
const SongModel = mongoose.model("song", songSchema);

//Adding Song
//Check dups?
postRouter.post("/add/post", (req, res) => {
  let postObj = JSON.parse(req.body.post);
  var newSong = new SongModel(postObj.song);
  
  try {
    newSong.save((err) => {
      if (err) console.log(err);
    });
    postObj.date = new Date();
    postObj.song = newSong._id;
    var post = new PostModel(postObj)
    post.save((err) => {
      if (err) console.log(err);
    });
    res.status(200).send("post succesful!");
  } catch (err) {
    res.status(500).send(err);
  }
});
//Get all posts
postRouter.get("/get/posts", (req, res) => {
  
  PostModel.find({})
    .populate('song')
    .sort({ date: -1 })
    .exec((err, results) => {
      if (err) {
      res.send(err)}
      else {
        res.status(200).send(JSON.stringify(results));
      }
    });
});

//Get Post by user
postRouter.get("/get/:username", (req, res) => {
  const user = req.params.username;
  PostModel.find({ username: user })
    .populate('song')
    .sort({ date: -1 })
    .exec((err, results) => {
      if (err) {res.send(err)}
      else {
        res.status(200).send(JSON.stringify(results));
      }
    });
});

//Delete Post
postRouter.post("/delete", (req, res) => {
  var id = req.body.id;
  PostModel.deleteOne({ _id: id }).exec((err, results) => {
    if (err) {res.send(err)}
    else res.send("deleted");
  });
});

module.exports = postRouter;
