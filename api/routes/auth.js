const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const db = require("../database");
const User = require("../schema/user");
const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  res.cookie("name", "authenticated").status(200).send("logged in successful");
});

authRouter.post("/logoff", (req, res) => {
  res
    .clearCookie("name")
    .clearCookie("level")
    .status(200)
    .send("logged off successful");
});

authRouter.post("/signup", async (req, res) => {
  const UserModel = mongoose.model("user", User);
  UserModel.find({ username: req.body.username }).exec(async (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results.length === 0) {
        const salt = await bcrypt.genSalt(10);
        bcrypt.hash(req.body.password, salt).then(async (hash) => {
          const user = new UserModel({
            username: req.body.username,
            password: hash,
            friends: [],
            topSongs: [],
            userPosts: [],
          });
          user.save((err) => {
            if (err) console.log(err);
          });
          res.status(200).cookie("name", "authenticated").send(user);
        });
      } else {
        res.status(401).send("User already exists");
      }
    }
  });
});
module.exports = authRouter;
