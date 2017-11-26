var express = require('express');
var gapi = require('../lib/gapi');
var router = express.Router();

router.get('/connect', function(req,res){
  var code = req.query.code;
  console.log(code);
  gapi.client.getToken(code, function(err,tokens){
                       gapi.client.credentials=tokens;})
  res.render('connect.pug', {title: 'Book Tracker Authorized',
     url: 'http://localhost:8000/auth/google/callback',
     url_text: 'Google SpreadSheets'})

});

module.exports = router;
