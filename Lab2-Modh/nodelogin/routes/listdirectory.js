var kafka = require('./kafka/client');


var listDirectory = function (req,res)
{
    var root = req.param('root');
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
            filearray : results.fileList
        })
    }

    })
};

exports.listDirectory = listDirectory;