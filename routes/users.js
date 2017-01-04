var express = require('express');
var mysql = require('mysql');
var router = express.Router();


var connection = mysql.createConnection({
  host     : 'roler.cdqui1vgbssg.ap-northeast-2.rds.amazonaws.com',
  user     : 'hyunsung',
  password : 'nanamare',
  database : 'Roler'
});

//향후 로그인 필요

router.post('/up', function(req, res, next) {
  connection.query('insert into user(name, email, password) values(?,?,?);', [req.body.name, req.body.email, req.body.password], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({email : req.body.name});
    }
  });
});

router.get('/duplitcation', function(req, res, next){
  connection.query('select * from user where email = ?', [req.query.email], function(error, cursor){
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

module.exports = router;
