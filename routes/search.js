var express = require('express');
var router = express.Router();
var request = require('request');
var bodyparser = require('body-parser');
var passport = require('passport');


// GET /search home page search view
router.get('/', function(req, res) {
    console.log("search.js was run. router.get /");
    res.render('search',{
        title: 'Book Tracker',
        submission:'book was added'
    });
});

// Get /search/init from searchresult view
router.get('/init', function(req,res){
    console.log('search.js: get /init was run');
    console.log(req.query.bkname);

    var bookname = req.query.bkname;
    var books = [];

    var books_title = [];
    var books_authors = [];

    const payload = {
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + bookname + '&maxResults=40',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
        },
        json: true
    };

    // Go the bookname do the post request here
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
        res.render('searchresult',{
                title:bookname,
                books:books
        });
    });

// router.get('/?bkname=', function (req, res) {
//     console.log("I see the Ajax request here");
//     res.send(req.params);
// })
//
// router.post('/?bkname=', function(req, res) {
//     var bookname = req.url;
//     console.log("----------------------post search-------------------------");
//     console.log(bookname);
//     console.log("----------------------post search-------------------------");
//
//     var reqBody;
//     var books = [];
//
//     var books_title = [];
//     var books_authors = [];
//     var books_link = [];
//     var books_image = [];
//
//     const payload = {
//         url: 'https://www.googleapis.com/books/v1/volumes?q=' + bookname + '&maxResults=40',
//         method: 'GET',
//         headers: {
//             'Accept': 'application/json',
//             'Accept-Charset': 'utf-8',
//         },
//         json: true
//     };
//
//     // Request
//     request(payload, function(err, output, body) {
//         console.log("PAYLOAD URL:", payload.url);
//         console.log(payload);
//         var booksObj = body;
//         reqBody = body;
//         console.log(booksObj.items.length);
//         console.log("-------------------------------------------");
//
//         // Get jason data and stores them in arrays
//         for (var i = 0; i < reqBody.items.length; i++) {
//             // console.log(booksObj.items[i].volumeInfo);
//             // console.log(body);
//             books.push(reqBody.items[i].volumeInfo);
//             books_title.push(reqBody.items[i].volumeInfo.title);
//             books_authors.push(reqBody.items[i].volumeInfo.authors);
//             // console.log(books_title[i]);
//         }
//
//
//     // render the search page with results
//     res.render('search');
//
//     });
//

});


module.exports = router;
