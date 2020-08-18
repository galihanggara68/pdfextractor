var createError = require('http-errors');
var express = require('express');
var formidable = require("formidable");
var http = require("http");
var path = require('path');
var pdfParse = require("pdf-parse");
var pdf2table = require("pdf2table");
const { readFile, unlink, existsSync, mkdirSync } = require('fs');

process.env.PORT = 9000;
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/" , (req, res, next) => {
	res.send("Hello");
});

app.post("/extract", (req, res, next) => {
  var form = new formidable.IncomingForm();
  if(!existsSync("./temp")){
    mkdirSync("./temp");
  }
  form.uploadDir = "./temp";
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if((files.pdf && !files.pdf.size > 0)){
      unlink(files.pdf.path, () => {
        return res
            .status(400)
            .json({msg: "pdf file error"});
      });
    }else if(!files.pdf){
      unlink(files.pdf.path, () => {
        return res
            .status(400)
            .json({msg: "pdf field required"});
      });
    }
    var type = req.query.type || "text";
    switch(type){
      case "text":
        toText(files.pdf, res, next);
        break;
      case "table":
        toTable(files.pdf, res, next);
        break;
      default:
        unlink(files.pdf.path, () => {
          res.status(400).json({msg: "type error"});
        });
        break;
    }
  });
});

function toText(file, res, next){
  pdfParse(file.path).then(data => {
    unlink(file.path, () => {
      res.json(data);
    });
  }).catch(err => next(createError(500)));
}

function toTable(file, res, next){
  readFile(file.path, function (err, buffer) {
      if (err) return next(createError(err));
      pdf2table.parse(buffer, function (err, rows, rowsdebug) {
          if(err) return next(createError(500));
          unlink(file.path, () => {
            res.json(rows);
          });
      });
  });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(500).send("error");
});

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
	console.log("Listening , , ,");
});