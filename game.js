var myGamePiece;
var myObstacles = [];
var myScore;
var mySound;

// Canvas
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.frameNo = 0;
      this.interval = setInterval(updateGameArea, 20);
      window.addEventListener('keydown', function (e) {
        myGameArea.keys = (myGameArea.keys || []);
        myGameArea.keys[e.keyCode] = true;
      })
      window.addEventListener('keyup', function (e) {
        myGameArea.keys[e.keyCode] = false;
      })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function(){
        clearInterval(this.interval);
    }
}

// Building Objects
function startGame() {
    myGamePiece = new component(100, 100, "image1.png", 500, 120, "image");
    myObstacle = new component(10, 300, "red", 2000, 0);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    mySound = new sound("hit.mp3");
    myGameArea.start();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

// Constructor
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.2;
    this.gravitySpeed = 0.1;
    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (type == "image") {
            ctx.drawImage(this.image,
              this.x,
              this.y,
              this.width, this.height);
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function(){ //Position Update
        this.gravitySpeed += this.gravity;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
          this.y = rockbottom;
        } 
    }
    this.crashWith = function(otherobj) { // Objects Collision
        var myleft = this.x;
        var myright = this.x + (this.width) - 20;
        var mytop = this.y -10;
        var mybottom = this.y + (this.height) -20;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false; 
        }
        return crash;
      }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGamePiece.image.src = "image3.png";
            myGamePiece.update();
            mySound.play();
            setTimeout(function () {
            window.location.reload();
            }, 2500); 
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(70)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 450;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 200;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(100, height, "red", x, 0));
        myObstacles.push(new component(100, x - height - gap, "red", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x -= 12;
        myObstacles[i].update();
    }
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[38]) {
        myGamePiece.speedY = -10;
        myGamePiece.gravitySpeed = 0.1; 
        myGamePiece.image.src = "image2.png";
    } else myGamePiece.image.src = "image1.png";
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

