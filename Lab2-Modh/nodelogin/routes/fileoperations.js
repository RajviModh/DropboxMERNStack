var fs = require("fs");
var mime = require('mime');
var path = require('path');
var mkdirp = require('mkdirp');
var kafka = require('./kafka/client');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
//var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
//var xoauth2 = require('xoauth2');

var makeDir = function (req, res) {
    var dirName = req.body.dirName;
    var path = req.body.path;
    var makedir = "makedir";
    console.log("in makedir of fileoperations " +dirName);

    kafka.make_request('file_topic',{"dirName":dirName,"path":path,"makedir":makedir}, function(err,results) {
        if(err){
            res.end('An error occurred');
            console.log(err);
        }
        else
        {
            console.log("Back in routes makedirectory : "+ results);
            if(results.code == 200){
            res.status(201).json({
                message : 'Directory created successfully'
            })
            }
        }

    })
};


var deleteDir = function(req,res,next){

        var dirName = req.body.dirName;
        var path = req.body.path;
        var userid = req.session.userid;
        var deletedir = "deletedir";
        console.log("+++++++++++ in deletedir of node : " +path);
        var filepath = path + "/" + dirName;

        kafka.make_request('file_topic', {
            "filepath": filepath,
            "path" : path,
            "userid" : path,
            "deletedir": deletedir
        }, function (err, results) {
            if (err) {
                res.end('An error occurred');
                console.log(err);
            }
            else {
                console.log("Back in routes deletedirectory : " + results);
                if (results.code == 200) {
                    res.status(201).json({
                        message: results.message
                    })
                }
            }

        })

};

var checkFileIsFolder = function (filename){
    try{
        var stats = fs.statSync(filename);
        return !stats.isFile();
    }catch(ex){
        console.log(ex);
    }
    return false;
};

var checkFileIsFolder1 = function (filename,callback){
    try{
        var stats = fs.statSync(filename);
        callback(!stats.isFile());
    }catch(ex){
        console.log(ex);
    }
    return false;
};


var downloadFile = function(req, res){


    console.log("in node downloadfile " +req.body.path +"-----"+ req.body.name);
   // var file = '../kafka-back-end/public/uploads' + '/'+req.body.path;

    var file={

            filename:req.body.name,
            path: '../kafka-back-end/public/uploads' + '/'+req.body.path,
            contentType: 'application/pdf'

    };
   // var filename = path.basename(file);
   //  var mimetype = mime.lookup(file);
   //
   //  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
   //  res.setHeader('Content-type', mimetype);
   //
   //  var filestream = fs.createReadStream(file);
   //
   //  res.download(file);

    res.status(201).json({
        file:file,
        status:'201'
    });


};

var doStar = function (req, res) {
    console.log(req.body);

    console.log("*****FileName"+req.body.fileName);
    console.log("*****isStar"+req.body.isStar);
    var star = 'star';

    kafka.make_request('file_topic',{"fileName":req.body.fileName,"isStar":req.body.isStar,"userId":req.body.userid,"star":star}, function(err,results) {
        if(err){
            res.end('An error occurred');
            console.log(err);
        }
        else
        {
            console.log("Back in routes doStar : "+results +"------------------"+ results.fileName +"----------"+ results.isStar);
            if(results.code == 200){
                res.status(201).json({
                    message : 'Starred successfully',
                    status: '201',
                    //starArray:results.fileName,
                    //isStar:results.isStar
                })
            }
        }

    })

};



var doUnStar = function (req, res) {
    console.log(req.body);

    console.log("*****FileName"+req.body.fileName);
    console.log("*****isStar"+req.body.isStar);

    var unstar = 'unstar';

    kafka.make_request('file_topic',{"fileName":req.body.fileName,"isStar":req.body.isStar, "unstar":unstar}, function(err,results) {
        if(err){
            res.end('An error occurred');
            console.log(err);
        }
        else
        {
            console.log("Back in routes doUnStar : "+ results.fileName + results.isStar);
            if(results.code == 200){
                res.status(201).json({
                    message : 'UnStarred successfully',
                    status: '201',
                    starArray:results.fileName,
                    isStar:results.isStar
                })
            }
        }

    })

};

var getStarredFiles=function(req,res) {
console.log(req.body.userid);
    console.log("*****************in get starred files of node");

    var getStarredfiles = 'getStarredfiles';

    kafka.make_request('file_topic',{"userid":req.body.userid, "getStarredfiles":getStarredfiles}, function(err,results) {
        if(err){
            res.end('An error occurred');
            console.log(err);
        }
        else
        {
            console.log("Back in routes Starred : "+ results.starArray);
            if(results.code == 200){
                res.status(201).json({
                    status: '200',
                    starArray:results.starArray,
                    isStar:'true'
                })
            }
        }

    })

};


var getSharedFiles=function(req,res) {
    console.log(req.body.path +"*******" +req.body.name);
    console.log("*****************in get shared files of node");

    var getSharedFiles = 'getSharedFiles';

    kafka.make_request('file_topic',{"recipientEmail":req.body.recipientEmail, "fileName":req.body.fileName, "filePath": req.body.path, "getSharedFiles":getSharedFiles}, function(err,results) {
        if(err){
            res.end('An error occurred');
            console.log(err);
        }
        else
        {
            console.log("Back in routes Shared : "+ results.starArray);
            if(results.code == 200){
                res.status(200).json({
                    status: '200'
                });
            }
        }

    })

};

/*var authenticate = function (req, res, next) {
    var session = req.session;

    if(session && session.userid && session.userid>0){
        var isAuthenticated = true;
    }
    if (isAuthenticated) {
        next();
    }
    else {
        res.status(501).json({status:'501',message:'invalid try.'});
    }
}*/



//exports.authenticate=authenticate;

//exports.createDirectory = createDirectory;
exports.checkFileIsFolder = checkFileIsFolder;
exports.checkFileIsFolder1 = checkFileIsFolder1;
exports.makeDir= makeDir;
exports.deleteDir= deleteDir;
exports.downloadFile= downloadFile;
exports.doStar=doStar;
exports.doUnStar=doUnStar;
exports.getStarredFiles=getStarredFiles;
exports.getSharedFiles=getSharedFiles;