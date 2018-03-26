let express = require('express');

let router = express.Router();

// Getting the Todo Controller that we just created

let StockController = require('../../controllers/stock_market.controller');


// Map each API to the Controller FUnctions

router.get('/', StockController.getCurrencies);


// Export the Router

module.exports = router;