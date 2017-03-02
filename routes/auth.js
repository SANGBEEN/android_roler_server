'use strict';
var token_config = require('../config/token-config.json')
var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
var SECRET = token_config.secret;
var EXPIRES = 60; // 1 hour

// JWT 토큰 생성 함수
function signToken(id,email) {
  return jwt.sign({id: id, email:email}, SECRET, { expiresIn: EXPIRES });
}

// jwt에서 사용한 시크릿 문자열과 동일한 문자열로 객체 생성
var validateJwt = require('express-jwt')({secret: SECRET});

function isAuthenticated() {
  return compose()
      // Validate jwt
      .use(function(req, res, next) {
        // 만약 access_token 파라메터에 토큰을 설정한 경우 리퀘슽 헤더에 토큰을 설정한다.
        if(req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = 'Bearer ' + req.query.access_token;
        }else{
          console.log("failed");
          res.json({result:false, msg:"invaild token"})
        }

        // 토큰 인증 로직
        validateJwt(req, res, next);
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


exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;
