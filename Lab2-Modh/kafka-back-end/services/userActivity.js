var mongo = require("./mongoConnPool");
var mongoURL = "mongodb://localhost:27017/dropbox";
var mongodb = require('mongodb');

function handle_request(msg, callback) {
    var res = {};

    console.log("*****Hi from kafka user activity ");

    //mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('activity');

        coll.find({userid : msg.userid}).toArray(function (err,activity) {
            console.log("***************Activity " + activity);
            if(!err){

                    res.code="200";
                    res.userActivityList=activity;

            }
            callback(null, res);
        });

   // })
}
exports.handle_request = handle_request;