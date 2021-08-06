const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Cookies = require("js-cookie");
const db = mongoose.connection;
const mongoDBURL = "mongodb://127.0.0.1/finalDB";
const port = 3000;
const apiRouter = require("./api/");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

let sessionKey = {};
console.log(sessionKey);
/*This function removes the expired user's cookie from the dictionary
which essentially logs them out of the site.*/
function clearSession() {
  let now = Date.now();
  for (let i in sessionKey) {
    if (sessionKey.login.time < now - 600000) {
      //10 minute session
      delete sessionKey[i].time;
      return true;
    }
    return false;
  }
}

setInterval(clearSession, 2000); //Check user's cookie's date every 2 secs

/*This function verifies that the user's session is still good in order
for them to proceed to the main site*/
function verify(req, res, next) {
  //console.log(sessionKey);
  if (Object.keys(sessionKey).length > 0) {
    ///console.log(sessionKey.login);
    let user = req.cookies.login.username;
    //console.log(clearSession());
    if (sessionKey.login["username"] != undefined) {
      sessionKey = req.cookies;

      if (!clearSession()) {
        next();
      } else {
        console.log("time is expired");
        res.redirect("/");
      }
    } else {
      console.log("not logged in");
      res.redirect("/");
    }
  } else {
    sessionKey = req.cookies;
    console.log("No cookies");
    res.redirect("/pages/main.html");
  }
}
app.use("/pages/main.html", verify);
app.use("/", express.static("public_html"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", apiRouter);
app.get("/", (req, res) => {
  res.status(200).send("home path");
});

//404 handler
app.get("*", (req, res) => {
  res.status(404).redirect("/");
});

//Set up default mongoose connection
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Listening
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
