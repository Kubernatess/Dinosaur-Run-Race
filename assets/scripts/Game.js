cc.Class({
    extends: cc.Component,

    properties: {       
        // 敌人预制资源
        enemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        player: {
            default: null,
            type: cc.Node
        },
        horizon: {
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
        },
        // 引用动画资源
        anim: {
            default: null,
            type: cc.Animation
        },
        // 文字提示引用
        controlHintLabel: {
            default: null,
            type: cc.Label
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
        // 初始化计分
        this.score = 0;
        // initialize control hint
        this.initHint();
        // 初始化游戏状态,通常用来保护未初始化的节点
        this.state = false;
        // 用在游戏一开始的时候判断enemy节点是否有效,避免报错
        this.enemy = new cc.Node();
        // 游戏一开始就把暂存game变量
        this.player.getComponent('Player').game=this;
    },

    initHint () {
        let keyboardHint = "按空格键起跳";
        let touchHint = "点击屏幕起跳";
        // initialize control hint
        let hintText = cc.sys.isMobile ? touchHint : keyboardHint;
        this.controlHintLabel.string = hintText;
    },

    onStartGame () {         
        // 开启游戏
        this.state = true;
        // 初始化计分
        this.resetScore();
        // set button and gameover text out of screen
        this.btnNode.active = false;
        this.gameOverNode.active = false;
        // 播放背景动画
        this.anim.play('anim');   
        //
        this.player.getComponent('Player').GetReady();
        // 把停留在GameOver那一刻的障碍物清除掉
        if(this.enemy.isValid){
            this.enemy.destroy();
        }        
        //spawn newEnemy
        this.enemy = this.spawnNewEnemy(); 
    },

    resetScore () {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    spawnNewEnemy () {
        // 创建一个数组,存放预制资源纹理的名称
        let textures = ["cactus1","cactus2","cactus3","cake"];
        // 随机生成0--3的整数
        let rand=Math.floor(Math.random()*4);
        //实例化敌人
        let newEnemy = cc.instantiate(this.enemyPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newEnemy);
        // 设置纹理集
        newEnemy.getComponent('Enemy').setTexture(textures[rand]);       
        // 在敌人组件上暂存 Game 对象的引用
        newEnemy.getComponent('Enemy').GetReady(this);
        return newEnemy;
    },

    gainScore (score) {
        this.score += score;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver () {
        this.gameOverNode.active = true;
        this.btnNode.active = true;
        this.node.stopAllActions();
        this.enemy.getComponent('Enemy').state = false;
        this.player.stopAllActions();
        this.player.getComponent('Player').onDestroy(); 
        this.anim.pause();      
    }

});
