var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var fileUpload = require('express-fileupload')

var imageRouter = require('./routes/image_upload');
var imageMulterRouter = require('./routes/image_upload-multer');

var usersRouter = require('./routes/users');
var usersDetailRouter = require('./routes/users_details');
var userDetailsTable = require('./routes/users_details_table');
var actorRouter = require('./routes/actor');
var movieRouter = require('./routes/movie');
var actorMovieRouter = require('./routes/general');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
//app.use(fileUpload());


app.use('/', imageRouter);
app.use('/multer', imageMulterRouter);

app.use('/users', usersRouter);
app.use('/users/detail', usersDetailRouter);
app.use('/users/detail/table', userDetailsTable);
app.use('/actor', actorRouter);
app.use('/movie', movieRouter);
app.use('/actor_movie', actorMovieRouter);


const db = require("./model");
db.sequelize.sync();


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
