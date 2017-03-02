var FCM = require('fcm-node');
var express = require('express');
var db = require('./database.js');
var schedule = require('node-schedule');
var router = express.Router();
var fcm_config = require('../config/fcm-config.json');
var serverKey = fcm_config.serverKey;
var fcm = new FCM(serverKey);
var async = require('async');
require('date-utils');

var dt = new Date();
var d = dt.toFormat('YYYY-MM-DD');
var h = dt.toFormat('HH24');

var job = schedule.scheduleJob('0 * * * *', function(){
  console.log("start push");
  var startTime="";
  var endTime="";
  if(h == 09){
    startTime="09:00:00";
    endTime="14:00:00";
  }else if(h == 14){
    startTime="14:00:00";
    endTime="19:00:00";
  }else if(h == 19){
    startTime="19:00:00";
    endTime="23:59:59";
  }
  async.waterfall([
    function(cb){
      var user=[];
      db.query('select * from user', function(error,cursor){
        if(error) console.log(error);
        for(var i=0;i<cursor.length;i++){
          if(cursor[i].token){
            user.push({id:cursor[i].id});
          }
        }
        cb(null,user);
      });
    }],
    function(error,result){
      if(error)console.log(error);
      for(var i=0;i<result.length;i++){
        db.query('select s.user_id, u.id, u.token, s.content, s.starttime, s.date from schedule s inner JOIN user u on s.user_id = ? and u.id=? and date = ? and starttime > startTime and starttime < endTime order by starttime asc;',[result[i].id, result[i].id, d], function(error, cursor){
          if (error){
            console.log(error);
          }
          else {
            if(cursor.length>0){
              var contents=[];
              for(var i=0;i<cursor.length;i++){
                contents.push({content:cursor[i].content});
                console.log(contents[i].content);
              }
              console.log("************************");
              var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                  to: cursor[0].token,
                  collapse_key: 'schedule',

                  notification: {
                      title: '오늘 해야 할 일',
                      body: contents
                  },

                  data: {  //you can send only notification or only data(or include both)
                      my_key: contents,
                      my_another_key: 'my another value'
                  }
              };
              fcm.send(message, function(err, res){
                  if (err) {
                      console.log("Something has gone wrong!");
                  } else {
                      console.log("Successfully sent with response: ", res);
                  }
              });
            }else{
              console.log("failed send message");
            }
          }
        });
      }
    }
  );


  console.log("send push message");
});

router.put('/register', function(req, res){
  db.query('update user set token=? where email = ?;', [req.body.token, req.body.email], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.get('/push', function(req, res, next){
  var dt = new Date();
  var d = dt.toFormat('YYYY-MM-DD');
  db.query('select s.user_id, u.id, u.token, s.content, s.starttime, s.date from schedule s inner JOIN user u on s.user_id = ? and u.id=? and date = ? order by starttime asc;',[req.query.user_id, req.query.id, d], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {

      if(cursor.length>0){
        var contents=[];
        for(var i=0;i<cursor.length;i++){
          contents.push({content:cursor[i].content});
          console.log(contents[i].content);
        }
        console.log("************************");
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: cursor[0].token,
            collapse_key: 'schedule',

            notification: {
                title: '오늘 해야 할 일',
                body: 'contents'
            },

            data: {  //you can send only notification or only data(or include both)
                my_key: contents,
                my_another_key: 'my another value'
            }
        };
        fcm.send(message, function(err, res){
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", res);
            }
        });
        res.status(200).json({result : true});
      }else{
        res.status(200).json({result : false, msg:"No Content"});
      }

    }

  });
});

module.exports = router;
