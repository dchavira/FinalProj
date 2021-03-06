const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const db = require("../database");
const User = require("../schema/user");
const authRouter = express.Router();
const UserModel = mongoose.model("user", User);

authRouter.post("/login", (req, res) => {
  const userObj = JSON.parse(req.body.user);
  const username = userObj.user_id;
  const password = userObj.password;
  UserModel.find({ username: userObj.username }).exec(async (err, results) => {
    if (err) console.log(err);
    if (results.length === 0) {
      res.status(409).send("Error 409: User doesn't exist");
    } else {
      const hashed = results[0].password;
      bcrypt
        .compare(password, hashed || "")
        .then(function (result) {
          if (result) {
            res
              .cookie("login", {
                username: results[0].username,
                time: Date.now(),
              })
              .status(200)
              .send("Password was correct!");
          } else res.status(401).send("Password was incorrect");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

authRouter.get("/get/username", (req, res) => {
  let uname = req.cookies.login.username;
  res.send(uname);
});

authRouter.get("/get/pfp", (req, res) => {
  let uname = req.cookies.login.username;
  UserModel.find({ username: uname }).exec((err, user) => {
    if (err) {
      console.log("Error getting user");
    } else {
      res.send(user[0].image);
    }
  });
});

authRouter.post("/logoff", (req, res) => {
  res.clearCookie("username").status(200).send("logged off successful");
});

authRouter.post("/signup", async (req, res) => {
  let data = JSON.parse(req.body.user);
  UserModel.find({ username: data.username }).exec(async (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results.length === 0) {
        const salt = await bcrypt.genSalt(10);
        bcrypt.hash(data.password, salt).then(async (hash) => {
          const user = new UserModel({
            username: data.username,
            password: hash,
            image: data.image,
            topSongs: [],
            userPosts: [],
          });
          user.save((err) => {
            if (err) res.send(err);
          });
          res
            .status(200)
            .cookie("login", { username: user.username }, "authenticated")
            .send(user);
        });
      } else {
        res.status(401).send("User already exists");
      }
    }
  });
});
module.exports = authRouter;
