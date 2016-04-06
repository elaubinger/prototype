
EnemyTank = function (index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.shadow = game.add.sprite(x, y, 'shadow');
    this.tank = game.add.sprite(x, y, 'tank1');
    this.turret = game.add.sprite(x, y, 'turret');
    
    //this.shadow.scale.setTo(0.5, 0.5);
    //this.tank.scale.setTo(0.5, 0.5);
    //this.turret.scale.setTo(0.5, 0.5);

    this.shadow.anchor.set(0.5);
    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = true;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

};

EnemyTank.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

        this.shadow.kill();
        this.tank.kill();
        this.turret.kill();

        return true;
    }

    return false;

}

EnemyTank.prototype.update = function() {

    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

    if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 500)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
            
            enemyfirefx.play();
        }
    }

};

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

var shadow;
var tank;
var turret;

var enemies;
var enemyBullets;
var enemiesTotal = 5;
var enemiesAlive = 0;
var explosions;

var logo;
var winScreen;
var loseScreen;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;

var healthTotal = 5;
var health = 5;

var music;
var missioncompletefx;
var gameoverfx;
var firefx;
var enemyfirefx;
var hitfx;
var explodefx;

var level = 1;

var firstGame = 'yes';

function create () {

    game.renderer.renderSession.roundPixels = true;
    
    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 1200, 800, 'earth');
    land.fixedToCamera = true;

    //  The base of our tank
    tank = game.add.sprite(0, 0, 'tank2');
    tank.anchor.setTo(0.5, 0.5);
    //tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  This will force it to decelerate and limit its speed
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.2);
    tank.body.maxVelocity.setTo(400, 400);
    tank.body.collideWorldBounds = true;

    //  Finally the turret that we place on-top of the tank body
    turret = game.add.sprite(0, 0, 'turret1');
    turret.anchor.setTo(0.3, 0.5);

    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet1');
    
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    health = healthTotal;
    
    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal += 5;
    enemiesAlive = enemiesTotal;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemyTank(i, game, tank, enemyBullets));
    }

    //  A shadow below our tank
    shadow = game.add.sprite(0, 0, 'shadow');
    shadow.anchor.setTo(0.5, 0.5);

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    tank.bringToTop();
    turret.bringToTop();

    if(firstGame == 'yes'){
        logo = game.add.sprite(0, 0, 'logo');
        logo.fixedToCamera = true;

        game.input.onDown.add(removeLogo, this);
    }
    if(firstGame == 'win'){
        winScreen = game.add.sprite(0, 0, 'win');
        winScreen.fixedToCamera = true;

        game.input.onDown.add(removeWin, this);
    }
    if(firstGame == 'lose'){
        loseScreen = game.add.sprite(0, 0, 'lose');
        loseScreen.fixedToCamera = true;

        game.input.onDown.add(removeLose, this);
    }
        
    game.camera.follow(tank);
    //game.camera.deadzone = new Phaser.Rectangle(150, 150, 300, 200);
    game.camera.focusOnXY(0, 0);
    //game.camera.width = 10000;
    //game.camera.height = 10000;

    cursors = game.input.keyboard.createCursorKeys();
    if(music != null){
        music.stop();
    }
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
    
    game.sound.volume = 0.3;
    
    music.play();
    music.loop = true;
    //music.volume -= 0.5;
    
    game.paused = true;
    game.input.onDown.add(unpause, self);

}

function unpause(event){
        // Only act if paused
        if(game.paused){
            game.paused = false;
        }
}

function removeLogo () {

    game.input.onDown.remove(removeLogo, this);
    logo.kill();

}

function removeWin () {

    game.input.onDown.remove(removeWin, this);
    winScreen.kill();

}

function removeLose () {

    game.input.onDown.remove(removeLose, this);
    loseScreen.kill();

}


function enemyCollide () {
    
    health -= 5;
    
    if(health <= 0){
        
        lose();
    }
}

