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
      res.status(200).json({result : true, id:cursor.insertId });
    }
  });

});

router.delete('/delete', function(req, res, next) {
  db.query('delete from todo where id = ?;', [req.query.id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});
/*
router.put('/update', function(req, res, next) {
  db.query('update todo set content = ?, todoOrder = ?, isDone = ?, role_id = ? where id = ?;', [req.body.todoContent, req.body.todoOrder, req.body.isDone, req.body.role_id, req.body.todo_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});
*/
router.put('/done/:todo_id', function(req, res, next) {
  db.query('update todo set isDone = ? where id = ?;', [req.query.isDone, req.params.todo_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});
router.get('/read', function(req, res, next) {
  db.query('select * from todo where user_id = ? and role_id=?;', [req.query.user_id, req.query.role_id], function(error, cursor){
    var result=[];
    if (error){
      res.status(500).json({result : error});
    }
    else {
      if (cursor.length > 0){
        for(var i=0;i<cursor.length;i++){
          result.push({id: cursor[i].id, content:cursor[i].content, isDone:cursor[i].isDone, todoOrder: cursor[i].todoOrder});
        }

        result.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });

        res.status(200).json({result: true, params:result});
      }
      else{
        res.status(200).json({result : false, msg: '정보가 없습니다.'})
      }
    }
  });
});



module.exports = router;
