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

/* GET offlinetest2 */
router.get('/offlinetest2', function(req, res, next) {
  res.render('offlinetest2');
});

module.exports = router;
