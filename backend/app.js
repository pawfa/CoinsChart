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
let currencyNames = new Set();

io.on('connection', (socket) => {

    socket.on('getInitializationData', () => {
        if (currencyNames.size > 0) {
            Promise.all(stocksService.getCoinData(currencyNames)).then(function (result) {
                socket.emit('allCoinData', {
                    msg: result,
                    names: Array.from(currencyNames)
                })
            });
        }
    });

    // socket.on('addCoin', (message) => {
    //
    //     let arr = message.msg;
    //     let diff = Array.from(arr).filter(x => arr.indexOf(x) < 0 );
    //     currencyNames.add(message.msg);
    //     console.log(diff+"difference");
    //     Promise.all(stocksService.getCoinData(diff)).then(
    //
    //         function (result) {
    //             // console.log(result);
    //             io.sockets.emit('allCoinData', {
    //                 msg: result,
    //                 names: diff
    //             });
    //
    //         }).then(
    //         apiSocket.emit('SubAdd', {subs: ['2~Poloniex~' + message.msg + '~USD']})
    //     );
    // });

    socket.on('addCoin', (message) => {
        currencyNames.add(message.msg);
        io.sockets.emit('addedCoin', {
            msg: message.msg,
            selected: true
        });

    });

    socket.on('removeCoin', (message) => {
            currencyNames.delete(message.msg);
        io.sockets.emit('removedCoin', {
            msg: message.msg,
            selected: false
        });

    });

});



apiSocket.on('m', function (message) {
    io.sockets.emit('sendingCurrData', {
        msg: message
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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // res.setHeader('Access-Control-Allow-Origin', 'http://charts.pawfa.usermd.net');
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
