var express = require('express');
var app = express();
var uuid = require('node-uuid');
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
var SocketList = {};
app.set('views', pathconfig.viewPath);
app.set('view engine', 'jade');
app.use(express.static(pathconfig.public));
io.on('connection', function (socket) {
    socket.id = uuid.v4();
    socket.canvas= {
        width: 1000,
        height: 600
    };
    socket.ball = {
        x: socket.canvas.width/2,
        y: socket.canvas.height/2,
        r: 20,
        color: '#000'
    };
    socket.ballOption = {
        sx: 0,
        sy: -10,
        gv: .4
    };
    socket.emit('init', socket.canvas);
    SocketList[socket.id] = socket;
});
app.get('/', function (req, res) {
    console.log('index page');
    res.render('index');
});
Gamerouter.use((req, res, next)=> {
    next();
}).get('/index', (req, res, next)=> {
    console.log('route game router index');
    res.render('GameView/GameOne');
});
app.use('/game', Gamerouter);

server.listen(hostPort, ()=> {
    console.log('Example app listening on port 3000!');
});

setInterval(function () {
    for (var i in SocketList) {
        var socket = SocketList[i];
        socket.ballOption.sy += .4;
        socket.ball.x += socket.ballOption.sx;
        socket.ball.y += socket.ballOption.sy;
        socket.ball.r = 10;
        socket.ball.color = '#000';
        socket.emit('ball change', socket.ball);
    }
}, 1000 / 30);