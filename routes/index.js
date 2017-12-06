var express = require('express');
var router = express.Router();
var request = require('request');
var bodyparser = require('body-parser');
var DelimiterStream = require('delimiter-stream');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var query = require('array-query');
var passport = require('passport');

var delimiterstream = new DelimiterStream({
    delimiter: '"'
});
var theBook;
delimiterstream.on('data', function(chunk) {
    var books=[];
    books.push(decoder.write(chunk));
    // console.log("--------------------TheBooks------------------------")
    theBook = books.pop();
    // console.log("this is the book:" + theBook);
    // console.log("--------------------TheBooks------------------------")
});


router.get('/', function(req, res) {
    console.log("index.js was run. router.get /");
    res.render('search');
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile']
    }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback',
    function (req, res){
        console.log("google authenticate successful!");
        // Authenticated successfully
        res.render('search',{
            title: 'added',
            submission:'book was added'
        });
    });




module.exports = router;
