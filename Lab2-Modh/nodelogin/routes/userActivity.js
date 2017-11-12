var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var kafka = require('./kafka/client');

var getUserActivity = function(req, res){
    var userid = req.body.userid;
    console.log("*****Hi from node user activity " + JSON.stringify(userid));

    kafka.make_request('userActivity_topic', {"userid": req.body.userid}, function (err, results) {


        if (err) {
            done(err, {});
        }
        else {
            if (results.code == 200) {
                console.log("In results of userActivity node : " + results);
                res.status(201).json({
                    //results: results,
                    userActivityList:results.userActivityList,
                    status: '201'

                });
            }
        }
    })



};

exports.getUserActivity=getUserActivity;