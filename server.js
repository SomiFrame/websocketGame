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
var TubingList = {};

app.set('views', pathconfig.viewPath);
app.set('view engine', 'jade');
app.use(express.static(pathconfig.public));
//画布
var canvas = {
    width: 1000,
    height: 600
};
//玩家类
var Player = require('./resources/assets/js/es5/player.js');
//油管
var Tubing = require('./resources/assets/js/es5/tubing.js');

for (var i = 0; i < 4; i++) {
    TubingList[i] = Tubing().create(i,canvas);
}
//检测器
var detection = require('./resources/assets/js/es5/detection.js')();


io.on('connection', function (socket) {
    socket.id = uuid.v4();
    PlayerList[socket.id] = Player().create(socket.id,canvas);
    SocketList[socket.id] = socket;
    socket.emit('init', PlayerList[socket.id].self.canvas);
    socket.on('disconnect', function () {
        delete PlayerList[socket.id];
        delete SocketList[socket.id];
    });
    socket.on('ball jump', function () {
        if(!PlayerList[socket.id]) {
            console.log('some loser try to control the ball');
            return;
        }
        PlayerList[socket.id].self.ballOption.sy = -7;
    });
});
app.get('/', function (req, res) {
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

var loopId = setInterval(function () {
    var ballPack = [];
    var tubingPack = [];
    for (var t in TubingList) {
        var tubing = TubingList[t];
        tubing.move(); 
        tubingPack.push(tubing.self);
    }
    for (var j in PlayerList) {
        var player = PlayerList[j];
        player.move();
        detection.detectBoundary(player.self);
        for (var t in TubingList) {
            var tubing = TubingList[t];
            if (detection.detectCrash(player.self,tubing.self)) {
                // var pack = new explosion(player.ball.x, player.ball.y);
                // SocketList[player.id].emit('explosion', pack);
                // delete PlayerList[player.id];
                // console.log('crash');
            }
        }
        ballPack.push(player.self.ball);
    }
    var Pack = {
        ballPack: ballPack,
        tubingPack: tubingPack
    };

    for (var i in SocketList) {
        var socket = SocketList[i];
        socket.emit('change', Pack);
    }
}, 1000 / 25);