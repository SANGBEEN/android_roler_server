var express = require('express');
var mysql = require('mysql');
var multer = require('multer');
var router   = express.Router();
var db = require('./database');

router.post('/create', function(req, res, next) {
  db.query('insert into role(rolePrimary, roleName, roleContent, user_id) values(?,?,?,?);', [req.body.rolePrimary, req.body.roleName, req.body.roleContent, req.body.user_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.delete('/delete', function(req, res, next) {
  db.query('delete from role where id = ?;', [req.query.id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.put('/update', function(req, res, next) {
  db.query('update role set rolePrimary = ?, roleName = ?, roleContent = ? where id = ?;', [req.body.rolePrimary, req.body.roleName, req.body.roleContent, req.body.role_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.get('/read', function(req, res, next) {
  //console.log(req.query.user_id);
  db.query('select * from role where user_id = ?', [req.query.user_id], function(error, cursor){
    //console.log(req.query.user_id);
    var result=[];
    if (error){
      res.status(500).json({result : error});
    }
    else {
      if (cursor.length > 0){
        for(var i=0;i<cursor.length;i++){
          result.push({role_id:cursor[i].id, rolePrimary:cursor[i].rolePrimary, roleName:cursor[i].roleName, roleContent:cursor[i].roleContent, user_id:cursor[i].user_id});
        }
        res.status(200).json({result:true, params:result});
      }

      else
        res.status(204).json({result : false, msg: '정보가 없습니다.'})
    }
  });
});



module.exports = router;
