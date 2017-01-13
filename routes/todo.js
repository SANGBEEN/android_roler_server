var express = require('express');
var mysql = require('mysql');
var multer = require('multer');
var router = express.Router();
var db = require('./database');

router.post('/create', function(req, res, next) {
  db.query('insert into todo(content, todoOrder, todoDate, role_id, user_id) values(?,?,?,?,?);', [req.body.content, req.body.todoOrder, req.body.todoDate, req.body.role_id, req.body.user_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });

});

router.delete('/delete', function(req, res, next) {
  db.query('delete from todo where id = ?;', [req.query.role_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });
});

router.put('/update', function(req, res, next) {
  db.query('update todo set content = ?, todoOrder = ?, isDone = ?, role_id = ? where id = ?;', [req.body.todoContent, req.body.todoOrder, req.body.isDone, req.body.role_id, req.body.todo_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });
});

router.get('/read', function(req, res, next) {
  db.query('select * from todo where todoDate = ? and user_id = ? and role_id=?;', [req.query.todoDate, req.query.user_id, req.query.role_id], function(error, cursor){
    var result=[];
    if (error){
      res.status(500).json({result : error});
    }
    else {
      if (cursor.length > 0){
        for(var i=0;i<cursor.length;i++){
          result.push({content:cursor[i].content, isDone:cursor[i].isDone});
        }
        res.status(200).json({result: true, params:result});
      }
      else
        res.status(200).json({result : '정보가 없습니다.'})
    }
  });
});



module.exports = router;
