// Restarting the game function for the button 
function restartgame(){
    document.getElementsByTagName("canvas")[0].remove();
    document.getElementsByTagName("button")[0].remove();
    document.getElementsByTagName("button")[0].remove();
    gameStart(charPicked);
}

// Going back to Main Menu function for Button
function charScreen(){
    document.getElementsByTagName("canvas")[0].remove();
    document.getElementsByTagName("button")[0].remove();
    document.getElementsByTagName("button")[0].remove();
    document.getElementById("gate").style.display = "";
}

// Model Images and variable declare
var normal;
var jump;
var crash;
var charPicked;

var dk = {
    normal: "./models/dknormal.png",
    jump: "./models/dkjump.png",
    crash: "./models/dkcrash.png"
}

var beemo = {
    normal: "./models/beemonormal.png",
    jump: "./models/beemojump.png",
    crash: "./models/beemocrash.png"
}

var candies =  [
        "./candies/candy1.png",
        "./candies/candy2.png",
        "./candies/candy3.png",
        "./candies/candy4.png",
        "./candies/candy5.png",
        "./candies/candy6.png",
        "./candies/candy7.png",
        "./candies/candy8.png",
        "./candies/candy9.png",
        "./candies/candy10.png"
];

var candyRotated =  [
        "./candies/candy1.png",
        "./candies/candy2rotate.png",
        "./candies/candy3rotate.png",
        "./candies/candy4.png",
        "./candies/candy5rotate.png",
        "./candies/candy6rotate.png",
        "./candies/candy7rotate.png",
        "./candies/candy8rotate.png",
        "./candies/candy9rotate.png",
        "./candies/candy10rotate.png"
];


