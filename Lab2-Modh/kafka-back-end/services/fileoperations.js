var fs = require("fs");
var mime = require('mime');
var path = require('path');
var mkdirp = require('mkdirp');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var nodemailer = require('nodemailer');

var createDirectory = function (filepath, callback) {
    console.log("createDir " + filepath);
    mkdirp('./public/uploads' + '/' + filepath, function (err) {
        if (err) {
            callback(err, filepath);
        }
        else {
            callback(err, filepath);
        }
    });
};


var deleteFolders = function(path,userid) {
    console.log("in deletefolder  of kafka : " +path +"-----"+ userid);
    var filepath =  path.replace(new RegExp('./public/uploads'+'/', 'g'), '');
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolders(curPath,userid);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

var deleteDirectory = function(filepath,userid,callback){

    console.log("in deletedirectory 2 of kafka : "+filepath+"-----"+ userid);
    if(fs.statSync('./public/uploads'+'/'+filepath).isDirectory()){
        deleteFolders('./public/uploads'+'/'+filepath,userid);
    }else{
        fs.unlinkSync('./public/uploads'+'/'+filepath);
    }
    callback(false,filepath);
};

function handle_request(msg, callback) {
    var res = {};
    if (msg.hasOwnProperty('makedir')) {

        console.log("In Makedirectory of fileoperations" + msg.dirName, msg.path);
        createDirectory(msg.path + '/' + msg.dirName, function () {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('activity');

                coll.insertOne({
                    userid: msg.path,
                    timestamp: new Date(),
                    Action: 'directory created from kafka'
                }, function (err, results) {
                    if (results) {
                        res.code = "200";
                        res.message = "Directory created successfully";
                    }
                    else {
                        res.code = "401";
                        res.value = "Failed Login";
                    }
                    callback(null, res);
                });
            });
        });
    }
    else if (msg.hasOwnProperty('deletedir')) {

        console.log("------In deletedirectory of fileoperations" + msg.dirName+"------"+ msg.path);
        deleteDirectory(msg.filepath, msg.userid, function () {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('activity');

                coll.insertOne({
                    userid: msg.path,
                    timestamp: new Date(),
                    Action: 'directory deleted from kafka'
                }, function (err, results) {
                    if (results) {
                        res.code = "200";
                        res.message = "Directory deleted successfully";
                    }
                    else {
                        res.code = "401";
                        res.value = "Failed Login";
                    }
                    callback(null, res);
                });
            });
        })
    }

    else if (msg.hasOwnProperty('star')) {
        console.log("++++++++++++++in Star of fileoperations of Kafka" + msg.fileName +"----------" + msg.isStar +"------" +msg.userId);

        mongo.connect(mongoURL, function () {

            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('starFiles');

            coll.findOne({filename:msg.fileName},function (err,files) {
                if(files) {
                    coll.update({filename: msg.fileName}, {$set: {isStar: msg.isStar}}, function (err, files) {
                        console.log("++++++in FIND of do star" + files);
                        if(!err) {
                            res.code = "200";
                            res.files = files;
                            res.fileName = msg.fileName;
                            res.isStar = "true";
                        }
                       callback(null, res);
                    });

                }
                else{
                    coll.insertOne({userid: msg.userId, filename: msg.fileName, isStar: msg.isStar}, function (err, files) {

                        if (files) {
                            console.log("++++++++ in INSERT of do star" + files.ops[0]);
                            res.code ="200";
                            res.fileName = msg.fileName;
                            res.isStar= "true";
                        }

                        callback(null, res);
                    });

                }
               // callback(null, res);

            })
        })
    }

    else if (msg.hasOwnProperty('unstar')) {
        mongo.connect(mongoURL, function () {

            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('starFiles');
            console.log("*****FileName"+msg.fileName);
            coll.update({filename: msg.fileName}, {$set: {isStar:msg.isStar}}, function (err, files) {
                console.log("*****Files"+files);
                if (!err) {
                    console.log("++++++++in unStar" );

                        res.code= "200";
                        res.fileName=msg.filename;
                        res.isStar= msg.isStar;

                }
                else{
                    res.code = "401";
                    res.value = "Failed Login";
                }
                callback(null, res);
            });

        })
    }

    else if (msg.hasOwnProperty('getStarredfiles')) {
        mongo.connect(mongoURL, function () {
            var coll = mongo.collection('starFiles');
            console.log("In getStarred userid :" +msg.userid);

            coll.find({'userid':msg.userid,'isStar':true}).toArray(function (error, documents) {
                if (!error) {

                    console.log("Starred files in getStarred" + JSON.stringify(documents));
                    res.code= '200';
                    res.starArray= documents
                }
                callback(null, res);
            });
        });
    }

    else if (msg.hasOwnProperty('getSharedFiles')) {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'genesisworld23@gmail.com',
                pass:'genesis23'
            }});

        var mailOptions = {
            from: 'genesisworld23@gmail.com', // sender address
            to: msg.recipientEmail, // list of receivers
            subject: 'DropBox File Shared ', // Subject line
            text: 'Find the file shared below', // plaintext body
            attachments:[{
                filename:msg.fileName,
                path: './public/uploads/'+msg.filePath,
                contentType: 'application/pdf'
            }]
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            else {
                res.code="200";
                console.log('Message sent: ' + info.response);

            }
            callback(null,res);
        });

    }
 /*   else if (msg.hasOwnProperty('download')) {
        console.log("--------------" +msg.fileName);
            if(msg.fileName){}
            res.code="200";
            res.file=msg.fileName;
        callback(null, res);
    }*/


}

exports.handle_request = handle_request;
exports.createDirectory = createDirectory;

