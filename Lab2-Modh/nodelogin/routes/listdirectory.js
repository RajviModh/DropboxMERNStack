var fs = require('fs');
var ejs = require('ejs');
var testFolder = './routes/';
//var filepath = '../kafka-back-end/public/uploads';
var kafka = require('./kafka/client');


var listdir = function (req,res)
{
    var root = req.param('dir');
    var sess= req.session;
    console.log("**************** Listdir in routes/listdirectory : " +root);

    kafka.make_request('login_topic',{"root":root}, function(err,results) {
    if(err){
        res.end('An error occurred');
        console.log(err);
    }
    else
    {
        console.log("Back in routes listdirectory : "+ results);
        res.status(201).json({
            status:results.status,
            filelist : results.fileList
        })
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
exports.listdir = listdir;