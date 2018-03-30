let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
var cors = require('cors')

let stocksService = require('./services/stock_market.service');

let api = require('./routes/api.route');

let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
server.listen(3001);

let apiSocket = stocksService.getSocket();
let currencyNames = [];
let currencyHistoricalData = [];
let coinLive = '';

stocksService.getCurrencies().then(
    function (result) {
        let arr = [];
        let i = 0;
        result['Data'].map((e) => {
            currencyNames.push(
                {
                    name: e['SYMBOL'],
                    selected: false,
                    id: i++
                }
            );
            arr.push(stocksService.getCoinData(e['SYMBOL']), e['SYMBOL']);
        });
        return Promise.all(arr);
    }
).then(
    (e) => currencyHistoricalData = e
);

io.on('connection', (socket) => {

    socket.on('getInitializationData', () => {
        console.log("przesylam poczatkowe dane");
        socket.emit('coinsList', {
            msg: currencyNames,
            coinsData: currencyHistoricalData
        })
    });


    socket.on('changeCoinArray', (message) => {
        console.log("added rray" + message.msg);
        currencyNames = message.msg;
        socket.broadcast.emit('changeCoinArray', {
            msg: message.msg
        });
    });

    socket.on('getCoinLive', (message) => {
        console.log(coinLive);
        if(!(coinLive === '')){
            console.log('remove sub'+ coinLive)
            apiSocket.emit('SubRemove',{subs: ['2~Poloniex~' + coinLive + '~USD']})
        }
        coinLive = message.msg;
        apiSocket.emit('SubAdd', {subs: ['2~Poloniex~' + message.msg + '~USD']})

    });


    // socket.on('addCoin', (message) => {
    //     console.log("added coin"+message.msg);
    //     currencyNames.add(message.msg);
    //     socket.broadcast.emit('addedCoin', {
    //         msg: message.msg,
    //         selected: true
    //     });
    // });

    // socket.on('removeCoin', (message) => {
    //     console.log(message.msg);
    //     currencyNames.delete(message.msg);
    //     io.sockets.emit('removedCoin', {
    //         msg: message.msg,
    //         selected: false
    //     });
    // });

});

apiSocket.on('m', (e) => {
    io.sockets.emit('coinLiveData', {
        msg: e,
        name: coinLive
    })
});
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use(function (req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', 'http://charts.pawfa.usermd.net');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
