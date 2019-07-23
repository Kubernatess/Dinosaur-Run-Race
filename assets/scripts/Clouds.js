
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        // 云朵当前水平方向速度
        this.xSpeed = this.node.parent.width/10,
         // init game state
        this.state = false;
        //根据不同尺寸 设置云朵大小
        this.node.setScale(this.node.parent.width/960);
     },

    start () {

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
