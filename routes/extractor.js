var express = require('express');
var router = express.Router();
const createError = require("http-errors");
var formidable = require("formidable");

var pdfParse = require("pdf-parse");
var pdf2table = require("pdf2table");
const { readFile, unlink, existsSync, mkdirSync } = require('fs');

router.post("/extract", (req, res, next) => {
    var form = new formidable.IncomingForm();
    if(!existsSync(process.env.UPLOAD_DIR)){
      mkdirSync(process.env.UPLOAD_DIR);
    }
    form.uploadDir = process.env.UPLOAD_DIR;
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
            return res.status(400).json({msg: "type error"});
          });
          break;
      }
    });
  });
  
function toText(file, res, next){
    pdfParse(file.path).then(data => {
        unlink(file.path, () => {
            return res.json(data);
        });
    }).catch(err => next(createError(500)));
}

function toTable(file, res, next){
readFile(file.path, function (err, buffer) {
    if (err) return next(createError(err));
    pdf2table.parse(buffer, function (pdfErr, rows, rowsdebug) {
        if(pdfErr) return next(createError(500));
        unlink(file.path, () => {
            return res.json(rows);
        });
    });
});
}

module.exports = router;
