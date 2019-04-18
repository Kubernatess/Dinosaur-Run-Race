
cc.Class({
    extends: cc.Component,

    properties: {
        // 地面当前水平方向速度
        xSpeed: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        // 根据当前速度更新云朵的位置
        this.node.x -= this.xSpeed * dt;
        if(this.node.x <= -this.node.parent.width){
            this.node.x = this.node.parent.width;
        }
    },
});
