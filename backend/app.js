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


io.on('connection', (socket) => {
    console.log('new connection made');

    socket.on('getStockData', (data) => {
        stocksService.addStock(data.name);
        let apiSocket = stocksService.getSocket();

        apiSocket.on('m', function(message){
            io.sockets.emit('sendingStockData',{
                msg: message
            })
        });


        // Promise.all(stocksService.getStocks()).then(function(result){
        //     // console.log(io.sockets.emit());
        //
        //     io.sockets.emit('sendingStockData', {
        //         msg: result
        //     });
        // });
    });

});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
