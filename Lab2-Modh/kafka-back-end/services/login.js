var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var bcrypt = require("bcrypt");
var mkdirp = require('mkdirp');
var file = './public/uploads';
var listdirectory = require('./listdirectory');
var fs = require('fs');

function handle_request(msg, callback){

    var res = {};
    if(msg.hasOwnProperty('fname')) {
        console.log("in signup of kafka back-end");
        mongo.connect(mongoURL, function() {
            console.log('Connected to mongo at: ' + mongoURL);
           /* console.log("############### User : " +msg.fname);
            console.log("############### User : " +msg.lname);
            console.log("############### User : " +msg.username);
            console.log("############### User : " +msg.pass);*/

            var salt = bcrypt.genSaltSync(10);
            var newPass = bcrypt.hashSync(msg.pass, salt);

            console.log("New psassword" +newPass);
            var coll = mongo.collection('users');
            coll.insertOne({email: msg.username, firstname: msg.fname, lastname: msg.lname, password: newPass, directory:''});
            coll.findOne({email:msg.username},function (err,user) {
                if (user) {
                    // console.log("############### User : " + JSON.stringify(user));

                    mkdirp(file + '/' + user._id);

                    res.code = "200";
                    res.value = "Success Login";
                    //res.results = user;
                    res.userid = user._id;
                    //res.path=path;

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
        //console.log("in login of kafka back-end");
        var res = {};
        //console.log("In handle request:" + JSON.stringify(msg));

        mongo.connect(mongoURL, function () {
            //console.log('Connected to mongo at: ' + mongoURL);
           /* console.log("############### User : " + msg.username);
            console.log("############### User : " + msg.password);*/
            var coll = mongo.collection('users');
            coll.findOne({email: msg.username}, function (err, user) {

               /* fs.readdirSync("./public/uploads" +"/"+ user._id, function (err, files){
                    if(!err) {
                        console.log("=====files listing : " + files);
                    }*/
               // })
                if (user) {

                   /* console.log("############### User : " + user.email);
                    console.log("############### User : " + user.password);*/


                    if (bcrypt.compareSync(msg.password, user.password)) {
                        //console.log("in bcrypt password : ");

                       /* listdirectory.DirectoryList(user._id, function (err, filelist) {
                            console.log("in listdirectory of services login" + JSON.stringify(filelist));
                        })*/

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