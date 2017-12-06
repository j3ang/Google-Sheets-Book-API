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

    res.render('search', {
        title: 'Book Tracker',
        submition:'book added'
    });
});

module.exports = router;

