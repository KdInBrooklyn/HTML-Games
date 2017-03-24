/**
 * Created by Lisen on 17/3/23.
 */

//前两个参数设置游戏界面的大小
var game = new Phaser.Game(240, 400, Phaser.CANVAS, 'game');
game.States = {};

//当前的游戏分数
var score = 0;
var scoreText;
//最好的分数
var bestScore = 0;
var bestText;
//字体样式
var titleStyle = {font: "bold 12 px Monaco", fill: "#4DB3B3", boundsAlignH: "center"};
var scoreStyle = {font: "bold 20 px Monaco", fill: "#FFFFFF", boundsAlignH: "center"};

game.States.boot = {
    preload: function() {
        if (!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        }
        game.load.image('preloader', 'assets/preloader.gif');
    },
    create: function() {
        game.state.start('load');
    }
}

game.States.load = {
    preload: function() {
        var preloadSprite = game.add.sprite(game.width/2 - 220/2, game.height/2 - 19/2, 'preloader');
        game.load.setPreloadSprite(preloadSprite);
        game.load.image('background', 'assets/bg.png');
        game.load.image('btnRestart', 'assets/btn-restart.png');
        game.load.image('btnStart', 'assets/btn-start.png');
        game.load.image('btnTry', 'assets/btn-tryagain.png');
        game.load.image('logo', 'assets/logo.png');
    },
    create: function() {
        game.state.start('main');
    }
}

game.States.main = {
    preload: function() {
        //背景
        game.add.tileSprite(0, 0, game.width, game.height, 'background');
        //logo
        game.add.image(game.width/2-200/2, game.height/2-162/2, 'logo');
        //开始按钮
        game.add.button(game.width/2-206/2, game.height/2-53/2+100, 'btnStart', this.onStart, this);
    },

    onStart: function() { //开始按钮的点击事件,跳转到游戏界面
        game.state.start('play');
    }

}

