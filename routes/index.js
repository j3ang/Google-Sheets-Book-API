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

// GET /search
router.get('/search',(req,res)=>{
  res.render('search');
});


router.get('/search/:bookname', function(req, res, next) {
    var bookname = req.params.bookname;
    console.log("You searched@: " + bookname);
    const payload = {
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + bookname + '&maxResults=40',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
        },
        json: true
    };
    // Get jason data and stores them in arrays
    var books_title = [];
    var books_link = [];

    request(payload, function(err, output, body) {
        console.log("PAYLOAD URL:", payload.url);
        console.log(payload);
        var booksObj = body;
        reqBody = body;
        console.log(booksObj.items.length);


        for (var i = 0; i < reqBody.items.length; i++) {
            // console.log(booksObj.items[i].volumeInfo);
            // console.log(body);
            books_title.push(reqBody.items[i].volumeInfo.title);
            // console.log(books_title[i]);
        }


    });
    res.render('search', {
        title: 'Book Search',
        bookname: bookname
    });
});

router.post('/search/:bookname', function(req, res, next) {
    res.render('search', {
        title: 'Book post',
        bookname: bookname
    });
});

// when key in the search path
router.get('/search', function(req, res) {
    res.render('search', {
        title: 'Search Book'
    });
});

// listening on the index page
router.post('/search', (req, res, next) => {
    console.log("posting from index page--------------->");
    var bookname = req.body.bkname;
    var reqBody;
    console.log("index: the input is: ");
    console.log(req.body.bkname);
    var books = [];
    var items = {};

    var books_title = [];
    var books_authors = [];
    var books_link = [];
    var books_image = [];


    console.log('hihihihihi');


    const payload = {
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + bookname + '&maxResults=40',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
        },
        qs: {
            maxResults: 40
        },
        json: true
    };

    request(payload, function(err, output, body) {
        console.log("PAYLOAD URL:", payload.url);
        console.log(payload);
        var booksObj = body;
        reqBody = body;
        console.log(booksObj.items.length);

        // Get jason data and stores them in arrays
        for (var i = 0; i < reqBody.items.length; i++) {
            // console.log(booksObj.items[i].volumeInfo);
            // console.log(body);
            books.push(reqBody.items[i].volumeInfo);
            books_title.push(reqBody.items[i].volumeInfo.title);
            books_authors.push(reqBody.items[i].volumeInfo.authors);
            // console.log(books_title[i]);
        }

        res.render('search', {
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

router.get('/add',(req,res)=>{
  res.send('it works');
  console.log('it workda');
});

router.post('add', (req,res)=>{
  console.log(req.body);
});

module.exports = router;
