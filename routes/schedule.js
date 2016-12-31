var express = require('express');
var mysql = require('mysql');

var router = express.Router();

var connection = mysql.createConnection({
    
});



router.post('/create', function(req, res, next) {
  console.log(req.body);
  connection.query('insert into schedule(content, startTime, endTime, user_id, role_id) values(?,?,?,?,?);', [req.body.content, req.body.startTime, req.body.endTime, req.body.user_id, req.body.role_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });
});

router.delete('/delete', function(req, res, next) {
  console.log(req.query.id);
  connection.query('delete from schedule where id = ?;', [req.query.id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });
});

router.put('/update', function(req, res, next) {
  console.log(req.body);
  connection.query('update schedule set content = ?, startTime = ?, endTime = ?, role_id = ?  where id = ?;', [req.body.content, req.body.startTime, req.body.endTime, req.body.role_id,req.body.id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });
});

router.get('/read', function(req, res, next) {
  console.log(req.query.user_id);
  connection.query('select * from schedule where user_id = ? and date = ? ;', [req.query.user_id,req.query.date], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      if (cursor.length > 0)
        res.status(200).json(cursor);
      else
        res.status(200).json({result : '정보가 없습니다.'})
    }
  });
});


module.exports = router;
