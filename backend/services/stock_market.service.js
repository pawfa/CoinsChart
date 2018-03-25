let https = require("https");
let url = 'www.alphavantage.co';
let apiKey = 'YBC4DDBX1TSWJH0B';
let symbol = '';
let options = {
    host: url,
    method: 'GET'
};
let stockNames = new Set();
let promises = [];

const socket = require('socket.io-client')('wss://streamer.cryptocompare.com');


socket.on('m', (message) => {console.log( message)});

socket.on('connect', () => {
    console.log("connected to coin api");
        socket.emit('SubAdd', { subs: ['5~CCCAGG~BTC~USD','5~CCCAGG~ETH~USD' ] } );

});

// Disconnect from the channel
socket.on('disconnect', () => console.log('Disconnected.'));


exports.getSocket =  function(){
        return socket;
};

exports.addStock = function(stockName){
    stockNames.add(stockName);
    console.log(Array.from(stockNames).join().toLowerCase());
    // socket.emit('subscribe', Array.from(stockNames).join().toLowerCase());
    // socket.emit('subscribe', 'snap');



    // promises.push(
    // new Promise (function(resolve, reject){
    //
    //
    //     symbol = stockName;
    //     options.path = '/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&apikey='+apiKey;
    //
    //     https.request(options, function(res) {
    //         let body = '';
    //
    //         res.setEncoding('utf8');
    //         res.on('data', function (chunk) {
    //             body += chunk;
    //         });
    //         res.on('end', function(){
    //             const data = JSON.parse(body);
    //             resolve( data ) ;
    //         })
    //     }).end();
    // })
    // );


};


