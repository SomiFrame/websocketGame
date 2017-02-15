var player = function () {
    var _this = {};
    var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

    _this.create = function (id, canvas) {
        _this.self = {
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
        return _this;
    };
    _this.move = function () {
        _this.self.ballOption.sy += _this.self.ballOption.gv;
        _this.self.ball.x += _this.self.ballOption.sx;
        _this.self.ball.y += _this.self.ballOption.sy;
        _this.self.ball.r = 10;
    };
    return _this;
};
module.exports = player;