var express = require('express');

var router = express.Router();
var stock_market = require('./api/stock_market.route');

router.use('/stock', stock_market);

module.exports = router;