let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let indexRouter = require('./routes/index');

let app = express();

// db
mongoose.Promise = global.Promise;

let url = 'mongodb://localhost:27017/timetable';
mongoose.connect(url)
    .then(() => console.log('Successfully connected to mongodb'))
    .catch((e) => console.error(e));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// body-parser setting
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);


//////////// STUBS

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