function lose() {
    music.stop();
    //gameoverfx.play();
    enemiesTotal = 5;
    firstGame = 'lose';
    level = 1;
    create();
}

function win() {
    music.stop();
    //missioncompletefx.play();
    firstGame = 'win';
    level++;
    create();
}

function update () {

    game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
    
    enemiesAlive = 0;

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemiesAlive++;
            //game.physics.arcade.collide(tank, enemies[i].tank, enemyCollide);
            game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
            enemies[i].update();
        }
    }

    if(enemiesAlive <= 0){
        win();
    }
    
    if (cursors.left.isDown)
    {
        tank.angle -= 4;
    }
    else if (cursors.right.isDown)
    {
        tank.angle += 4;
    }

    //if (cursors.up.isDown)
    //{
        // The speed we'll travel at
        currentSpeed = 2000;
    //}
    //else
    //{
        //if (currentSpeed > 0)
        //{
            //currentSpeed -= 8;
        //}
    //}

    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    //  Position all the parts and align rotations
    shadow.x = tank.x;
    shadow.y = tank.y;
    shadow.rotation = tank.rotation;

    turret.x = tank.x;
    turret.y = tank.y;

    turret.rotation = game.physics.arcade.angleToPointer(turret);

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();
    }

}

function bulletHitPlayer (tank, bullet) {

    bullet.kill();
    health -= 1;
    tank.tint = (0xff0000 + (0xffffff * 0.5));
    game.time.events.add(Phaser.Timer.SECOND * 0.1, function() { blink(tank); }, this);
    
    explosionAnim = game.add.sprite( (bullet.x + tank.x)/2,
                                     (bullet.y + tank.y)/2,
                                     'explosionanim',
                                     5);
    explosionAnim.anchor.setTo(0.5, 0.5);
    explosionAnim.smoothed = false;
    explosionAnim.scale.x = 2.0;
    explosionAnim.scale.y = 2.0;
    anim = explosionAnim.animations.add('explode');
    anim.play(20, true);
    anim.loop = false;
    
    if(health <= 0){
        lose();
    }

}

function bulletHitEnemy (tank, bullet) {

    bullet.kill();

    var destroyed = enemies[tank.name].damage();
    
    explosionAnim = game.add.sprite( (bullet.x + tank.x)/2,
                                     (bullet.y + tank.y)/2,
                                     'explosionanim',
                                     5);
    explosionAnim.anchor.setTo(0.5, 0.5);
    explosionAnim.smoothed = false;
    scale = game.rnd.integerInRange(1, 3);
    explosionAnim.scale.x = scale;
    explosionAnim.scale.y = scale;
    anim = explosionAnim.animations.add('explode');
    anim.play(20, true);
    anim.loop = false;
    //explosionAnim.play();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(tank.x, tank.y);
        //explosionAnimation.speed = 1;
        explosionAnimation.play('kaboom', 13, false, true);
        explodefx.play();
    }
    else{
        hitfx.play();
        tank.tint = (0xff0000 + (0xffffff * 0.5));
        game.time.events.add(Phaser.Timer.SECOND * 0.1, function() { blink(tank); }, this);
    }

}

function blink (sprite) {
    sprite.tint = 0xffffff;
}

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);

        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 2000, game.input.activePointer);
        
        firefx.play();
        
        smokeAnim = game.add.sprite( 
                                     bullet.x,
                                     bullet.y,
                                     'smokeanim',
                                     5);
        smokeAnim.anchor.setTo(0.5, 0.5);
        smokeAnim.smoothed = false;
        scale = (game.rnd.integerInRange(2, 4))/2;
        smokeAnim.scale.x = scale;
        smokeAnim.scale.y = scale;
        anim = smokeAnim.animations.add('explode');
        anim.play(100, true);
        anim.loop = false;
        
    }

}

function render () {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
    game.debug.text('Health: ' + health + ' / ' + healthTotal, 32, 48);
    game.debug.text('Level: ' + level, 32, 64);

}

