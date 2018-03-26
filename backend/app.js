let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let stocksService = require('./services/stock_market.service');

let api = require('./routes/api.route');

let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
server.listen(3001);

let currencyNames = new Set();
currencyNames.add('BTC');

io.on('connection', (socket) => {

    let apiSocket = stocksService.getSocket();

    console.log('new connection made');
    Promise.all(stocksService.getCoinData(currencyNames)).then(function (result) {
        console.log(Array.from(currencyNames));
        socket.emit('allCoinData', {
            msg: result,
            names: Array.from(currencyNames)
        })
    });

    socket.on('addCoin', (message) => {

        Promise.all(stocksService.getCoinData([message.msg])).then(
            function (result) {
                console.log(message.msg);
                socket.emit('oneCoinData', {
                    msg: result
                });
                console.log(message.msg);

            }).then(
            apiSocket.emit('SubAdd', {subs: ['2~Poloniex~' + message.msg + '~USD']})
        );

    });


    apiSocket.on('m', function (message) {
        io.sockets.emit('sendingCurrData', {
            msg: message
        })
    });


});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
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
