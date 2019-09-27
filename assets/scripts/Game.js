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
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        backgroundAudio: {
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
        // 游戏一开始就把暂存game变量,player至少要在start阶段才能获取到game属性
        this.player.getComponent('Player').game=this;
        // 播放背景音乐
        cc.audioEngine.playEffect(this.backgroundAudio, true);
        // 用在游戏一开始的时候判断enemy节点是否有效,避免报错
        this.enemy = cc.instantiate(this.enemyPrefab);
        // initialize enemy pool
        this.enemyPool = new cc.NodePool('Enemy');
    },

    initHint () {
        let keyboardHint = "按空格键起跳";
        let touchHint = "点击屏幕起跳";
        // initialize control hint
        let hintText = cc.sys.isMobile ? touchHint : keyboardHint;
        this.controlHintLabel.string = hintText;
    },

    onStartGame () {         
        // 初始化计分
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // set button and gameover text out of screen
        this.btnNode.active = false;
        this.gameOverNode.active = false;        
        // 生成新敌人
        this.spawnNewEnemy();       
        // 主角准备就绪
        this.player.getComponent('Player').GetReady();
        // 播放背景动画
        this.anim.play('anim');   
    },

    spawnNewEnemy () {
        // 先把当前的敌人销毁掉,然后再生成新敌人
        this.enemyPool.put(this.enemy);
        // 使用给定的模板在场景中生成一个新节点
        let newEnemy = this.enemyPool.get();
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newEnemy);
        // 对敌人进行初始化操作
        newEnemy.getComponent('Enemy').init(this);
        // 切换新的纹理
        newEnemy.getComponent('Enemy').setTexture();
        // 保存最新的敌人
        this.enemy = newEnemy;
        // 每次有新的敌人出现,记得开启主角状态
        this.player.getComponent('Player').state = true;
    },

    gainScore (score) {
        this.score += score;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver () {       
        this.node.stopAllActions();
        // 关闭游戏状态,避免浪费内存资源
        this.enemy.getComponent('Enemy').state = false;
        this.player.getComponent('Player').state = false;
        this.player.stopAllActions();
        // 取消主角动作监听
        this.player.getComponent('Player').onDestroy(); 
        // 暂停背景动画
        this.anim.pause();      
        this.gameOverNode.active = true;
        this.btnNode.active = true;
    }

});
