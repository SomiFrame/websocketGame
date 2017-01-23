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
var PlayerList = {};
app.set('views', pathconfig.viewPath);
app.set('view engine', 'jade');
app.use(express.static(pathconfig.public));
//玩家类
var Player = function (id) {
    var canvas = {
        width: 1000,
        height: 600
    };
    var self = {
        id: id,
        canvas: canvas,
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: 20,
            color: '#000'
        },
        ballOption: {
            sx: 0,
            sy: -10,
            gv: .4
        }
    };
    return self;
};
io.on('connection', function (socket) {
    socket.id = uuid.v4();
    PlayerList[socket.id] = new Player(socket.id);
    SocketList[socket.id] = socket;
    socket.emit('init', PlayerList[socket.id].canvas);
    socket.on('disconnect', function () {
        delete PlayerList[socket.id];
        delete SocketList[socket.id];
    });
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
    var pack = [];
    for (var j in PlayerList) {
        var player = PlayerList[j];
        player.ballOption.sy += .4;
        player.ball.x += player.ballOption.sx;
        player.ball.y += player.ballOption.sy;
        player.ball.r = 10;
        player.ball.color = '#000';
        // 地面の衝突判定
        if (player.ball.y > player.canvas.height - player.ball.r) {
            player.ballOption.sy *= -0.7;
            player.ballOption.sx *= 0.7;
            player.ball.y = player.canvas.height - player.ball.r;
        }
        pack.push(player.ball);
    }
    
    for (var i in SocketList) {
        var socket = SocketList[i];
        socket.emit('ball change', pack);
    }
}, 1000 / 25);