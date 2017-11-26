var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function(req,res){

  });


  gapi.client.getToken(gapi.sheets_auth_url, function(err,tokens){
                       gapi.client.credentials=tokens;
                       })
  res.render('connect.pug', {title: 'Book Tracker Authorized',
     url: gapi.sheets_auth_url,
     url_text: 'Google SpreadSheets'})

});



module.exports = router;
