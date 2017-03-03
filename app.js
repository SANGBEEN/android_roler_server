var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');

var routes = require('./routes/index');
var users = require('./routes/users');
var sign = require('./routes/sign');
var role = require('./routes/role');
var schedule = require('./routes/schedule');
var todo = require('./routes/todo');
var fcm = require('./routes/fcm');
//var auth = require('./routes/auth');


var app = express();

// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());

app.use('/', routes);
app.use('/users', users);
app.use('/sign', sign);
app.use('/role', role);
app.use('/schedule',schedule);
app.use('/todo', todo);
app.use('/fcm', fcm);
//app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
