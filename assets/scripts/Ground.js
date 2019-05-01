
cc.Class({
    extends: cc.Component,

    onLoad () {
        this.state = false;
        // 地面当前水平方向速度
        this.xSpeed = this.node.parent.width*2/5;
    },


    update (dt) {
        if(this.state == true){
            // 根据当前速度更新云朵的位置
            this.node.x -= this.xSpeed * dt;
            if(this.node.x <= -this.node.parent.width){
                this.node.x = this.node.parent.width;
            }

        }
    },
});
