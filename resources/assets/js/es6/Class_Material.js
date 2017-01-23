class Class_Material {
    constructor(canvas, x = 20, y = 20, r = 10, sx = 1, sy = 1, gv = .4, color = '#000000') {
        this.canvas = canvas;//画布
        this.positionX = x + r;//X轴上的位置
        this.positionY = y + r;//Y轴上的位置
        this.speedX = sx;//物体在X轴上的移动速度
        this.speedY = sy;//物体在Y轴上的移动速度
        this.redius = r;//物体的半径（大小）
        this.startAngle = 0;//
        this.endAngle = 2 * Math.PI;
        this.anticlockwise = false;
        this.gravity = gv;
        this.color = color;
    }

    setMoveSpeed(speedX, speedY) {
        this.speedX = speedX || this.speedX;
        this.speedY = speedY || this.speedY;
    }

    clearAll(pen) {
        pen.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(pen) {
        pen.beginPath();
        pen.fillStyle = this.color;
        pen.arc(this.positionX, this.positionY, this.redius, this.startAngle, this.endAngle, this.anticlockwise);
        pen.closePath();
        pen.fill();
    }

    move(pen) {
        this.speedY += this.gravity;
        this.positionX += this.speedX;
        this.positionY += this.speedY;
        // 地面の衝突判定
        if (this.positionY > this.canvas.height - this.redius) {
            this.speedY *= -0.6;
            this.speedX *= 0.7;
            this.positionY = this.canvas.height - this.redius;
        }
        // 顶层の衝突判定
        if (this.positionY < this.redius) {
            this.speedY *= 0.6;
            this.positionY = this.redius;
        }
        this.draw(pen);
    }


}
export default Class_Material;