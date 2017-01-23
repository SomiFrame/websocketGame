var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var Gamerouter = express.Router();
var fs = require('fs');

var pathconfig = {
    public: path.join(__dirname, 'public'),
    viewPath: path.join(__dirname, 'resources', 'views'),
    assetsPath: path.join(__dirname, 'resources', 'assets')
};

var hostBaseUrl = 'localhost',
    hostPort = 3031;

app.set('views', pathconfig.viewPath);
app.set('view engine', 'jade');
app.use(express.static(pathconfig.public));
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.somi = 1;
    socket.on('disconnect',function(e) {
        console.log('user disconnected');
    });
    socket.on('chat message',function(e) {
        console.log(e);
    });
    socket.emit('an event sent to all connected clients');
});
app.get('/', function (req, res) {
    console.log('index page');
    res.render('index');
});
Gamerouter.use((req, res, next)=> {
    next();
}).get('/index', (req, res, next)=> {
    console.log('route gamerouter index');
    res.render('GameView/GameOne');
});
app.use('/game', Gamerouter);

server.listen(hostPort, ()=> {
    console.log('Example app listening on port 3000!');
});
var requestAnimFrame =
    function (callback) {
        return window.setTimeout(callback, 1000);
    };
var cancelAnimFrame =
    function (ID) {
        return window.clearTimeout(ID);
    };