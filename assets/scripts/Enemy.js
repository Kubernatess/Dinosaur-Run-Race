cc.Class({
    extends: cc.Component,

    GetReady (game) {
        this.game = game; 
        // 设置大小和锚点     
        this.node.setScale(0.1);
        this.node.anchorY = 0;       
        // 敌人位置设置在最右边
        this.node.setPosition(200,this.game.horizon.y);
        // 开启游戏
        this.state = true;                 
    },

    //设置障碍物纹理
    setTexture (textureName) {
        let self = this.node;
        cc.loader.loadRes(textureName,cc.SpriteFrame,function(err,spriteFrame){
            if(err){
                cc.error(err.message || err);
                return;
            }      
            self.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
    },

    update (dt) {
        if(this.state == true){
            // 敌人当前水平方向速度
            let xSpeed = 200; 
            this.node.x -= xSpeed * dt;
            // 当敌人移动出场景时
            if(this.node.x <= -200){         
                //销毁敌人
                this.node.destroy();
                //重新渲染新敌人
                this.game.enemy = this.game.spawnNewEnemy();   
                this.game.player.getComponent('Player').isScore = false;            
            }   
        }
        
    }
});
