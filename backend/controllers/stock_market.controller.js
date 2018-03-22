var stocksService = require('../services/stock_market.service');


exports.getStock = function(req,res,next) {
    var name = req.query.name;
    console.log(name +"name");

    stocksService.getStocks(name).then(function(result){
            return res.json(result);
    });
};