var express = require('express');
var router = express.Router();
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


var getProfile = function(req, res){

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
exports.getProfile=getProfile;