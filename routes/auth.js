'use strict';
var token_config = require('../config/token-config.json')
var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
//var express = require('express');
//var router = express.Router();
var SECRET = token_config.secret;
var EXPIRES = "30m";

// access_token 토큰 생성 함수
function signAccessToken(id,email) {
  return jwt.sign({id: id, email:email}, SECRET, { expiresIn: EXPIRES });
}
// refresh_token 토큰 생성 함수
function signRefreshToken(id,email) {
  return jwt.sign({id: id, email:email}, SECRET, { expiresIn: "365d" });
}
// 토큰을 해석하여 유저 정보를 얻는 함수
function isAuthenticated() {
  return compose()
      // Validate jwt
      .use(function(req, res, next) {
        var token = req.headers['access_token'];
        if(token){
          var decoded = jwt.verify(token, SECRET,function(err,decoded){
            console.log(err)
            if(err==null){
              console.log('token verify');
              req.user = decoded;
              next();
            }else if (err.message=='invalid token') {
              return res.status(403).json({ result : false, message : 'invalid token'});
            }else if(err.message=='jwt expired'){
              console.log(decoded);
              return res.status(403).json({ result : false, message : 'jwt expired'});
            }else if(err){
                return res.status(403).json({ result : false, error:err});
            }
        });
      }else{
        return res.status(403).json({success : false, message : '인증 토큰이 없습니다.'});
      }
    })
      // Attach user to request
      .use(function(req, res, next) {
        req.user = {
          id: req.user.id,
          email: req.user.email
        };
        next();
      });
}

// 인증 확인 부분
// function isAuthenticated(req,res){
//     var token = req.headers['access_token'];
//     try{
//       if (token){
//           jwt.verify(token, SECRET, function(err, decoded) {
//
//               if ( err ) {
//                   return res.status(403).send({ success : false, message : '토큰 인증 실패.'});
//               } else {
//                   console.log('token verify');
//                   return decoded;
//
//               }
//           });
//       } else {
//           return res.status(403).send({success : false, message : '인증 토큰이 없습니다.'});
//       }
//     }catch(err){
//       console.log(err);
//       return res.status(500).json({result:err});
//     }
//
// };




// jwt에서 사용한 시크릿 문자열과 동일한 문자열로 객체 생성
//var validateJwt = require('express-jwt')({secret: SECRET});

// function isAuthenticated() {
//   return compose()
//       // Validate jwt
//       .use(function(req, res, next) {
//         var token = req.headers['access_token'];
//         if(!token) {
//         return res.status(403).json({
//             success: false,
//             message: 'not logged in'
//         })
//       }
//
//         // 토큰 인증 로직
//         const p = new Promise(
//         (resolve, reject) => {
//             jwt.verify(token, SECRET, (err, decoded) => {
//                 if(err) reject(err)
//                 resolve(decoded)
//             })
//         }
//     )
//     const respond = (token) => {
//       var info = jwt.decode(token, SECRET);
//       res.json({
//             success: true,
//             info: token
//         })
//    }
//
//    // if it has failed to verify, it will return an error message
//    const onError = (error) => {
//        res.status(403).json({
//            success: false,
//            message: error.message
//        })
//    }
//
//    // process the promise
//    p.then(respond).catch(onError)
//       })
// }

exports.signAccessToken = signAccessToken;
exports.isAuthenticated = isAuthenticated;
