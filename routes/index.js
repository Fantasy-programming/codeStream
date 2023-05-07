var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Codeshare, Pair programming platform' });
});

router.get("/about", function (req, res, next) {
  res.render('about', { title: 'Codeshare, pair programming platform' });
});

router.route("/contact")
  .get(function (req, res, next) {
    res.render('contact', { title: 'Codeshare, pair programming platform' });
  })
  .post(function (req, res, next) {
    res.render('thank', { title: 'Codeshare, pair programming platform' })
  });

module.exports = router;
