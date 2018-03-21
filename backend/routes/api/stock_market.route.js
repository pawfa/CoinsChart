var express = require('express')

var router = express.Router()

// Getting the Todo Controller that we just created

var StockController = require('../../controllers/stock_market.controller');


// Map each API to the Controller FUnctions

router.get('/:id', StockController.getStock);

// router.delete('/:id',StockController.removeStock);


// Export the Router

module.exports = router;