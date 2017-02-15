var tubing = function () {
    var _this = {};
    _this.create = function (id, canvas) {
        var intervalHeight = 100;
        var intervalWidth = canvas.width / 4;
        var tHeight = (canvas.height - intervalHeight) * Math.random();
        var bHeight = canvas.height - tHeight - intervalHeight;
        _this.canvas = canvas;
        _this.self = {
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
        return _this;
    };
    _this.move = function () {
        _this.self.topPositionX += _this.self.sx;
        _this.self.bottomPositionX += _this.self.sx;
        if (_this.self.topPositionX < -_this.self.width) {
            _this.respawn();
        }
    };
    _this.respawn = function () {
        var id = _this.self.id;
        var intervalHeight = 100;
        var intervalWidth = _this.canvas.width / 4;
        var tHeight = (_this.canvas.height - intervalHeight) * Math.random();
        var bHeight = _this.canvas.height - tHeight - intervalHeight;
        _this.self = {
            initPositionX: _this.canvas.width,
            id: id,
            sy: 0,
            sx: -2,
            width: 40,
            color: '#000',
            topPositionX: _this.canvas.width,
            topPositionY: 0,
            bottomPositionX: _this.canvas.width,
            bottomPositionY: tHeight + intervalHeight,
            topHeight: tHeight,
            bottomHeight: bHeight
        };
        return _this;
    };
    return _this;
};
module.exports = tubing;