// GAME 
function gameStart(character){
    // Local Game Variable Declaration
    var myBackground;
    var myGamePiece;
    var myObstacles = [];
    var bouncingx = 0;
    var bouncingy = 0;
    charPicked = character;

    // Clearing the Menu page
    document.getElementById("gate").style.display = "none";

    
    // Buttons for Restart and Main Menu
    var resetButton = document.createElement("BUTTON");
    resetButton.innerHTML = "Restart";
    resetButton.setAttribute("onclick", "restartgame()");
    document.getElementById("buttons").appendChild(resetButton);
    var charScreenButton = document.createElement("BUTTON");
    charScreenButton.innerHTML = "Main Menu";
    charScreenButton.setAttribute("onclick", "charScreen()");
    document.getElementById("buttons").appendChild(charScreenButton);
    

    // Drawing The Canvas
    var myGameArea = {
        canvas : document.createElement("canvas"),
        start : function() {
            this.canvas.width = 1280;
            this.canvas.height = 720;
            this.context = this.canvas.getContext("2d");
            document.getElementById("container").appendChild(this.canvas);
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

    function everyinterval(n) {
        if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
        return false;
    }


    //Object Constructor
    function object(width, height, x, y, source, type){
        this.image = new Image();
        this.image.src = source;
        this.type = type;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.bounce = 0.6;
        if (this.type == "character"){
            this.gravity = 0.2;
            this.gravitySpeed = 0.1;
            this.crashWith = function(otherobj){
                var myleft = this.x + 30;
                var myright = this.x + (this.width) - 20;
                var mytop = this.y + 15;
                var mybottom = this.y + (this.height) - 20;
                var otherleft = otherobj.x;
                var otherright = otherobj.x + (otherobj.width);
                var othertop = otherobj.y;
                var otherbottom = otherobj.y + (otherobj.height);
                var crash = true;
                if ((mybottom < othertop) ||
                (mytop > otherbottom) || 
                (myright < otherleft) || 
                (myleft > otherright)) crash = false;
                return crash;
            }
        }
        this.update = function(){
            ctx = myGameArea.context;
            if (this.type == "character" || this.type == "background") {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                if (type == "background") {
                    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
                }
            } 
        }
        this.newPos = function(){
            this.x += this.speedX;
            if (this.type == "background") {
                if (this.x == -(this.width)) {
                  this.x = 0;
                }
            }
            if (this.type == "character"){
                this.gravitySpeed += this.gravity;
                this.y += this.speedY + this.gravitySpeed;
                this.hitBottom();
            }
        }
        this.hitBottom = function(){
            var bottom = myGameArea.canvas.height - this.height;
            if (this.y> bottom ){
                this.y = bottom ;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            }
        }
    }

    // Building ALL Objects
    function startGame() {
        myGameArea.start();
        myBackground = new object(myGameArea.canvas.width, myGameArea.canvas.height, 0, 0, "background.jpg", "background");
        if (character == 'dk') {
            myGamePiece = new object(100, 100, 300, 120, dk.normal, "character");
            normal = dk.normal;
            jump = dk.jump;
            crash = dk.crash;
        }
        if (character == 'beemo') {
            myGamePiece = new object(100, 100, 300, 120, beemo.normal, "character");
            normal = beemo.normal;
            jump = beemo.jump;
            crash = beemo.crash;
        }
        if (character == 'char3') {
            myGamePiece = new object(100, 100, 300, 120,  "image3.png","character");
        }
    }


    // Updating game data
    function updateGameArea(){
        myGameArea.clear();
        myBackground.speedX = -1;
        myBackground.update();
        myBackground.newPos(); 
        myGamePiece.speedY = 0;

        // Decreasing Velocity of X when a button is not pressed
        if (myGamePiece.speedX != 0) {
            if (myGamePiece.speedX > 0){
                myGamePiece.speedX = myGamePiece.speedX - 0.3;
                if (bouncingx > 1) {
                    myGamePiece.x = myGamePiece.x - bouncingx;
                    bouncingx = bouncingx - (bouncingx * 60 / 100);
                }
            } else {
                myGamePiece.speedX = myGamePiece.speedX +0.3;
            }
        }
        if (bouncingy > 1){
            myGamePiece.y = myGamePiece.y - bouncingy;
            bouncingy = bouncingy - (bouncingy * 60 / 100);
            
        }

        // Moving the Character based on key pressing
        if (myGameArea.keys && myGameArea.keys[38]) {
            myGamePiece.speedY = -10;
            myGamePiece.gravitySpeed = 0.5;  
            myGamePiece.image.src = jump;
            myGamePiece.update(); 
        }else myGamePiece.image.src = normal;
        if (myGameArea.keys && myGameArea.keys[39]) {
            myGamePiece.speedX = myGamePiece.speedX + 1;
            if (Math.abs(myGamePiece.speedX) > 7){
                myGamePiece.speedX = +7;
            }
        }
        if (myGameArea.keys && myGameArea.keys[37]) {
            myGamePiece.speedX =  myGamePiece.speedX - 1;
            if (Math.abs(myGamePiece.speedX) > 7){
                myGamePiece.speedX = -7;
            }
        }
        if (myGameArea.keys && myGameArea.keys[40]) {
            myGamePiece.speedY = 5;
        }
        myGamePiece.update();
        myGamePiece.newPos();

        // Spawining Obstacles
        if (myGameArea.frameNo == 0 || everyinterval(170)){
            var x = myGameArea.canvas.width;
            var y = myGameArea.canvas.height;
            var rdm = Math.floor(Math.random()*10);
            var candy = candies[rdm];
            var rotatedcandy = candyRotated[rdm];
            minHeight = 50;
            maxHeight = 450;
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            gap = 200;
            myObstacles.push(new object(100, height, x, 0, rotatedcandy, "character"));
            myObstacles.push(new object(100, y - height - gap, x, height + gap, candy, "character"));
        }
        // Setting the X speed of obstacles
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x -= 4;
            myObstacles[i].update();
        }

        // Object Crashing 
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myGamePiece.crashWith(myObstacles[i])) {
                
                console.log("crash working now!");
                var minbounce = 20;
                // X axis crash bounce
                bouncingx = (myGamePiece.speedX * 5) + minbounce;
                myGamePiece.x = myGamePiece.x - bouncingx;
                // Y axis crash bounce
                bouncingy = (myGamePiece.speedY * 7) + minbounce;
                myGamePiece.y = myGamePiece.y - bouncingy;
                
                
                myGamePiece.image.src = crash;
                myGamePiece.update();
                // setTimeout(function(){myGameArea.stop();}, 20);
            }
        }

        // Stopping the Character from going beyond Y axis map
        if (myGamePiece.y < -10) {
            myGamePiece.y = 0;
        }
        
        if (myGamePiece.x > myGameArea.canvas.width -100){
            myGamePiece.x = myGameArea.canvas.width -120;
        }

        // Losing the game when character leaves the map
        if (myGamePiece.x < - 100){
            myGameArea.stop();
            
        }
        
        myGameArea.frameNo += 1;
    }
    
    // Starting the game :) 
    startGame();
}