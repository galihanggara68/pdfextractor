var createError = require('http-errors');
var express = require('express');
var http = require("http");

// Dotenv
require("dotenv").config();

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var auth = require("./routes/auth");
var authMiddleware = require("./routes/middleware/checkToken");

var extractorroute = require("./routes/extractor");

app.get("/" , (req, res, next) => {
	res.send("Hello");
});

app.use("/auth", auth);

app.use("/api", authMiddleware);
app.use("/api", extractorroute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);

  // render the error page
  res.status(500).send(err);
});

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
	console.log("Listening on " + process.env.PORT);
});