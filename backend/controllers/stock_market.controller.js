var stocksService = require('../services/stock_market.service');


exports.getStock = function(req,res,next) {

    var stocks = stocksService.getStocks().then(function(result){
            console.log("test");
        console.log(result);
    });
    response = {
        "Hello": 'test'
    };

    return res.json(response);
};