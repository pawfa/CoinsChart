let https = require("https");
let options = {
    host: 'min-api.cryptocompare.com',
    method: 'GET'
};
// let currencyNames = new Set();
// currencyNames.add('BTC');

const socket = require('socket.io-client')('wss://streamer.cryptocompare.com');

socket.on('m', (message) => {
    console.log(message)
});

socket.on('connect', () => {
    console.log("connected to coin api");
    socket.emit('SubAdd', {subs: ['2~Poloniex~' + 'BTC' + '~USD']});

});
socket.on('disconnect', () => console.log('Disconnected.'));


exports.getCoinData = function(currencyNames){
    let promiseArray =[];
    for (let currency of currencyNames){
        promiseArray.push(
         new Promise(function (resolve, reject) {

            options.path = '/data/histoday?fsym=' + currency + '&tsym=USD&limit=30';

            https.request(options, function (res) {
                let body = '';

                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end', function () {
                    const data = JSON.parse(body);
                    resolve(data);
                })
            }).end();
        })
    )
    }
    return promiseArray;

};

exports.getHistoricalData = function (currName) {
    currencyNames.add(currName);

    socket.emit('SubAdd', {subs: ['2~Poloniex~' + currName + '~USD']});

    return new Promise(function (resolve, reject) {

        options.path = '/data/histoday?fsym=' + currName + '&tsym=USD&limit=30';

        https.request(options, function (res) {
            let body = '';

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                const data = JSON.parse(body);
                resolve(data);
            })
        }).end();
    });


};

exports.addCoin = function (coinName) {
    console.log(coinName);
    currencyNames.add(coinName);

};

exports.getSocket = function () {
    return socket;
};


