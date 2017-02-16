var FCM = require('fcm-node');
var express = require('express');
var db = require('./database.js');
var router = express.Router();
var fcm_config = require('../config/fcm-config.json');
var serverKey = fcm_config.serverKey;
var fcm = new FCM(serverKey);
require('date-utils');

router.put('/register', function(req, res){
  db.query('update user set token=? where id = ? ', [req.body.token, req.body.email], function(error, cursor){
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
  db.query('select s.user_id, u.id, u.token, s.content, s.starttime, s.date from schedule s inner JOIN user u on s.user_id = ? and u.id=? and date = ? order by starttime asc',[req.query.user_id, req.query.id, d], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      if(cursor.length>0){
        var contents=[];
        for(var i=0;i<cursor.length;i++){
          contents.push({content:cursor[i].content});
        }
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: cursor[0].token,
            collapse_key: 'schedule',

            notification: {
                title: '오늘 해야 할 일',
                body: contents
            },

            data: {  //you can send only notification or only data(or include both)
                my_key: 'my value',
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
