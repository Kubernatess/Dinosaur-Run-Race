
cc.Class({
    extends: cc.Component,

    properties: {
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 主角跳跃高度
        jumpHeight: 0,
        // 跳跃音效资源
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 保存初始y的值
        this.initY = Math.round(this.node.y);
        
        //设置标志位,限制恐龙连跳两下
        this.flag = true;
        
        // init game state
        this.state = false;

        //根据不同尺寸 设置恐龙大小
        this.node.setScale(this.node.parent.width/960);
        // 设置锚点的Y轴坐标
        this.node.anchorY=0;
        
        //按照尺寸比例计算jumpHeight、jumpDuration
        this.jumpHeight = this.jumpHeight*this.node.parent.width/960;
        //this.jumpDuration = 0.3*this.node.parent.width/960;
    },

    init () {
        // set game state to running
        this.state = true;
        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPress, this);

        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on('touch', this.setJumpAction, this);
        
    },

    onDestroy () {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPress, this);
        
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off('touch', this.setJumpAction, this);
    },

    start () {

    },

    setJumpAction: function () {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());      
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.sequence(jumpUp, callback, jumpDown);
    },

    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    onKeyPress (event) {
        // 按下空格,执行跳跃操作
        if(event.keyCode==cc.macro.KEY.space){
            if(this.flag == true){
                this.jumpAction = this.setJumpAction();
                this.node.runAction(this.jumpAction);
            }
        }
    },

    update (dt) {
        if(this.state == true){
            //在空中的时候,阻止连按空格键
            if(this.node.y > this.initY){
                this.flag = false;
            }
            // 到了地面以后才能跳第二次
            if( (Math.ceil(this.node.y) == this.initY) || (Math.floor(this.node.y) == this.initY) ) {
                this.flag = true;
            }  
        }
        
    },
});
