var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer')

//var fileUpload = require('express-fileupload')

var imageRouter = require('./routes/image_upload');
var imageMulterRouter = require('./routes/image_upload-multer');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(fileUpload());


app.use('/', imageRouter);
app.use('/multer', imageMulterRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  
  const err_json = {
    "error_status" : err.status || 500,
    "error_message" : err.message
  }
  
  res.format({
    "application/json"(){
      res.status(err.status || 500);
      res.json(err_json);
    }
  })
});

module.exports = app;
