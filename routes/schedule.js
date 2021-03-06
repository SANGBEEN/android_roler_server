var express = require('express');
var mysql = require('mysql');
var db    = require('./database');
var router = express.Router();
var auth = require('./auth');


router.post('/create', auth.isAuthenticated(), function(req, res, next) {
  //console.log(req.body);
  db.query('insert into schedule(content, startTime, endTime, date, user_id, role_id) values(?,?,?,?,?,?);', [req.body.content, req.body.startTime, req.body.endTime, req.body.date, req.user.id, req.body.role_id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.delete('/delete', auth.isAuthenticated(), function(req, res, next) {
  console.log(req.query.id);
  db.query('delete from schedule where id = ?;', [req.query.id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.put('/update', auth.isAuthenticated(), function(req, res, next) {
  console.log(req.body);
  db.query('update schedule set content = ?, startTime = ?, endTime = ?, date= ?, role_id = ?  where id = ?;', [req.body.content, req.body.startTime, req.body.endTime, req.body.date, req.body.role_id, req.user.id], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      res.status(200).json({result : true});
    }
  });
});

router.get('/read', auth.isAuthenticated(), function(req, res, next) {
  var result=[];
  var t_date = new Date(req.query.date);

  var today     = t_date.getFullYear()+'-'+(t_date.getMonth()+1)+'-'+t_date.getDate();
  var yesterday = t_date.getFullYear()+'-'+(t_date.getMonth()+1)+'-'+(t_date.getDate()-1);
  var tomorrow  = t_date.getFullYear()+'-'+(t_date.getMonth()+1)+'-'+(t_date.getDate()+1);

  db.query('select * from schedule where user_id = ? and date in(?,?,?) order by date', [req.user.id, yesterday, today , tomorrow], function(error, cursor){
    if (error){
      res.status(500).json({result : error});
    }
    else {
      if (cursor.length > 0){
        for(var i=0;i<cursor.length;i++){
          console.log(cursor[i].date);
          result.push({id:cursor[i].id, content:cursor[i].content, startTime:cursor[i].startTime, endTime:cursor[i].endTime, date:cursor[i].date, user_id:cursor[i].user_id });
        }
        res.status(200).json({result : true, params:result});
      }else{
        res.status(200).json({result : false, msg:'정보가 없습니다.'});
      }
    }
  });
});


module.exports = router;
