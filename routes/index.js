var express = require('express');
var request = require('request');
var bodyparser = require('body-parser');
var router = express.Router();
var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('--------------request header-----------------');
  console.log(req.headers);
  console.log('--------------request header-----------------');

    res.render('index', {
        title: 'Book Tracker'
    });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['openid email profile']
  }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res)=>{
    // Authenticated successfully
    res.redirect('/search');
  });

// GET /search for google callback to redirect
router.get('/search', function(req, res, next) {
    res.render('search', {
        title: 'Book Search'
    });
});

// GET /searchbook from index/search
router.post('/searchbook', function(req, res, next) {
    var bookname = req.body.bkname;
    console.log("----------------------post search-------------------------");
    console.log(bookname);
    console.log("----------------------post search-------------------------");

    var reqBody;
    var books = [];
    var items = {};

    var books_title = [];
    var books_authors = [];
    var books_link = [];
    var books_image = [];

    const payload = {
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + bookname + '&maxResults=40',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
        },
        json: true
    };

    request(payload, function(err, output, body) {
        console.log("PAYLOAD URL:", payload.url);
        console.log(payload);
        var booksObj = body;
        reqBody = body;
        console.log(booksObj.items.length);
        console.log("-------------------------------------------");

        // Get jason data and stores them in arrays
        for (var i = 0; i < reqBody.items.length; i++) {
            // console.log(booksObj.items[i].volumeInfo);
            // console.log(body);
            books.push(reqBody.items[i].volumeInfo);
            books_title.push(reqBody.items[i].volumeInfo.title);
            books_authors.push(reqBody.items[i].volumeInfo.authors);
            // console.log(books_title[i]);
        }


    // render the search page with results
    res.render('searchresult', {
        title: bookname,
        bookname: bookname,
        books:books,
        books_title: books_title,
        books_authors:books_authors,
        // books_link: books_link,
        // books_image:books_image,
        api_url: function() {
            return payload.url;
        }
        });


    });

});


router.get('/search/:bookname',(req,res)=>{
  console.log(req.body);
  res.send(req.params);

});


module.exports = router;
