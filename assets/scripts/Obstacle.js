cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //通过设置标志位,使得恐龙捡到蛋糕时只能加一次分
        this.flag = true;
        // 仙人掌、蛋糕和恐龙之间的距离小于这个数值时，就会完成收集
        this.pickRadius = 0;
        //按照尺寸比例计算pickRadius
        if(this.node.name == 'cake'){
            this.pickRadius = 70*this.node.parent.width/960;
        }
        else if(this.node.name == 'Cactus1'){
            this.pickRadius = 100*this.node.parent.width/960;
        }
        else if(this.node.name == 'Cactus2'){
            this.pickRadius = 70*this.node.parent.width/960;
        }
        else if(this.node.name == 'Cactus3'){
            this.pickRadius = 85*this.node.parent.width/960;
        }
        cc.log(this.pickRadius);
    },

    getDinosaurDistance: function () {
        // 根据 dinosaur 节点位置判断距离
        var dinosaurPos = this.game.dinosaur.getPosition();
        // 根据两点位置计算两点之间距离
        var distance = this.node.position.sub(dinosaurPos).mag();
        return distance;
    },

    start () {

    },

    update (dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getDinosaurDistance() < this.pickRadius && this.flag == true) {
            //标志位设为false,捡到蛋糕只能加一次分或只能执行一次GameOver操作
            this.flag = false;
            //如果捡到蛋糕加3分
            if(this.node.name == "cake"){
                this.game.gainTripleScore();
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

    gameOver: function () {
        this.game.gameOverNode.active = true;
        this.game.ground.getComponent('Ground').state = false;
        this.game.dinosaur.getComponent('Dinosaur').state = false;
        this.game.clouds.state = false;
        this.node.stopAllActions();
        this.game.dinosaur.getComponent('Dinosaur').onDestroy();
        //this.currentStar.destroy();
        this.game.btnNode.active = true;
    }
});
