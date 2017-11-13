var connection =  new require('./kafka/Connection');
var login = require('./services/login');
//var signup = require('./services/signup');
var files = require('./services/files');
var profile = require('./services/profile');
var fileoperations = require('./services/fileoperations');
var listdirectory = require('./services/listdirectory');
var userActivity = require('./services/userActivity');

var topic_name = 'login_topic';
var profile_topic = 'profile_topic';
var file_topic = 'file_topic';
var userActivity_topic = 'userActivity_topic';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();

consumer.addTopics([profile_topic], function (err,added) {
});
consumer.addTopics([file_topic], function (err,added) {
});
consumer.addTopics([userActivity_topic], function (err,added) {
});

console.log('server is running');
consumer.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    console.log("data on server.js " + JSON.stringify(data));




    if(data.data.hasOwnProperty("root"))
    {
        listdirectory.listDirectory(data.data, function(err,res){
            console.log('after handle'+JSON.stringify(res));
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
    }


    else if(message.topic == profile_topic){
        profile.handle_request(data.data, function (err, res) {
            console.log('after handle' + JSON.stringify(res));
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }
    else if(message.topic == file_topic){
        fileoperations.handle_request(data.data, function (err, res) {
            console.log('after handle' + JSON.stringify(res));
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }
    else if(message.topic == userActivity_topic){
        console.log("in server user activity--------------");
        userActivity.handle_request(data.data, function (err, res) {
            console.log('after handle' + JSON.stringify(res));
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

else {
        login.handle_request(data.data, function (err, res) {
           // console.log('after handle' + JSON.stringify(res));
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });

    }
});

