const Clouds = require('Clouds');

cc.Class({
    extends: cc.Component,

    properties: {
        //障碍物持续移动的时间
        moveDuration: 0,  
        
        // 仙人掌预制资源
        cactusPrefab_1: {
            default: null,
            type: cc.Prefab
        },
        cactusPrefab_2: {
            default: null,
            type: cc.Prefab
        },
        cactusPrefab_3: {
            default: null,
            type: cc.Prefab
        },
        // 蛋糕预制资源
        cakePrefab: {
            default: null,
            type: cc.Prefab
        },
        // dinosaur 节点，用于获取恐龙弹跳的距离，和控制主角行动开关
        dinosaur: {
            default: null,
            type: cc.Node
        },
        // 地面节点，用于确定障碍物生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // clouds节点
        clouds: {
            default: null,
            type: Clouds
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        controlHintLabel: {
            default: null,
            type: cc.Label
        },
        keyboardHint: {
            default: '',
            multiline: true
        },
        touchHint: {
            default: '',
            multiline: true
        },
        btnNode: {
            default: null,
            type: cc.Node
        },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
    },

    onLoad () {
        // 求得地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        // 初始化计分
        this.score = 0;
        //通过设置标志位,使得恐龙躲开仙人掌时只能加一次分
        this.flag = true;

        // initialize control hint
        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlHintLabel.string = hintText;

        // init game state
        this.state = false;

        //初始化障碍物
        this.obstacle = null;
        //根据不同尺寸 设置不同大小
        this.btnNode.setScale(this.node.width/960);
        this.gameOverNode.setScale(this.node.width/960);
        //设置恐龙初始位置
        this.dinosaur.y=this.groundY;
        
    },

    onStartGame: function () {
        // 初始化计分
        this.resetScore();
        // set button and gameover text out of screen
        this.btnNode.active = false;
        this.gameOverNode.active = false;
        // 云朵开始运动
        this.clouds.state = true;
        // 地面开始运动
        this.ground.getComponent('Ground').state = true;
        // 调用恐龙的初始化方法,恐龙开始运动
        this.dinosaur.getComponent('Dinosaur').init();
        // 把停留在GameOver那一刻的障碍物清除掉
        if(this.obstacle){
            this.obstacle.destroy();
        }
        //spawn newObstacle
        this.obstacle = this.spawnNewObstacle();
        // set game state to running
        this.state = true;
    },

    resetScore: function () {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    spawnNewObstacle: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newObstacle = new Array();
        newObstacle[0] = cc.instantiate(this.cactusPrefab_1);
        newObstacle[1] = cc.instantiate(this.cactusPrefab_2);
        newObstacle[2] = cc.instantiate(this.cactusPrefab_3);
        newObstacle[3] = cc.instantiate(this.cakePrefab);
        // 使用随机函数
        var rand=Math.floor(Math.random()*4);
        // 随机将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newObstacle[rand]);
        // 为障碍物设置一个随机位置
        newObstacle[rand].setPosition(this.node.width,this.groundY);
        //根据不同尺寸 设置障碍物大小
        newObstacle[rand].setScale(this.node.width*0.15/960);
        // 设置锚点的Y轴坐标
        newObstacle[rand].anchorY=0;
        // 初始化移动动作
        var moveAction = cc.moveTo(this.moveDuration, cc.v2(-this.node.width,this.groundY));
        newObstacle[rand].runAction(moveAction);
        // 在仙人掌、蛋糕组件上暂存 Game 对象的引用
        newObstacle[rand].getComponent('Obstacle').game = this;
        return newObstacle[rand];
    },

    gainScore: function (pos) {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gainTripleScore: function (pos) {
        this.score += 3;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    start () {

    },

    update (dt) {
        //判断物体是否被销毁了
        if(this.obstacle){
            // 如果期间有物体正在移动,只允许有一个正在移动
            // 当物体移动出场景时
            if(this.obstacle.x-1 <= (-Math.round(this.node.width)||-Math.ceil(this.node.width)||-Math.floor(this.node.width))){         
                //销毁障碍物
                this.obstacle.destroy();
                //重新渲染新物体
                this.obstacle = this.spawnNewObstacle();
                //当仙人掌完全移出场景时,才把标志位设为true
                this.flag = true;
            }
            
            // 当该物体是仙人掌并且刚好通过恐龙时,则加1分
            if ( (this.flag == true) && (this.obstacle.name!="cake") && (this.obstacle.x <= -(Math.ceil(this.node.width)||Math.floor(this.node.width))/2) ){
                //标志位设为false,则恐龙成功躲避仙人掌时只能加一次分
                this.flag = false;
                this.gainScore();
            } 
        }       
    },
});
