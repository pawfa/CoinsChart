let express = require('express');

let router = express.Router();
let stock_market = require('./api/stock_market.route');

router.use('/currencies', stock_market);


module.exports = router;