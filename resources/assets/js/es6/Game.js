import Material from './Class_Material';
import Tubing from './Class_Tubing';
var io = require('socket.io-client');
let LoopID;
let gameCanvas = document.getElementById('gameArea');
let gameCtx = gameCanvas.getContext('2d');
// let ball = new Material(gameCanvas, gameCanvas.width / 2, 0, 10, 0, -10, .4);
// let arrayTubs = [];
// for (let i = 0; i < 4; i++) {
//     arrayTubs.push(new Tubing(gameCanvas, gameCanvas.width + i * gameCanvas.width / 4, 0, 40, 100, 0));
// }
// // let Tub = new Tubing(gameCanvas, gameCanvas.width, 0, 40, 50, 0);
// arrayTubs.forEach((e)=> {
//     e.setMoveSpeed(-1, 0);
// });

// window.addEventListener('keydown', function (e) {
//     ball.speedY = -5;
// }, false);


var requestAnimFrame =
    function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    };
var cancelAnimFrame =
    function (ID) {
        return window.clearTimeout(ID);
    };
function loop() {
    // LoopID = requestAnimFrame(loop);
    // ball.clearAll(gameCtx);
    // ball.move(gameCtx);
    // arrayTubs.forEach((e)=> {
    //     e.move(gameCtx);
    // });
    //
    // arrayTubs.forEach((e)=> {
    //     if ((e.topPositionX <= ball.positionX + ball.redius
    //         && ball.positionX <= e.topPositionX + e.width
    //         && ball.positionY - ball.redius <= e.topheight)
    //         ||
    //         (e.topPositionX <= ball.positionX + ball.redius
    //         && ball.positionX <= e.topPositionX + e.width
    //         && ball.positionY + ball.redius >= e.topheight + e.intervalHieght)) {
    //         cancelAnimFrame(LoopID);
    //     }
    // });
}
var socket = io();
socket.on('init', function (e) {
    gameCanvas.width = e.width;
    gameCanvas.height = e.height;
});
socket.on('ball change', function (e) {
    console.log(e);
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    for(var i=0;i<e.length;i++) {
        gameCtx.beginPath();
        gameCtx.arc(gameCanvas.width / 2, e[i].y, e[i].r, 0, Math.PI * 2, e[i].color);
        gameCtx.closePath();
        gameCtx.fill();
    }

});
// loop();



