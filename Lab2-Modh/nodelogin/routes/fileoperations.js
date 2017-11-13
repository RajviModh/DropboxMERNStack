var fs = require("fs");
var kafka = require('./kafka/client');



var makeDirectory = function (req, res) {
    var name = req.body.name;
    var path = req.body.path;
    var makeDirectory = "makeDirectory";


    kafka.make_request('file_topic',{"name":name,"path":path,"makeDirectory":makeDirectory}, function(err,results) {
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

var deleteDirectory = function(req,res,next){

        var name = req.body.name;
        var path = req.body.path;
        var deleteDirectory = "deleteDirectory";
        var filepath = path + "/" + name;

        kafka.make_request('file_topic', {
            "filepath": filepath,
            "path" : path,
            "userid" : path,
            "deleteDirectory": deleteDirectory
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

var downloadFile = function(req, res){

    var file={

            filename:req.body.name,
            path: '../kafka-back-end/public/uploads' + '/'+req.body.path,
            contentType: 'application/pdf'

    };

    res.status(201).json({
        file:file,
        status:'201'
    });


};

var doStar = function (req, res) {

    var star = 'star';

    kafka.make_request('file_topic',{"fileName":req.body.fileName,"isStar":req.body.isStar,"userId":req.body.userid,"star":star}, function(err,results) {
        if(err){
            res.end('An error occurred');
            console.log(err);
        }
        else
        {

            if(results.code == 200){
                res.status(201).json({
                    message : 'Starred successfully',
                    status: '201',
                })
            }
        }

    })

};



var doUnStar = function (req, res) {


    var unstar = 'unstar';

    kafka.make_request('file_topic',{"fileName":req.body.fileName,"isStar":req.body.isStar, "unstar":unstar}, function(err,results) {
        if(err){
            res.end('An error occurred');
            console.log(err);
        }
        else
        {
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


exports.makeDirectory= makeDirectory;
exports.deleteDirectory= deleteDirectory;
exports.downloadFile= downloadFile;
exports.doStar=doStar;
exports.doUnStar=doUnStar;
exports.getStarredFiles=getStarredFiles;
exports.getSharedFiles=getSharedFiles;