var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET offlinetest */
router.get('/offlinetest', function(req, res, next) {
  res.render('offlinetest');
});

module.exports = router;
