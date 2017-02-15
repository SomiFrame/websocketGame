var detection = function () {
    var _this = {};
    _this.detectCrash = function (player, tubing) {
        if (player.ball.x + player.ball.r >= tubing.topPositionX
            && player.ball.x - player.ball.r <= tubing.topPositionX + tubing.width
            && player.ball.y <= tubing.topHeight
            ||
            player.ball.x + player.ball.r >= tubing.bottomPositionX
            && player.ball.x - player.ball.r <= tubing.bottomPositionX + tubing.width
            && player.ball.y >= tubing.bottomPositionY) {
            return true;
        }
    };
    _this.detectBoundary = function(player) {
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
    };
    return _this;
};
module.exports = detection;