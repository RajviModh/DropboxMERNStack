var express = require('express');
var router = express.Router();
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = './public/uploads';
var files = require('./files');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var mongodb = require('mongodb');
var kafka = require('./kafka/client');


var profile = function (req,res,next) {


    console.log("hi from profile in node" + req.body);
    console.log("Userid : " + req.body.userid);
    kafka.make_request('profile_topic', {
        "userid": req.body.userid,
        "firstname": req.body.fname,
        "lastname": req.body.lname,
        "contact": req.body.contact,
        "work": req.body.work,
        "education": req.body.education,
        "music": req.body.music,
        "sports": req.body.sports,
        "shows": req.body.shows
    }, function (err, results) {

        console.log("In results of profile node : " + results);
        if (err) {
            done(err, {});
        }
        else {
            if (results.code == 200) {
                res.status(201).json({
                    results: results,
                    status: '201'

                });
            }
        }
    })
};


var showProfile = function(req, res){

    console.log("@@@@@@@@@@ hi from show profile : " +req.body.userid);
    kafka.make_request('profile_topic', {"userid": req.body.userid}, function (err, results) {
        console.log("In results of show profile node : " + results);
        if (err) {
            done(err, {});
        }
        else {
            if (results.code == 200) {
                res.status(201).json({
                    user: results.user,
                    status: '201'

                });
            }
        }
    })
};

exports.profile=profile;
exports.showProfile=showProfile;