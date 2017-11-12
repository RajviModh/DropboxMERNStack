var fs = require('fs');
var ejs = require('ejs');
var testFolder = './routes/';
var filepath = './public/uploads';

var checkFileIsFolder = function (filename){
    try{
        var stats = fs.statSync(filename);
        return !stats.isFile();
    }catch(ex){
        console.log(ex);
    }

    return false;
};

var DirectoryList=function (root,callback){
    console.log("*****Hi in listdirectory from services : "+root);
    fs.readdir(filepath +"/"+root, function (err, files)
    {
        if(err){
            callback(err,{});
        }
        var sendFiles=[];
        console.log("***********files" + JSON.stringify(files));
        for(var i=0;i<files.length;i++)
        {
            var file = {};
            file.name = files[i];
            file.path = root+"/"+files[i];
            if(checkFileIsFolder(filepath +"/"+root+"/"+files[i])){

                file.isFolder = true;
            }else{
                file.isFolder = false;
            }
            sendFiles.push(file);
        }

        console.log(JSON.stringify(sendFiles));
        callback(err,sendFiles);
    });
};

function listdir(msg, callback){

    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));

    console.log("In ListDir");

    return DirectoryList(msg.root,function(err,files){
        if(err){
            console.log(err);
            res.code = "401";
            res.value = "Failed Fetching Data";
        }else{
            res.status = "201";
            res.fileList = files;
            res.message="List Fetched";
        }
        callback(null, res);

    });

}



exports.DirectoryList = DirectoryList;
exports.listdir = listdir;