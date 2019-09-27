cc.Class({
    extends: cc.Component,

    init (game) {
        this.game = game; 
        // 设置大小和锚点     
        this.node.setScale(0.1);
        this.node.anchorY = 0;       
        // 敌人位置设置在最右边
        this.node.setPosition(250,this.game.horizon.y);
        // 开启游戏
        this.state = true;
    },

    //设置敌人纹理
    setTexture () {
        let self = this.node;
        // 随机生成0--3的整数
        let rand=Math.floor(Math.random()*4);
        // 创建一个数组,存放预制资源纹理的名称
        let textures = ["cactus1","cactus2","cactus3","cake"]; 
        // 动态加载       
        cc.loader.loadRes(textures[rand],cc.SpriteFrame,function(err,spriteFrame){
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
            // 当敌人移动出场景时,销毁敌人,生成新敌人
            if(this.node.x <= -200){         
                this.game.spawnNewEnemy();             
            }   
        }
        
    }
});
