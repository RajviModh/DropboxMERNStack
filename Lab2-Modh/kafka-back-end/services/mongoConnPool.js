var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var pool = [];
var url = "mongodb://localhost:27017/dropbox";


    for(var i = 0; i < 50; i++)
    {

    MongoClient.connect(url, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        pool.push(db);
        connected = true;
        console.log(connected +" is connected?"+pool.length);

    });
    }


exports.collection=function (name) {

    if(pool.length!=0){
        if(!connected){
            console.log("Not connected to mongoServer!!")
            throw new Error('Must connect to the Mongo Server before calling connection');
        }
        console.log("sending back collection for :"+name);

        db=pool.pop(); //current Database Connection after popping from pool.
        console.log("Current pool length :"+pool.length);
        return db.collection(name);
    }

    else{
        console.log("Connection pool is empty");

    }

};

exports.returnConnection=function () {
    pool.push(db);
    console.log("After Connection is returned pool size :"+pool.length);
}