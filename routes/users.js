var request = require('request');
var express = require('express');
var router = express.Router();
var fs = require('fs');


/*
  ALL OF THE ROUTES IN THIS PAGE REQUIRE AN AUTHENTICATED USER
*/
console.log("Users %d",8);

/* GET users listing. */
router.get('/', function(req, res, next) {

  
  
  fs.appendFile('userInfo.txt', JSON.stringify(req.user)+"\r\n", function (err) {
  if (err) throw err;
  console.log('Saved!');
  

  
  
}); 

  res.render('users', {
    title: 'Users',
    user: req.user
  });
});



module.exports = router;
