var https = require("https");


var url = 'www.alphavantage.co';
var apiKey = 'YBC4DDBX1TSWJH0B';
var symbol = '';
var options = {
    host: url,
    method: 'GET'
};

exports.getStocks =  function(stockName){
    console.log(stockName);
    return new Promise (function(resolve, reject){


    symbol = stockName;
    options.path = '/query?function=TIME_SERIES_WEEKLY&symbol='+symbol+'&apikey='+apiKey;

    https.request(options, function(res) {
        var data;
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            data = chunk;
        });
        res.on('end', function(){
            resolve( data);
        })
    }).end();
    })
};


