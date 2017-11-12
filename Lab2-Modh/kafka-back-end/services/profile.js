var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var mongodb = require('mongodb');

function handle_request(msg, callback) {
    var res = {};

    if (msg.hasOwnProperty('firstname')) {

        mongo.connect(mongoURL, function () {
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('users');
            var id = new mongodb.ObjectID(msg.userid);

            console.log("**** Object ID " + id);

            coll.update({'_id': id}, {
                $set: {
                    firstname: msg.firstname,
                    lastname: msg.lastname,
                    contact: msg.contact,
                    work: msg.work,
                    education: msg.education,
                    music: msg.music,
                    sports: msg.sports,
                    shows: msg.shows
                }
            }, function (err, user) {
                if (user) {
                    console.log("User in profile kafka back-end : " + user);

                    res.code = "200";
                    res.value = "Success Login";
                }
                else {
                    res.code = "401";
                    res.value = "Failed Login";
                }
                callback(null, res);

            });

        });
    }

    else{
        mongo.connect(mongoURL, function() {
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('users');

            var id = new mongodb.ObjectID(msg.userid);

            console.log("**** Object ID "+id);
            coll.findOne({'_id':id},function (err,user) {
                if(user){
                    console.log("********* User" +JSON.stringify(user));


                        res.user= user;
                        res.code="200"

                }
                else
                {
                    res.code = "401";
                    res.value = "Failed Login";

                }
                callback(null, res);


            })
    })
    }






}
exports.handle_request = handle_request;