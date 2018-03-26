let stocksService = require('../services/stock_market.service');


exports.getCurrencies = function(req,res,next) {
    let name = req.query.name;

    stocksService.getCurrencies().then(function(result){
            return res.json(result);
    });

};