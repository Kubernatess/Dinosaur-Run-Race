
cc.Class({
    extends: cc.Component,

    properties: {
        // 障碍物持续移动的时间
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
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        //标志位,控制一次只能有一个障碍物在移动
        this.flag = true;
        // 生成一个新的障碍物
        this.obstacle = this.spawnNewObject();
        // 初始化计分
        this.score = 0;
        //通过设置标志位,使得恐龙躲开仙人掌时只能加一次分
        this.flag = true;
    },

    spawnNewObject: function() {
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
        // 为星星设置一个随机位置
        newObstacle[rand].setPosition(this.node.width,this.groundY);
        // 设置障碍物的大小
        newObstacle[rand].setScale(0.15);
        // 设置锚点的Y轴坐标
        newObstacle[rand].anchorY=0;
        // 初始化移动动作
        newObstacle[rand].moveAction = cc.moveTo(this.moveDuration, cc.v2(-this.node.width,this.groundY));
        newObstacle[rand].runAction(newObstacle[rand].moveAction);
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
        if(this.obstacle.isValid == true){
            // 如果期间有物体正在移动,只允许有一个正在移动
            // 当物体移动出场景时
            if(this.obstacle.x <= (-Math.ceil(this.node.width)||-Math.floor(this.node.width))){         
                //销毁障碍物
                this.obstacle.destroy();
                //重新渲染新物体
                this.obstacle = this.spawnNewObject();
                //当仙人掌完全移出场景时,才把标志位设为true
                this.flag = true;
            }
            
            // 当该物体是仙人掌并且完全通过恐龙时,则加1分
            if ( (this.flag == true) && (this.obstacle.name!="cake") && (this.obstacle.x <= -(Math.ceil(this.node.width)||Math.floor(this.node.width))/2) ){
                //标志位设为false,则恐龙成功躲避仙人掌时只能加一次分
                this.flag = false;
                this.gainScore();
            }
            
        }      
    },
});
