var express = require('express');
var mysql = require('mysql');
var multer = require('multer');
var router = express.Router();

var connection = mysql.createConnection({
});

router.post('/create', function(req, res, next) {
  connection.query('insert into todo(content, todoOrder, todoDate, role_id, user_id) values(?,?,?,?,?);', [req.body.content, req.body.todoOrder, req.body.todoDate, req.body.role_id, req.body.user_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });

});

router.delete('/delete', function(req, res, next) {
  connection.query('delete from todo where id = ?;', [req.query.role_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });
});

router.put('/update', function(req, res, next) {
  connection.query('update todo set content = ?, todoOrder = ?, isDone = ?, role_id = ? where id = ?;', [req.body.todoContent, req.body.todoOrder, req.body.isDone, req.body.role_id, req.body.todo_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });
});

router.get('/read', function(req, res, next) {
  connection.query('select * from todo where todoDate = ? and user_id = ?;', [req.query.todoDate, req.query.user_id], function(error, cursor){
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
