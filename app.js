var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var usersRouter = require("./routes/users");
var walletRouter = require("./routes/wallet");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello Jee! Idhar kidhar?");
});

app.use("/", usersRouter);
app.use("/wallet", walletRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
mongoose
  .connect(
    "mongodb+srv://UsamaBilal:walletadmin@nodejspractice.7kuts.mongodb.net/DigitalWallet?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    console.log("Database Connected!");
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      console.log(err);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
