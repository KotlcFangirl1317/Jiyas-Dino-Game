var PLAY = 1;
var END = 0;
var gameState = PLAY;
var obstaclesGroup
var gameOver, gameOverImage
var restart, restartImage
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cacti, cacti1, cacti2, cacti3, cacti4, cacti5, cacti6;
var score = 0
var cloud, cloudsGroup, cloudImage;
var newImage;
var jumpSound, dieSound, checkPointSound

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

  groundImage = loadImage("ground2.png");
  cacti1 = loadImage("obstacle1.png");
  cacti2 = loadImage("obstacle2.png");
  cacti3 = loadImage("obstacle3.png");
  cacti4 = loadImage("obstacle4.png");
  cacti5 = loadImage("obstacle5.png");
  cacti6 = loadImage("obstacle6.png");
  cloudImage = loadImage("cloud.png");
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
}

function setup() {
  createCanvas(600, 200);
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  gameOver = createSprite(300, 100, 10, 10)
  gameOver.addImage("gameOver", gameOverImage)
  gameOver.scale = 0.5

  restart = createSprite(300, 130, 10, 10)
  restart.addImage("restart", restartImage)
  restart.scale = 0.5
  trex.setCollider("circle", 0, 0, 40);
}

function draw() {
  background("white");
  text("score:  " + score, 500, 20)

  if (gameState == PLAY) {
    ground.velocityX = -(4 + score / 100);
    score = score + Math.round(getFrameRate() / 60)

    if (keyDown("space") && trex.y >= 160) {
      jumpSound.play()
      trex.velocityY = -10;
    }

    trex.velocityY = trex.velocityY + 0.7

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    spawnClouds();
    spawnCacti();

    gameOver.visible = false
    restart.visible = false

    if (score % 100 == 0 && score > 0) {
      checkPointSound.play();
    }

    if (trex.isTouching(obstaclesGroup)) {
      gameState = END
      dieSound.play();
    }
  } else if (gameState == END) {
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided", trex_collided)
    cloudsGroup.setLifetimeEach(-1)
    obstaclesGroup.setLifetimeEach(-1)
    trex.velocityY = 0
    gameOver.visible = true
    restart.visible = true

    if (mousePressedOver(restart) || (keyWentUp("Space"))) {
      reset();
    }
  }


  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10, 60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;


    //assigning lifetime to the variable
    cloud.lifetime = 200

    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud)
  }

}

function spawnCacti() {
  if (frameCount % 60 == 0) {
    cacti = createSprite(580, 170, 20, 20)
    cacti.velocityX = -(4.5 + score / 100)
    var rand = Math.round(random(6, 1))
    switch (rand) {
      case 1:
        cacti.addImage(cacti1)
        break

      case 2:
        cacti.addImage(cacti2)
        break

      case 3:
        cacti.addImage(cacti3)
        break

      case 4:
        cacti.addImage(cacti4)
        break

      case 5:
        cacti.addImage(cacti5)
        break

      case 6:
        cacti.addImage(cacti6)
        break

      default:
        break
    }
    cacti.scale = 0.4
    cacti.lifetime = 200
    obstaclesGroup.add(cacti)
  }
}

function reset() {
  gameState = PLAY
  score = 0
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running")
  //frameCount = 0
}