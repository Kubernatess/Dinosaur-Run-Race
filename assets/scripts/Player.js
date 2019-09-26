cc.Class({
    extends: cc.Component,

    properties: {       
        // 跳跃音效资源
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
    },
    
    // 用于update方法之前执行一些操作
    start () {       
        // 初始化游戏状态,通常用来保护未初始化的节点
        this.state = false;      
        // 用来控制主角同一时刻只能加一次分
        this.isScore = false; 
        // 地面位置
        this.groundY = this.game.horizon.y;
        // 设置主角初始位置
        this.node.y = this.game.horizon.y;
    },

    GetReady () {
        // 开启游戏状态
        this.state = true;    
        // 重新设置主角初始位置
        this.node.y=this.game.horizon.y;
        // 判断设备类型
        if(cc.sys.isMobile){
            // 开启触屏监听
            let touchReceiver = cc.Canvas.instance.node;
            touchReceiver.on('touch', this.setJumpAction, this);
        }    
        else{
            // 开启键盘输入监听
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPress, this);
        }                             
    },

    onDestroy () {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPress, this);
        // 取消触屏监听
        let touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off('touch', this.setJumpAction, this);
    },

    setJumpAction: function () {
        // 主角跳跃持续时间
        let jumpDuration = 0.3;
        // 主角跳跃高度
        let jumpHeight = 120;
        // 跳跃上升
        let jumpUp = cc.moveBy(jumpDuration, cc.v2(0, jumpHeight)).easing(cc.easeCubicActionOut());
        // 添加一个回调函数,调用声音引擎播放声音
        let callback = cc.callFunc(function(){
            cc.audioEngine.playEffect(this.jumpAudio, false);
        }, this);
        // 下落
        let jumpDown = cc.moveBy(jumpDuration, cc.v2(0, -jumpHeight)).easing(cc.easeCubicActionIn());      
        // 每次完成落地动作后调用回调来播放声音
        return cc.sequence(jumpUp, callback, jumpDown);
    },

    onKeyPress (event) {
        // 主角只有到了地面,才可以按下空格,执行跳跃操作
        if((Math.floor(this.node.y)<=Math.ceil(this.groundY))&&(event.keyCode==cc.macro.KEY.space)){
            let jumpAction = this.setJumpAction();
            this.node.runAction(jumpAction);
        }
    },

    getEnemyDistance: function () {
        // 根据敌人位置判断距离
        let EnemyPos = this.game.enemy.getPosition();
        // 根据两点位置计算两点之间距离
        let distance = this.node.position.sub(EnemyPos).mag();
        return distance;
    },

    update (dt) {
        if(this.state == true){
            // 敌人、主角之间的距离小于这个数值时，就会完成收集
            let pickRadius = 40; 
            if (this.getEnemyDistance()<=pickRadius) {
                // 如果捡到蛋糕加3分
                if(this.game.enemy.getComponent(cc.Sprite).spriteFrame.name == "cake"){
                    this.game.gainScore(3);
                    // 加完分以后,立刻销毁蛋糕
                    this.game.enemy.destroy();
                    // 重新渲染新物体
                    this.game.enemy = this.game.spawnNewEnemy();
                }
                // 如果是仙人掌,则GameOver
                else{
                    this.game.gameOver();                                    
                } 
                return; 
            }     
            
            // 如果仙人掌避开了恐龙
            if(this.game.enemy.x<=this.node.x&&this.isScore==false){
                this.game.gainScore(1);
                this.isScore=true;
            }
        }
    },
});
