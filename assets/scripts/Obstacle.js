cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onload (){
        //初始化预制资源纹理名称
        this.textureName = null;
        // 仙人掌、蛋糕和恐龙之间的距离小于这个数值时，就会完成收集
        this.pickRadius = 0;
    },

    start () {  
        //通过设置标志位,使得恐龙捡到蛋糕时只能加一次分
        this.flag = true;     
        //按照尺寸比例计算pickRadius
        if(this.textureName == 'cake'){
            this.pickRadius = 70*this.node.parent.width/960;
        }
        else if(this.textureName == 'cactus1'){
            this.pickRadius = 100*this.node.parent.width/960;
        }
        else if(this.textureName == 'cactus2'){
            this.pickRadius = 70*this.node.parent.width/960;
        }
        else if(this.textureName == 'cactus3'){
            this.pickRadius = 85*this.node.parent.width/960;
        }
    },

    getDinosaurDistance: function () {
        // 根据 dinosaur 节点位置判断距离
        var dinosaurPos = this.game.dinosaur.getPosition();
        // 根据两点位置计算两点之间距离
        var distance = this.node.position.sub(dinosaurPos).mag();
        return distance;
    },

    update (dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getDinosaurDistance() < this.pickRadius && this.flag == true) {
            //标志位设为false,捡到蛋糕只能加一次分或只能执行一次GameOver操作
            this.flag = false;           
            //如果捡到蛋糕加3分
            if(this.textureName == "cake"){
                this.game.gainScore(3);
                //销毁蛋糕
                this.node.destroy();
                //重新渲染新物体
                this.game.obstacle = this.game.spawnNewObstacle();
            }
            //否则如果时仙人掌,则GameOver
            else{
                this.gameOver();
            }  
        }
        
        //直到物体完全通过了恐龙,才把标志位设为true
        if(this.node.x <= -this.node.parent.width){
            this.flag = true;
        }
    },

    //设置障碍物纹理
    setTexture: function(textureName){
        this.textureName = textureName;
        var self = this.node;
        cc.loader.loadRes(this.textureName,cc.SpriteFrame,function(err,spriteFrame){
            if(err){
                cc.error(err.message || err);
                return;
            }      
            self.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
    },

    gameOver: function () {
        this.game.gameOverNode.active = true;
        this.game.ground.getComponent('Ground').state = false;
        this.game.dinosaur.getComponent('Dinosaur').state = false;
        this.game.clouds.state = false;
        this.node.stopAllActions();
        this.game.dinosaur.getComponent('Dinosaur').onDestroy();
        this.game.btnNode.active = true;
    }
});
