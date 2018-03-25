let stocksService = require('../services/stock_market.service');


exports.getStock = function(req,res,next) {
    let name = req.query.name;
    console.log(name +"name");

    // stocksService.getStocks(name).then(function(result){
    //         return res.json(result);
    // });
    stocksService.addStock(name);
};