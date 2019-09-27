cc.Class({
    extends: cc.Component,

    properties: {       
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },        
    },
    
    start () {       
        // 初始化游戏状态,通常用来保护未初始化的节点,这个开关由敌人来控制
        this.state = false;      
        // 通过game属性获取地面位置
        this.groundY = this.game.horizon.y;
        // 设置主角初始位置
        this.node.y = this.game.horizon.y;
    },

    GetReady () {
        // 重新设置主角初始位置
        this.node.y = this.game.horizon.y;
        // 判断是否手持设备
        if(cc.sys.isMobile){
            // 开启触屏监听
            let touchReceiver = cc.Canvas.instance.node;
            touchReceiver.on(cc.Node.EventType.TOUCH_START, this.setJumpAction, this);
        }    
        else{ //开启键盘监听            
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }                             
    },

    onDestroy () {
        // 取消键盘监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // 取消触屏监听
        let touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off(cc.Node.EventType.TOUCH_START, this.setJumpAction, this);
    },

    setJumpAction: function () {
        // 跳跃上升
        let jumpUp = cc.moveBy(0.3, cc.v2(0, 120)).easing(cc.easeCubicActionOut());
        // 添加一个回调函数,用于在动作结束时调用我们定义的其他方法
        let callback = cc.callFunc(this.playJumpSound() , this);
        // 下落
        let jumpDown = cc.moveBy(0.3, cc.v2(0, -120)).easing(cc.easeCubicActionIn());      
        // 每次完成落地动作后调用回调来播放声音
        return cc.sequence(jumpUp, callback, jumpDown);
    },

    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    onKeyDown (event) {
        // 为了阻止空中连跳,主角只有到了地面,才可以按下空格,执行跳跃操作
        if((Math.floor(this.node.y) <= Math.ceil(this.groundY)) && (event.keyCode == cc.macro.KEY.space)){
            this.node.runAction(this.setJumpAction());
        }
    },

    getEnemyDistance: function () {
        // 根据两点位置计算两点之间距离
        let EnemyPos = this.game.enemy.getPosition();        
        let distance = this.node.position.sub(EnemyPos).mag();
        return distance;
    },

    update (dt) {
        if(this.state == true){
            // 敌人、主角之间的距离小于这个数值时，就会完成收集
            if (this.getEnemyDistance() <= 45) {
                // 如果捡到蛋糕加3分
                if(this.game.enemy.getComponent(cc.Sprite).spriteFrame.name == "cake"){
                    this.game.gainScore(3);
                    // 加完分以后,立刻销毁蛋糕,生成新的敌人
                    this.game.spawnNewEnemy();
                }
                // 如果是仙人掌,则GameOver
                else{
                    this.game.gameOver();                  
                }  
                
            }     
                       
            if((this.game.enemy.x < this.node.x) && (this.game.enemy.getComponent(cc.Sprite).spriteFrame.name != "cake")){
                // 加完分以后,立刻关闭state状态,避免重复加分或出现GameOver
                this.state = false;
                // 如果仙人掌避开了恐龙
                this.game.gainScore(1);                
            }
        }
    },
});
