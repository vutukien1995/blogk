var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./db');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/post');
var imageRouter = require('./routes/image');
var categoryRouter = require('./routes/category');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Config passport
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret : "secret_key",
    cookie: { maxAge: 1800000 } // 30 minutes until expire.
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/post', postRouter);
app.use('/image', imageRouter);
app.use('/category', categoryRouter);

// Config Passport
var User = require('./models/User');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use("login", new LocalStrategy({
        passReqToCallback : true
    }, function(req, username, password, done) {
        console.log(" ====> ????? ");
        // check in mongo if a user with name exists or not
        User.findOne({ username :  username }).
        exec(function(err, user) {
            console.log(user);
            // In case of any error, return using the done method
            if (err)
                return done(err);
            // Userame does not exist, log error & redirect back
            if (!user || !user.password){
                console.log('User Not Found with username '+ username);
                return done(null, false, req.flash('message', 'User Not found.'));
            }
            // User exists but wrong password, log the error
            if (!(password == user.password)){
                console.log('Invalid Password');
                return done(null, false, req.flash('message', 'Invalid Password'));
            }
            // User and password both match, return user from
            // done method which will be treated like success
            return done(null, user);
            // bcrypt.compare(password, user.password, function (err, result) {
            //     if (!result){
            //         console.log('Invalid Password');
            //         return done(null, false, req.flash('message', 'Invalid Password'));
            //     }
            //     // User and password both match, return user from
            //     // done method which will be treated like success
            //     return done(null, user);
            // });
            });
    }));


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
