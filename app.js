var createError = require('http-errors');
var express = require('express');
var methodOverride = require('method-override');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


var bcrypt = require('bcrypt');


//Variables
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

//Passport Config
require('./core/passport-config')(passport);

// var sessionStore = new MySQLStore(options);

/*
    DATABASE CONNECTION
 */
require('./core/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'calebrussel',
    saveUninitialized:false,
    resave: false
}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));


//Must be set After Session Middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash Middleware
app.use(flash());

//Globals variables
app.use( (req,resp,next)=>{
    resp.locals.success_msg = req.flash('success_msg');
    resp.locals.error_msg = req.flash('error_msg');
    resp.locals.error = req.flash('error');
    next()
});

//Routes
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', adminRouter);

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
  res.status(err.status || 500);
  res.render('messages/error');
});

module.exports = app;
