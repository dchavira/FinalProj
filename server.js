const mongoose = require("mongoose");
const express = require("express");
const app = express();
const db = mongoose.connection;
const mongoDBURL = "mongodb://127.0.0.1/finalDB";
const port = 3000;

app.use(express.static("public_html"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).send("home path")
})

//404 handler
app.get("*", (req, res) => {
    res.status(404).redirect("/");
  });
  
  //Set up default mongoose connection
  mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  
  //Listening
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });