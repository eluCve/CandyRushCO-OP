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

var normalSecond;
var jumpSecond;
var crashSecond;
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
        this.bouncingx = 0;
        this.bouncingy = 0;
        if (this.type == "character"){
            this.gravity = 0.2;
            this.gravitySpeed = 0.1;
            this.crashWith = function(otherobj){
                var myleft = this.x; //+ 30;
                var myright = this.x + (this.width); //- 20;
                var mytop = this.y; //+ 15;
                var mybottom = this.y + (this.height); //- 20;
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
        this.physics = function () {
            if  (this.speedX != 0){
                if (this.speedX > 0){
                    this.speedX = this.speedX - 0.3;
                    if (this.bouncingx > 1){
                        this.x = this.x - this.bouncingx;
                        this.bouncingx = this.bouncingx - (this.bouncingx * 60 / 100);
                    }
                } else {
                    this.speedX = this.speedX + 0.3;
                }
            }
            if (this.bouncingy > 1){
                this.y = this.y - this.bouncingy;
                this.bouncingy = this.bouncingy - (this.bouncingy * 60 / 100);
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
        myGamePieceSecond = new object(100, 100, 600, 120, beemo.normal, "character");
        normalSecond = beemo.normal;
        jumpSecond = beemo.jump;
        crashSecond = beemo.crash;
    }


    // Updating game data
    function updateGameArea(){
        myGameArea.clear();
        myBackground.speedX = -1;
        myBackground.update();
        myBackground.newPos(); 
        myGamePiece.speedY = 0;
        myGamePieceSecond.speedY = 0;


        // Moving the First Character based on key pressing
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

        // Stopping the First Character from going beyond Y axis map
        if (myGamePiece.y < -10) {
            myGamePiece.y = 0;
        }
        
        if (myGamePiece.x > myGameArea.canvas.width -100){
            myGamePiece.x = myGameArea.canvas.width -120;
        }

        // Losing the game when the Firstcharacter leaves the map
        if (myGamePiece.x < - 100){
            myGameArea.stop();
            
        }



        // Moving the Second Character based on key pressing
        if (myGameArea.keys && myGameArea.keys[87]) {
            myGamePieceSecond.speedY = -10;
            myGamePieceSecond.gravitySpeed = 0.5;  
            myGamePieceSecond.image.src = jumpSecond;
            myGamePieceSecond.update(); 
        }else myGamePieceSecond.image.src = normalSecond;
        if (myGameArea.keys && myGameArea.keys[68]) {
            myGamePieceSecond.speedX = myGamePieceSecond.speedX + 1;
            if (Math.abs(myGamePieceSecond.speedX) > 7){
                myGamePieceSecond.speedX = +7;
            }
        }
        if (myGameArea.keys && myGameArea.keys[65]) {
            myGamePieceSecond.speedX =  myGamePieceSecond.speedX - 1;
            if (Math.abs(myGamePieceSecond.speedX) > 7){
                myGamePieceSecond.speedX = -7;
            }
        }
        if (myGameArea.keys && myGameArea.keys[83]) {
            myGamePieceSecond.speedY = 5;
        }
        myGamePieceSecond.update();
        myGamePieceSecond.newPos();

        // Stopping the Second Character from going beyond Y axis map
        if (myGamePieceSecond.y < -10) {
            myGamePieceSecond.y = 0;
        }
        
        if (myGamePieceSecond.x > myGameArea.canvas.width -100){
            myGamePieceSecond.x = myGameArea.canvas.width -120;
        }

        // Losing the game when the Second character leaves the map
        if (myGamePieceSecond.x < - 100){
            myGameArea.stop();
            
        }
        
        

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
                var minbounce = 20;
                if ( myGamePiece.x < myObstacles[i].x){
                    bouncingx = (myGamePiece.speedX * 5) + minbounce;
                    myGamePiece.x = myGamePiece.x - bouncingx;
                    bouncingy = (myGamePiece.speedY * 7) + minbounce;
                    myGamePiece.y = myGamePiece.y - bouncingy;
                } else {
                    
                }
                
                myGamePiece.image.src = crash;
                myGamePiece.update();
            }
        }

        // Object Crashing 2
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myGamePieceSecond.crashWith(myObstacles[i])) {
                
                console.log("crash working now!");
                var minbounce = 20;
                // X axis crash bounce
                bouncingx = (myGamePieceSecond.speedX * 5) + minbounce;
                myGamePieceSecond.x = myGamePieceSecond.x - bouncingx;
                // Y axis crash bounce
                bouncingy = (myGamePieceSecond.speedY * 7) + minbounce;
                myGamePieceSecond.y = myGamePieceSecond.y - bouncingy;
                
                myGamePieceSecond.image.src = crash;
                myGamePieceSecond.update();
            }
        }


        
        if (myGamePiece.crashWith(myGamePieceSecond)) {
            var minBounce = 20;
            var maxBounceX = (Math.abs(myGamePiece.speedX) + Math.abs(myGamePieceSecond.speedX)) * 5 + minBounce;
            var maxBounceY = (Math.abs(myGamePiece.speedY) + Math.abs(myGamePieceSecond.speedY) * 5 + minBounce);
            
            if (myGamePiece.x < myGamePieceSecond.x){
                myGamePiece.x = myGamePiece.x - maxBounceX;
                myGamePieceSecond.x = myGamePieceSecond.x + maxBounceX;
            } else {
                myGamePiece.x = myGamePiece.x + maxBounceX;
                myGamePieceSecond.x = myGamePieceSecond.x - maxBounceX;
            }

            if (myGamePiece.y < myGamePieceSecond.y){
                myGamePiece.y = myGamePiece.y - maxBounceY;
                myGamePieceSecond.y = myGamePieceSecond.y + maxBounceY;
            } else {
                myGamePiece.y = myGamePiece.y + maxBounceY;
                myGamePieceSecond.y = myGamePieceSecond.y - maxBounceY;
            }

            myGamePiece.image.src = crash;
            myGamePiece.update();
            myGamePieceSecond.image.src = crash;
            myGamePieceSecond.update();   
            myGamePiece.speedX = 0;
            myGamePieceSecond.speedX = 0;
            myGamePiece.speedY = 0;
            myGamePieceSecond.speedY = 0;
            
        }
        

        // Decreasing Velocity of X and Y when a button is not pressed and apply bouncing when crash
        myGamePiece.physics();
        myGamePieceSecond.physics();
        

        // Adding Next frame
        myGameArea.frameNo += 1;
    }
    
    // Starting the game :) 
    startGame();
}
