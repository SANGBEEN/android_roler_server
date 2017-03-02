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
        var token = req.headers['access_token'];
        if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
      }

        // 토큰 인증 로직
        validateJwt(req, res, next)
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
