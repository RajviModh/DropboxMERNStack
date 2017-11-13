var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username , password, done) {


            kafka.make_request('login_topic',{"username":username,"password":password}, function(err,results) {

                if(err){
                    done(err,{});
                }
                else
                {
                    if(results.code == 200) {
                                done(null, {userid: results.userid,
                                    username: results.username

                                });
                            }
                            else {
                                done(null,false);
                            }

                }
            });
    }));
};
