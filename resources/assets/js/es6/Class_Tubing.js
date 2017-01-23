class Class_Tubing {
    constructor(canvas, x = 0, y = 0, width, intervalHeight, gv = .4, color = '#000000') {
        this.canvas = canvas;//画布
        this.speedX = 0;//物体在X轴上的移动速度
        this.speedY = 0;//物体在Y轴上的移动速度
        this.width = width;//柱子宽度
        this.gravity = gv;//重力系数
        this.color = color;//颜色
        this.intervalHieght = intervalHeight;//上下柱子间隔
        let theight = (canvas.height - intervalHeight) * Math.random();
        let bheight = canvas.height - theight - intervalHeight;
        this.topPositionX = x;//顶部X轴上的位置
        this.topPositionY = 0;//顶部Y轴上的位置
        this.bottomPositionX = x;//底部柱子X轴上的位置
        this.bottomPositionY = theight + intervalHeight;
        this.topheight = theight;//顶部柱子高度
        this.bottomheight = bheight;//底部柱子高度
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
        //顶部
        pen.fillRect(this.topPositionX, this.topPositionY, this.width, this.topheight);
        pen.fill();
        //底部
        pen.fillRect(this.bottomPositionX, this.bottomPositionY, this.width, this.bottomheight);

        pen.fill();
        pen.closePath();
    }

    move(pen) {
        this.speedY += this.gravity;
        this.topPositionX += this.speedX;
        this.bottomPositionX += this.speedX;
        this.topPositionY += this.speedY;
        this.bottomPositionY += this.speedY;
        //判断油管是否存在当前场景中
        if (this.topPositionX < -this.width) {
            this.constructor(this.canvas,this.canvas.width,0,this.width,this.intervalHieght,0);
            this.speedX=-1;
            this.speedY=0;
        }
        this.draw(pen);
    }


}
export default Class_Tubing;