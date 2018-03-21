var stocksService = require('../services/stock_market.service');


exports.getStock = function(req,res,next) {
    var name = req.query.name;

    var stocks = stocksService.getStocks(name).then(function(result){
            return res.json(result);
    });

    // return res.json(response);
};