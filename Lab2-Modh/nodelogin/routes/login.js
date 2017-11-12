var express = require('express');
var router = express.Router();
var security = require('./../utils/security');
var bcrypt = require('bcrypt');
var listdirectory = require('./listdirectory');
//var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var kafka = require('./kafka/client');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username , password, done) {

            //console.log("in login");
            kafka.make_request('login_topic',{"username":username,"password":password}, function(err,results) {

                //console.log('in result');
                //console.log(results);
                if(err){
                    done(err,{});
                }
                else
                {
                    if(results.code == 200) {
                                done(null, {userid: results.userid,
                                    username: results.username

                                });
                            }
                            else {
                                done(null,false);
                            }

                }
            });
    }));
};


            /*mongo.connect(mongoURL, function() {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');

                coll.findOne({email: username}, function (err, user) {
                    if (user) {
                        //console.log("User in users " + JSON.stringify(user));
                        //var newpass = bcrypt.compareSync(password, user.password);
                        //console.log("Password " + newpass);
                        if (bcrypt.compareSync(password, user.password)) {
                            //console.log("User object ID" + user._id);
                            listdirectory.DirectoryList(user._id, function (err, filelist) {
                                done(null, {username: username, password: password, userid:user._id,root:user._id,status:'201',filelist:filelist});
                            })
                        } else {
                             done(null, false);
                        }
                    }
                });
            })*/

