var express = require('express');
var db = require('./database');
var multer = require('multer');
var fs    = require('fs');
var path = require('path');
var router = express.Router();
var upload = multer({
  dest: path.join(__dirname, '../upload')
});

router.post('/upload',upload.single('myfile'), function(req,res){
  if(req.file){
    console.log(req.body); //form fields
    console.log(req.file); //form files
    res.status(204).end();
  }else{
      res.end('Missing file');
  }
});
router.post('/up', function(req, res, next) {
  db.query('insert into user(name, email, password) values(?,?,?)', [req.body.name, req.body.email, req.body.password], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result:true, id : cursor.insertId, name : req.body.name});
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
      if (cursor.length > 0)
        res.status(200).json({result : true, name : cursor[0].name, email :req.body.email, id: cursor[0].id});
      else{
        res.status(200).json({result : false});

      }

    }
  });
});

module.exports = router;
