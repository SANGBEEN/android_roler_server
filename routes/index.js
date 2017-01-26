var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',function(req,res){
  console.log("hello");
         res.render('index', {
             title: "MY HOMEPAGE",
             length: 5
         })
     });


module.exports = router;
