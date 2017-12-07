'use strict';

var express = require('express');
var router = express.Router();
var models = require('./models');
var Sequelize = require('sequelize');
var request = require('request');
var helpers = require('handlebars-helpers')();

// TODO: Show spreadsheets on the main page.
router.get('/', function(req, res, next) {
  console.log("index.js was run. router.get /");
  res.render('index');
  // var options = {
  //   book: [['createdAt', 'DESC']]
  // };
  // Sequelize.Promise.all([
  //   models.book.findAll(options),
  //   models.Spreadsheet.findAll(options)
  // ]).then(function(results) {
  //   res.render('index', {
  //     books: results[0],
  //     spreadsheets: results[1]
  //   });
  // });
});

router.get('/createbook', function(req, res, next) {
  console.log('get /create was called');
  res.render('upsert', {
      title: 'Create Book'
    }, function(err) {
      next(err);
    });
});


// Get /search/init from searchresult view
router.get('/search', function(req,res){
    console.log('routes.js: get /search was run');
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
        var reqBody = body;
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
});

router.get('/edit/:id', function(req, res, next) {
  models.book.findById(req.params.id).then(function(book) {
    if (book) {
      res.render('upsert', {
        book: book
      });
    } else {
      next(new Error('book not found: ' + req.params.id));
    }
  });
});

router.get('/delete/:id', function(req, res, next) {
  models.book.findById(req.params.id)
    .then(function(book) {
      if (!book) {
        throw new Error('book not found: ' + req.params.id);
      }
      return book.destroy();
    })
    .then(function() {
      res.redirect('/');
    }, function(err) {
      next(err);
    });
});

router.post('/upsert', function(req, res, next) {
  models.Book.upsert(req.body).then(function() {
    res.redirect('/');
  }, function(err) {
    next(err);
  });
});

// TODO: Add route for creating spreadsheet.
var SheetsHelper = require('./sheets');

router.post('/spreadsheets', function(req, res, next) {
  var auth = req.get('Authorization');
  if (!auth) {
    return next(Error('Authorization required.'));
  }
  var accessToken = auth.split(' ')[1];
  var helper = new SheetsHelper(accessToken);
  var title = 'books (' + new Date().toLocaleTimeString() + ')';
  helper.createSpreadsheet(title, function(err, spreadsheet) {
    if (err) {
      return next(err);
    }
    var model = {
      id: spreadsheet.spreadsheetId,
      sheetId: spreadsheet.sheets[0].properties.sheetId,
      name: spreadsheet.properties.title
    };
    models.Spreadsheet.create(model).then(function() {
      return res.json(model);
    });
  });
});

// TODO: Add route for syncing spreadsheet.
router.post('/spreadsheets/:id/sync', function(req, res, next) {
  var auth = req.get('Authorization');
  if (!auth) {
    return next(Error('Authorization required.'));
  }
  var accessToken = auth.split(' ')[1];
  var helper = new SheetsHelper(accessToken);
  Sequelize.Promise.all([
    models.Spreadsheet.findById(req.params.id),
    models.book.findAll()
  ]).then(function(results) {
    var spreadsheet = results[0];
    var books = results[1];
    helper.sync(spreadsheet.id, spreadsheet.sheetId, books, function(err) {
      if (err) {
        return next(err);
      }
      return res.json(books.length);
    });
  });
});


module.exports = router;
