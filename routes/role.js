var express = require('express');
var mysql = require('mysql');
var multer = require('multer');
var router   = express.Router();

var connection = mysql.createConnection({

});

router.post('/create', function(req, res, next) {
  connection.query('insert into role(rolePrimary, roleName, roleContent, user_id) values(?,?,?,?);', [req.body.rolePrimary, req.body.roleName, req.body.roleContent, req.body.user_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });
});

router.delete('/delete', function(req, res, next) {
  connection.query('delete from role where id = ?;', [req.query.role_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).end();
    }
  });
});

router.put('/update', function(req, res, next) {
  connection.query('update role set rolePrimary = ?, roleName = ?, roleContent = ? where id = ?;', [req.body.rolePrimary, req.body.roleName, req.body.roleContent, req.body.role_id], function(error, cursor){
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
  connection.query('select * from role where and user_id = ?;', [req.query.user_id], function(error, cursor){
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
