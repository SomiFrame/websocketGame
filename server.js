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
//画布
var canvas = {
    width: 1000,
    height: 600
};
//玩家类
var Player = function (id) {
    var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    var self = {
        id: id,
        canvas: canvas,
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: 20,
            color: color
        },
        ballOption: {
            sx: 0,
            sy: -10,
            gv: .7
        }
    };
    return self;
};
var explosion = function (x, y) {
    var density = 50;
    var particles = [];
    for (var i = 0; i < density; i++) {
        var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        var scale = ~~(Math.random() * 5) + 3;
        var vx = Math.random() * 10 - 5;
        var vy = Math.random() * 9 + 4;
        var g = Math.random() * 0.2 + 0.3;
        particles.push({
            ball: {
                x: x,
                y: y,
                r: 20 * scale,
                color: color
            },
            ballOption: {
                sx: vx,
                sy: -vy,
                gv: g
            }
        })
    }
    return particles;
};
//油管
var Tubing = function (id) {
    var id = id;
    var intervalHeight = 100;
    var intervalWidth = canvas.width / 4;
    var tHeight = (canvas.height - intervalHeight) * Math.random();
    var bHeight = canvas.height - tHeight - intervalHeight;
    var self = {
        initPositionX: canvas.width,
        id: id,
        sy: 0,
        sx: -2,
        width: 40,
        color: '#000',
        topPositionX: canvas.width + (intervalWidth * id),
        topPositionY: 0,
        bottomPositionX: canvas.width + (intervalWidth * id),
        bottomPositionY: tHeight + intervalHeight,
        topHeight: tHeight,
        bottomHeight: bHeight
    };
    return self;
};
var TubingList = {};
for (var i = 0; i < 4; i++) {
    TubingList[i] = new Tubing(i);
}
io.on('connection', function (socket) {
    socket.id = uuid.v4();
    PlayerList[socket.id] = new Player(socket.id);
    SocketList[socket.id] = socket;
    socket.emit('init', PlayerList[socket.id].canvas);
    socket.on('disconnect', function () {
        delete PlayerList[socket.id];
        delete SocketList[socket.id];
    });
    socket.on('ball jump', function () {
        PlayerList[socket.id].ballOption.sy = -7;
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
    var Pack = {};
    var ballPack = [];
    var tubingPack = [];
    for (var t in TubingList) {
        var tubing = TubingList[t];
        tubing.topPositionX += tubing.sx;
        tubing.bottomPositionX += tubing.sx;
        if (tubing.topPositionX < -tubing.width) {
            tubing.topPositionX = tubing.initPositionX;
            tubing.bottomPositionX = tubing.initPositionX;
        }
        tubingPack.push(tubing);
    }
    for (var j in PlayerList) {
        var player = PlayerList[j];
        player.ballOption.sy += player.ballOption.gv;
        player.ball.x += player.ballOption.sx;
        player.ball.y += player.ballOption.sy;
        player.ball.r = 10;
        // 地面の衝突判定
        if (player.ball.y > player.canvas.height - player.ball.r) {
            player.ballOption.sy *= -0.7;
            player.ballOption.sx *= 0.7;
            player.ball.y = player.canvas.height - player.ball.r;
        }
        if (player.ball.y < player.ball.r) {
            player.ballOption.sy *= -0.7;
            player.ball.y = player.ball.r;
        }
        for (var t in TubingList) {
            var tubing = TubingList[t];
            if (player.ball.x + player.ball.r > tubing.topPositionX
                && player.ball.x - player.ball.r < tubing.topPositionX + tubing.width
                && player.ball.y < tubing.topHeight
                ||
                player.ball.x + player.ball.r > tubing.bottomPositionX
                && player.ball.x + player.ball.r < tubing.bottomPositionX + tubing.width
                && player.ball.y > tubing.bottomPositionY) {
                var pack = new explosion(player.ball.x, player.ball.y);
                SocketList[player.id].emit('explosion', pack);
                delete PlayerList[player.id];
            }
        }
        ballPack.push(player.ball);
    }
    Pack = {
        ballPack: ballPack,
        tubingPack: tubingPack
    };

    for (var i in SocketList) {
        var socket = SocketList[i];
        socket.emit('change', Pack);
    }
}, 1000 / 25);