var express = require('express');
var db = require('./database');
var multer = require('multer');
var fs    = require('fs-extra');
var path = require('path');
var router = express.Router();
var auth = require('./auth');
var crypto = require('crypto');
var Email = require('email').Email;
/*
var upload = multer({
  dest: path.join(__dirname, '../upload')
});*/


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var email = req.user.email;
    var filepath = './upload/'+email;
    fs.mkdirsSync(filepath);
    cb(null, filepath)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
//UPDATE user SET picture_id="test1.jpg" where email="kozy@naver.com"
var upload = multer({ storage: storage })
router.post('/upload', auth.isAuthenticated(), upload.single('myfile'), function(req,res,next){
  if(req.file){
    var imageUrl='http://52.78.65.255:3000/sign/upload/'+req.user.email;
    db.query('UPDATE user SET picture_id = ? where email= ?',[req.file.originalname, req.user.email],function(error,cursor){
      if(error){
        res.status(500).json({result : error});
      }
      else{
        console.log(req.file); //form files
        res.status(200).json({result:true, imageUrl:imageUrl});
      }
    });

  }else{
      res.status(200).end('Missing file');
  }
});
router.post('/signup', function(req, res, next) {
  var hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  db.query('insert into user(name, email, password) values(?,?,?)', [req.body.name, req.body.email, hash], function(error, cursor){
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
router.post('/signin', function(req, res, next){
  var hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  db.query('select * from user where email = ? and password = ?;', [req.body.email, hash], function(error, cursor){
    if (error){
      res.status(500).json({error : error});
    }
    else{
      if (cursor.length > 0){
        var imageUrl;
        if(cursor[0].picture_id==null){
          imageUrl="";
        }else{
          imageUrl='http://52.78.65.255:3000/sign/upload/'+req.body.email;
        }
        var token = auth.signToken(cursor[0].id, cursor[0].email);
        res.status(200).json({result : true, name : cursor[0].name, email :req.body.email, id: cursor[0].id, imageUrl:imageUrl, access_token:token});
      }
      else{
        res.status(200).json({result : false});
      }
    }
  });
});

router.get('/upload/:email', function(req,res,next){
    var email = req.params.email;
    console.log(email);
    var filename;
    db.query('select * from user where email=?',[req.params.email],function(error,cursor){
      if(error){
        res.status(500).json({error:error});
      }
      else{
        if(cursor.length > 0){
          filename=cursor[0].picture_id;
          var path='./upload/'+email+'/'+filename;
          fs.readFile(path,function(error,data){
            if(error){
              res.status(500).json({result:false, error:error});
            }
            else{
              console.log("success!");
              res.writeHead(200,{'Content-Type':'text/plain;  charset=utf-8'});
              res.end(data);
            }
          });
        }
        else{
          res.status(200).json({result:false, msg:'Missing File'});
        }
      }
    });
 });
router.get('/send', function(req, res, next){
  db.query('select * from users where email = ?', req.query.email, function(err,cursor){
    if(err)res.status(500).json({result:false, error:err});
    if(cursor[0].length>0){
      var myMsg = new Email(
        { from: req.query.email
        , to:   "to@naver.com"
        , subject: "롤러 비밀번호 변경"
        , body: "link"
      });
      myMsg.send(function(err){
        if(err){
          res.status(500).json({result:false, error:err});
        }
        res.status(200).json({result:true});
      });
    }else{
      res.status(200).json({result:true, msg:''})
    }

  });

});
router.get('/check', function(req, res, next){
  db.query('select * from user where name=? and email=?', [req.query.name, req.query.email],function(err,cursor){
    if (err){
      res.status(500).json({result:false, error:err});
    }
    if(cursor.length>0){
      res.status(200).json({result:true, msg:'확인되었습니다. 이메일을 확인해주세요.'});
    }else{
      res.status(200).json({result:true, msg:'사용자 정보가 존재하지 않습니다. 이름과 이메일을 확인해주세요.'});
    }
  });
});
router.post('/change', function(req, res, next){
  var hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  db.query('update user set password=? where email=?', [hash, req.body.email], function(err,cursor){
    if(err) res.status(500).json({result:fasle, error:err});
    res.status(200).json({result:true, msg:'비밀번호를 변경했습니다. 다시 로그인해주세요.'});
  });
});
module.exports = router;
