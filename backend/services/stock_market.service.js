var https = require("https");


var url = 'www.alphavantage.co';
var apiKey = 'YBC4DDBX1TSWJH0B';
var symbol = '';
var options = {
    host: url,
    method: 'GET'
};

exports.getStocks =  function(stockName){
    console.log(stockName+"stockname");
    return new Promise (function(resolve, reject){


    symbol = stockName;
    options.path = '/query?function=TIME_SERIES_WEEKLY&symbol='+symbol+'&apikey='+apiKey;

    https.request(options, function(res) {
        var body = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function(){
            const data = JSON.parse(body);
            resolve( data ) ;
        })
    }).end();
    })
};


