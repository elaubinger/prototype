
var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload () {

    //deprecated
    game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
    game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    
    
    game.load.image('tank1', 'assets/games/tanks/tank1.png');
    game.load.image('tank2', 'assets/games/tanks/tank2.png');
    game.load.image('tank3', 'assets/games/tanks/tank3.png');
    game.load.image('shadow', 'assets/games/tanks/shadow.png');
    game.load.image('turret', 'assets/games/tanks/turret.png');
    game.load.image('turret1', 'assets/games/tanks/turret1.png');
    game.load.image('logo', 'assets/games/tanks/logo.png');
    game.load.image('lose', 'assets/games/tanks/lose.png');
    game.load.image('win', 'assets/games/tanks/win.png');
    game.load.image('bullet', 'assets/games/tanks/bullet.png');
    game.load.image('bullet1', 'assets/games/tanks/bullet1.png');
    game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
    
    game.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 128, 128, 12);
    game.load.spritesheet('explosionanim', 'assets/games/tanks/explosionanim.png', 35, 43, 15);
    game.load.spritesheet('smokeanim', 'assets/games/tanks/smokeanim.png', 32, 45, 27);
    
    game.load.audio('music', 'assets/audio/soundtrack.ogg');
    game.load.audio('gameover', 'assets/audio/game-over.ogg');
    game.load.audio('missioncomplete', 'assets/audio/Mission_Complete.ogg');
    game.load.audio('fire', 'assets/audio/smgshoot.ogg');
    game.load.audio('enemyfire', 'assets/audio/semishoot.ogg');
    game.load.audio('hit', 'assets/audio/impact.ogg');
    game.load.audio('explode', 'assets/audio/explode.ogg');
    
    
}

var land;

var tank;
var enemy;

var music;
var missioncompletefx;
var gameoverfx;
var firefx;
var enemyfirefx;
var hitfx;
var explodefx;

var playerAPMax = 30;
var playerAP = playerAPMax;
var enemyAPMax = 10;
var enemyAP = enemyAPMax;

var playerTurn = true;


function create () {

    game.renderer.renderSession.roundPixels = true;
    
    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 1200, 800, 'earth');
    land.fixedToCamera = true;

    //  The base of our tank
    this.tank = game.add.sprite(0, 0, 'tank2');
    this.tank.anchor.setTo(0.5, 0.5);
    
    this.enemy = game.add.sprite(0, 0, 'tank1');
    this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.x += 100;
    
    this.enemyTwo = game.add.sprite(0, 0, 'tank1');
    this.enemyTwo.anchor.setTo(0.5, 0.5);
    this.enemyTwo.x += 200;
    
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    
    game.camera.follow(tank);
    game.camera.focusOnXY(0, 0);

    music = game.add.audio('music');
    music.volume = 4.0;
    gameoverfx = game.add.audio('gameover');
    missioncompletefx = game.add.audio('missioncomplete');
    firefx = game.add.audio('fire');
    firefx.volume = 0.5;
    enemyfirefx = game.add.audio('enemyfire');
    enemyfirefx.volume = 0.5;
    hitfx = game.add.audio('hit');
    explodefx = game.add.audio('explode');

}

function update () {
    
    if(playerTurn){
        if(upKey.isDown){
            playerAP -= 1;
            this.tank.y -= 10;
        }
        else if(downKey.isDown){
            playerAP -= 1;
            this.tank.y += 10;
        }
        else if(leftKey.isDown){
            playerAP -= 1;
            this.tank.x -= 10;
        }
        else if(rightKey.isDown){
            playerAP -= 1;
            this.tank.x += 10;
        }
        
        if(playerAP <= 0){
            playerTurn = false;
            playerAP = playerAPMax;
        }
    }
    else{
        random = game.rnd.integerInRange(0,4);
        if(random == 0){
            enemyAP -= 1;
            this.enemy.y += 20;
        }
        else if(random == 1){
            enemyAP -= 1;
            this.enemy.y -= 20;
        }
        else if(random == 2){
            enemyAP -= 1;
            this.enemy.x += 20;
        }
        else if(random == 3){
            enemyAP -= 1;
            this.enemy.x -= 20;
        }
        
        randomTwo = game.rnd.integerInRange(0,4);
        if(randomTwo == 0){
            this.enemyTwo.y += 20;
        }
        else if(randomTwo == 1){
            this.enemyTwo.y -= 20;
        }
        else if(randomTwo == 2){
            this.enemyTwo.x += 20;
        }
        else if(randomTwo == 3){
            this.enemyTwo.x -= 20;
        }
        
        if(enemyAP <= 0){
            playerTurn = true;
            enemyAP = enemyAPMax;
        }
    }    
}

function render () {

    game.debug.text('PlayerAP: ' + playerAP + ' / ' + playerAPMax, 32, 32);
    game.debug.text('EnemyAP: ' + enemyAP + ' / ' + enemyAPMax, 32, 48);

}

