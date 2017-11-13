var kafka = require('./kafka/client');

var getUserActivity = function(req, res){

    kafka.make_request('userActivity_topic', {"userid": req.body.userid}, function (err, results) {


        if (err) {
            res.end('An error occurred');
            console.log(err);
        }
        else {
            if (results.code == 200) {
                console.log("In results of userActivity node : " + results);
                res.status(201).json({
                    userActivityList:results.userActivityList,
                    status: '201'

                });
            }
        }
    })
};

exports.getUserActivity=getUserActivity;