var express = require('express');
var mysql = require('mysql');
var db    = require('./database');
var router = express.Router();



router.post('/create', function(req, res, next) {
  //console.log(req.body);
  db.query('insert into schedule(content, startTime, endTime, date, user_id, role_id) values(?,?,?,?,?,?);', [req.body.content, req.body.startTime, req.body.endTime, req.body.date, req.body.user_id, req.body.role_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.delete('/delete', function(req, res, next) {
  console.log(req.query.id);
  db.query('delete from schedule where id = ?;', [req.query.id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.put('/update', function(req, res, next) {
  console.log(req.body);
  db.query('update schedule set content = ?, startTime = ?, endTime = ?, date= ?, role_id = ?  where id = ?;', [req.body.content, req.body.startTime, req.body.endTime, req.body.date, req.body.role_id, req.body.id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.get('/read', function(req, res, next) {
  console.log(req.query.user_id);
  db.query('select * from schedule where user_id = ? and date = ? ;', [req.query.user_id, req.query.date], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      if (cursor.length > 0)
        res.status(200).json({result : true});
      else
        res.status(204).json({result : false, msg:'정보가 없습니다.'});
    }
  });
});


module.exports = router;
