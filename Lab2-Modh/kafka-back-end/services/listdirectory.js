var fs = require('fs');
var filepath = './public/uploads';


var DirectoryList=function (root,callback){
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
            var filename = filepath +"/"+root+"/"+files[i];
            var stats = fs.statSync(filename);

            if(stats.isFile()){

                file.isFolder = false;
            }else{
                file.isFolder = true;
            }

            sendFiles.push(file);
        }
        callback(err,sendFiles);
    });
};

function listDirectory(msg, callback){

    var res = {};

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
exports.listDirectory = listDirectory;