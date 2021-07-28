const express = require("express");
const apiRouter = express.Router();
const authRouter = require("./routes/auth");
const songRouter = require("./routes/song");

apiRouter.use("/auth", authRouter);
apiRouter.use("/song", songRouter);
module.exports = apiRouter;
