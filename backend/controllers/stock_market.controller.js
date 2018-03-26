let stocksService = require('../services/stock_market.service');


exports.getCoinData = function(req,res,next) {
    let name = req.query.name;

    stocksService.getHistoricalData(name).then(function(result){
            return res.json(result);
    });

};