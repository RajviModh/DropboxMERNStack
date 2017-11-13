var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var bcrypt = require("bcrypt");
var mkdirp = require('mkdirp');
var file = './public/uploads';

function handle_request(msg, callback){

    var res = {};
    if(msg.hasOwnProperty('fname')) {
        console.log("in signup of kafka back-end");
        mongo.connect(mongoURL, function() {
            var salt = bcrypt.genSaltSync(10);
            var newPass = bcrypt.hashSync(msg.pass, salt);

            console.log("New psassword" +newPass);
            var coll = mongo.collection('users');
            coll.insertOne({email: msg.username, firstname: msg.fname, lastname: msg.lname, password: newPass, directory:''});
            coll.findOne({email:msg.username},function (err,user) {
                if (user) {
                    mkdirp(file + '/' + user._id);

                    res.code = "200";
                    res.value = "Success Login";
                    res.userid = user._id;
                }
                else {
                    res.code = "401";
                    res.value = "Failed Login";
                }
                callback(null, res);

            })

        })
    }
    else{

        var res = {};
        mongo.connect(mongoURL, function () {
            var coll = mongo.collection('users');
            coll.findOne({email: msg.username}, function (err, user) {
                if (user) {
                    if (bcrypt.compareSync(msg.password, user.password)) {
                                res.code = "200";
                                res.value = "Success Login";
                                res.userid = user._id;
                                res.username = user.email;
                    }

                    else {
                        res.code = "401";
                        res.value = "Failed Login";
                    }
                    callback(null, res);
                }

            });

        })
    }
}


exports.handle_request = handle_request;