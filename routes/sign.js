var express = require('express');
//var mysql = require('mysql');
var db = require('./database');
var router = express.Router();

/*
var connection = mysql.createConnection({
  host     : 'roler.cdqui1vgbssg.ap-northeast-2.rds.amazonaws.com',
  user     : 'hyunsung',
  password : 'nanamare',
  database : 'Roler'
});
*/

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

module.exports = router;
