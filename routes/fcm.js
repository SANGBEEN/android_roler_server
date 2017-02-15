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

module.exports = router;
