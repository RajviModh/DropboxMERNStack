var express = require('express');
var router = express.Router();
var fs = require('fs');

var files = require('./files');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');
var mkdirp = require('mkdirp');
//var file = '../kafka-back-end/public/uploads'
var path = './public/uploads';

var doSignUp = function(req,res) {
    console.log("DO signup" + req.body);
    kafka.make_request('login_topic', {
        "fname": req.body.fname,
        "lname": req.body.lname,
        "username": req.body.email,
        "pass": req.body.pass
    }, function (err, results) {
        console.log('$$$$$$$$$$$$$in result');
        console.log(results);
        if (err) {
            res.end('An error occurred');
            console.log(err);
        }
        else {

                path = "./public/uploads" + '/' + results.userid;
                res.status(201).json({
                    results: results,
                    userid: results.userid,
                    status: '201',
                    path: path

                });

        }
    })
};

exports.doSignUp=doSignUp;
