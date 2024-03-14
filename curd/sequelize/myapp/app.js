var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/users', usersRouter);

const db = require("./model");
db.sequelize.sync();

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