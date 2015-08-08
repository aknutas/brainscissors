var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var net = require('net');
var http2 = require('http');
var S = require('string');

var routes = require('./routes/index');

//Start express
var app = express();

//Start Socket.IO
sserver = http2.Server(app);
var io = require('socket.io')(sserver);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

// Socket.IO
io.on('connection', function(socket){
    console.log('new client connected');
    socket.on('handshake', function(msg){
        console.log('Got Socket.IO handshake: ' + msg.msg);
        io.emit('handshake', {msg: 'hi'});
    });
});

sserver.listen(3500, function(){
    console.log('Socket.IO server listening on *:3500');
});

// Connect to brainwave server (set host to brainwave server address)
var client = net.connect({host: 'localhost', port: 13854},
    function () { //'connect' listener
        console.log('connected to server!');
        client.write('{"enableRawOutput":false,"format":"Json"}\r');
    });
client.on('data', function (data) {
    cleandata = S(data.toString()).trim().s;
    // console.log(cleandata);
    var jsonobject = JSON.parse(cleandata);
    console.log(jsonobject);
    if(jsonobject.eegPower) 
        io.emit('eeg', {eeg: jsonobject});
});
client.on('end', function () {
    console.log('disconnected from server');
});
client.on('error', function(err) {
    console.log('Mindwave server connection error:' + err);
});
