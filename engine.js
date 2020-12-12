function gameStart(character){
    // Variables Declaration
    var myBackground;
    var myGamePiece;
    var myObstacles = [];
    var candies =  [
        "candy1.png",
        "candy2.png",
        "candy3.png",
        "candy4.png",
        "candy5.png",
        "candy6.png",
        "candy7.png",
        "candy1.png",
        "candy2.png",
        "candy3.png"
    ];

    var candyRotated =  [
        "candy1.png",
        "candy2rotate.png",
        "candy3rotate.png",
        "candy4.png",
        "candy5rotate.png",
        "candy6rotate.png",
        "candy7rotate.png",
        "candy1.png",
        "candy2rotate.png",
        "candy3rotate.png"
    ];





    // Clearing the page
    document.getElementById("gate").style.display = "none";


    // Making Our Canvas Enviroment
    var myGameArea = {
        canvas : document.createElement("canvas"),
        start : function() {
            this.canvas.width = 1280;
            this.canvas.height = 720;
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
            }
        }
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
    }

    // Building ALL Objects
    function startGame() {
        myGameArea.start();
        myBackground = new object(myGameArea.canvas.width, myGameArea.canvas.height, 0, 0, "background.jpg", "background");
        if (character == 'char1') {
            myGamePiece = new object(100, 100, 300, 120, "image1.png", "character");
        }
        if (character == 'char2') {
            myGamePiece = new object(100, 100, 300, 120, "image2.png", "character");
        }
        if (character == 'char3') {
            myGamePiece = new object(100, 100, 300, 120,  "image3.png","character");
        }
    }


    // Updating game data
    function updateGameArea(){
        myGameArea.clear();
        myBackground.speedX = -1;
        myBackground.newPos();
        myBackground.update();
        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;
        if (myGameArea.keys && myGameArea.keys[38]) {
            myGamePiece.speedY = -10;
            myGamePiece.gravitySpeed = 0.5;   
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
            myGamePiece.speedX = 5;
        }
        if (myGameArea.keys && myGameArea.keys[37]) {
            myGamePiece.speedX = -5;
        }
        if (myGameArea.keys && myGameArea.keys[40]) {
            myGamePiece.speedY = 5;
        }
        myGamePiece.update();
        myGamePiece.newPos();
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(170)){
            var x = myGameArea.canvas.width;
            var y = myGameArea.canvas.height;
            var rdm = Math.floor(Math.random()*10);
            var candy = candies[rdm];
            var rotatedcandy = candyRotated[rdm];
            minHeight = 20;
            maxHeight = 450;
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            gap = 200;
            myObstacles.push(new object(100, height, x, 0, rotatedcandy, "character"));
            myObstacles.push(new object(100, y - height - gap, x, height + gap, candy, "character"));
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x -= 4;
            myObstacles[i].update();
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myGamePiece.crashWith(myObstacles[i])) {
                myGamePiece.image.src = "image3.png";
                myGamePiece.update();
                myGameArea.stop();
            }
        }
    }


    
    // Starting the game :) 
    startGame();
}
