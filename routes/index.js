var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Codeshare, Pair programming platform' });
});

router.get("/about", function(req, res, next) {
  res.render('about', { title: 'Codeshare, pair programming platform' });
});

module.exports = router;