//noinspection JSAnnotator
game.States.play = {
    preload: function () {
    },
    create: function () {
        // game background
        game.add.tileSprite(0, 0, game.width, game.height, 'background');

        //分数
        var scoreSprite = game.add.sprite(10, 10);

        var scoreGraphics = game.add.graphics(0, 0);
        scoreGraphics.lineStyle(5, 0xA1C5C5);
        scoreGraphics.beginFill(0x308C8C);
        //绘制的区域
        scoreGraphics.drawRoundedRect(0, 0, 70, 50, 10);
        scoreGraphics.endFill();
        scoreSprite.addChild(scoreGraphics);

        scoreText = game.add.text(0, 20, 'SCORE', titleStyle);
        scoreText.setTextBounds(0, 0, 70, 50);
        scoreSprite.addChild(scoreText);

        //best
        var bestSprite = game.add.sprite(90, 10);
        var bestGraphics = game.add.graphics(0, 0);
        bestGraphics.lineStyle(5, 0xA1C5C5);
        bestGraphics.beginFill(0x308C8C);
        bestGraphics.drawRoundedRect(0, 0, 70, 50, 10);
        bestGraphics.endFill();
        bestSprite.addChild(bestGraphics);
        bestText = game.add.text(0, 20, 'BEST', scoreStyle);
        bestText.setTextBounds(0, 0, 70, 50);
        bestSprite.addChild(bestText);

        //restart button
        game.add.button(180, 15, 'btnRestart', this.restartGame, this);

        //game area
        var mainAreaSprite = game.add.sprite(10, 80);
        var mainAreaBackGraphics = game.add.graphics(0, 0);
        mainAreaBackGraphics.beginFill(0xADA79A, 0.5);
        mainAreaBackGraphics.drawRoundedRect(0, 0, 220, 220, 10);
        mainAreaBackGraphics.endFill();
        mainAreaSprite.addChild(mainAreaBackGraphics);

        //定义一个二维数组, 用来存放每个方块的数据,将数据赋值给value,然后根据不同的value显示不同的颜色
        this.array = [];
        for (var i=0; i<4; i++) {
            this.array[i] = [];
            for (var j=0; j<4; j++) {
                this.array[i][j] = {};
                this.array[i][j].value = 0;
                this.array[i][j].x = i;
                this.array[i][j].y = j;
            }
        }

        //随机的x位置
        var randomX = game.rnd.integerInRange(0, 3);

        //随机的y位置
        var randomY = game.rnd.integerInRange(0,3);

        //随机的数字
        var randomNum = game.rnd.integerInRange(1,2)

        this.placeSquare(randomX, randomY, randomNum*2);

        //数字颜色数组
        this.colors = {
            2: 0x49B4B4,
            4: 0x4DB574,
            8: 0x78B450,
            16: 0xC4C362,
            32: 0xCEA346,
            64: 0xDD8758,
            128: 0xBF71B3,
            256: 0x9F71BF,
            512: 0x7183BF,
            1024: 0x71BFAF,
            2048: 0xFF7C80
        };

        //是否响应swipe
        this.canSwipe = true;


        //

        //swipe检测
        this.swipeCheck = {
            up: this.swipeUp.bind(this),
            down: this.swipeDown.bind(this),
            left: this.swipeLeft.bind(this),
            right: this.swipeRight.bind(this)
        }
        this.swipe = new Swipe(this.game, this.swipeCheck);

        console.log(this.swipeCheck);
    },

    update: function () {
        if (this.canSwipe) {
            // this.swipe.check();
        }
    },

    //restart button click response
    restartGame: function () {

    },

    //随机生成方块
    generateSquare: function() {

    },

    //在x,y位置放置一个值为value的方块
    placeSquare: function(x, y, value) {
        var squareStyle = {font: "bold 20px Monaco", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle"};
        var square = game.add.sprite((45+8)*y+10+8, (45+8)*x+80+8);
        var squareBackground = game.add.graphics(0, 0);//-45/2, -45/2);
        //TODO 颜色暂时统一
        squareBackground.beginFill(0x71BFAF) //this.colors[2]);
        squareBackground.drawRoundedRect(0, 0, 45, 45, 5);
        squareBackground.endFill();
        square.addChild(squareBackground);

        var squareText = game.add.text(0, 0, value, squareStyle); //-45/2, -45/2, value, squareStyle);
        squareText.setTextBounds(0, 0, 45, 45);
        square.addChild(squareText);

        // this.array[x][y].value = value;
        // this.array[x][y].sprite = square;
    },

    //swipe的初始逻辑
    swipeInit: function() {
      this.canSwipe = false;
      //通过定时器来控制滑动间隔
      game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
          if (!this.canSwipe) {
              this.canSwipe = true;
          }
      }, this);
    },

    //swipe的结尾逻辑
    swipeDone: function() {
      for (var i=0; i<this.array.length; i++) {
          for (var j=0; j<this.array.length.length; j++) {
              this.array[i][j].newNode = undefined;
          }
      }
    },

    //上滑
    swipeUp: function() {
        this.swipeInit();

        for (var i=0; i<this.array.length;i++) {
            for (var j=1; j<this.array.length; j++) {
                if (this.array[i][j].value != 0) {
                    var index = j - 1;
                    while (index > 0 && this.array[i][index].value == 0) {
                        index --;
                    }
                }
            }
        }

        this.swipeDone();
    },

    //下滑
    swipeDown: function() {
        this.swipeInit();

        for (var i=0; i<this.array.length;i++) {
            for (var j = 0; j < this.array.length -1; j++) {
                if (this.array[i][j].value != 0) {
                    var index = j + 1;
                    while (index < 3 && this.array[i][index].value == 0) {
                        index ++;
                    }
                }
            }
        }

        this.swipeDone();
    },

    //左滑
    swipeLeft: function() {
        this.swipeInit();

        this.swipeDone();
    },

    //右滑
    swipeRight: function() {
        this.swipeInit();

        this.swipeDone();
    },
    //检测是否可以滑动
    check: function() {

    }
}

game.States.over = {
    preload: function() {
    },

    create: function() {
    },

    update: function() {
        console.log('update')
    }
};

game.state.add('boot', game.States.boot);
game.state.add('load', game.States.load);
game.state.add('main', game.States.main);
game.state.add('play', game.States.play);
game.state.add('over', game.States.over);
game.state.start('boot');