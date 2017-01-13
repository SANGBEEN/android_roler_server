var express = require('express');
var db = require('./database');
var multer = require('multer');
var router = express.Router();


//회원가입
router.post('/up', function(req, res, next) {
  db.query('insert into user(name, email, password) values(?,?,?);', [req.body.name, req.body.email, req.body.password], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({email : req.body.name});
    }
  });
});

//이메일중복체크
router.get('/duplitcation', function(req, res, next){
  db.query('select * from user where email = ?', [req.query.email], function(error, cursor){
    console.log()
    if (error){
      res.status(500).json({error : error});
    }
    else {
      if (cursor.length > 0)
        res.status(200).json({result : false});
      else
        res.status(200).json({result : true});
    }
  });
});
//로그인
router.post('/in', function(req, res, next){
  db.query('select * from user where email = ? and password = ?', [req.body.email, req.body.password], function(error, cursor){
    console.log()
    if (error){
      res.status(500).json({error : error});
    }
    else {
      console.log(cursor.length);
      if (cursor.length > 0)
        res.status(200).json({result : true, name : cursor[0].name, email :req.body.email});
      else{
        res.status(200).json({result : false});

      }

    }
  });
});

//to-do list 생성
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

//to-do list 삭제
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

//to-do list 변경
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

//to-do list 보여주기
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
