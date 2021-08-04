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
  let post = JSON.parse(req.body.post);
  var newSong = new SongModel(post.song);
  var post = new PostModel({
    username: post.username,
    text: post.text,
    image: post.image,
    date: Date(),
    song: newSong,
  });
  try {
    newSong.save((err) => {
      if (err) console.log(err);
    });
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
  const posts = PostModel.find().exec((err, results) => {
    if (err) res.send(error);
    else {
      try {
        results[0].delete;
      } catch (err) {
        console.log(err);
      }
      res.status(200).send(results);
    }
  });
});

//Delete Post
postRouter.delete("/delete", (req, res) => {
  var id = req.body.id;
  PostModel.deleteOne({ _id: id }).exec((err, results) => {
    if (err) res.send(err);
    else res.send("deleted");
  });
});

module.exports = postRouter;
