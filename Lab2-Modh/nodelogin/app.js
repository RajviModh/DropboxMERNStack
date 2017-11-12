var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require("express-session");
var passport = require('passport');

require('./routes/login')(passport);


//var index = require('./routes/index');
//var users = require('./routes/users');
var signup = require('./routes/signup');
var userActivity = require('./routes/userActivity');

var login = require('./routes/login');


var file = require('./routes/files');
var listdirectory = require('./routes/listdirectory');
var fileoperations = require('./routes/fileoperations');
var profile = require('./routes/profile');

var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

//Enable CORS
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions));

app.use(expressSessions({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users);

app.post('/file', file);

app.post('/getDir', listdirectory.listdir);
//app.get('/getDir', listdirectory.listdir);
app.post('/makeDir',fileoperations.makeDir);
app.post('/deleteDir',fileoperations.deleteDir);
app.post('/download', fileoperations.downloadFile);
app.post('/doStar',fileoperations.doStar);
app.post('/doUnStar',fileoperations.doUnStar);
app.post('/getStarredFiles',fileoperations.getStarredFiles);
app.post('/getSharedFiles',fileoperations.getSharedFiles);

app.post('/getUserActivity',userActivity.getUserActivity);
app.post('/profile',profile.profile);
app.post('/showProfile',profile.showProfile);


//app.post('/makeDirectory',fileoperations.authenticate,fileoperations.makeDirectory);
//app.post('/deleteDir',fileoperations.authenticate,fileoperations.deleteDir);


app.post('/login',function(req, res,next) {
    console.log("username in app" + JSON.stringify(req.body));
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(500).send();
        }

        if(!user) {
            res.status(401).send();
        }
        req.session.user = user.username;
        console.log(req.session.user);
      /*  console.log("session initialized");
        console.log("back in app.js root : " +user.userid);
        console.log("back in app.js userid : "+user.userid);
        console.log("back in app.js");
*/
        return res.status(201).send({ results: user,
            username: user.username,
            userid: user.userid,
            root: user.userid,
            status: '201'});
    })(req, res,next);
});

app.post('/doSignUp',signup.doSignUp);


app.post('/logout', function(req,res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(200).send();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use('./public/uploads', express.static(path.join(__dirname, 'uploads')));

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;
