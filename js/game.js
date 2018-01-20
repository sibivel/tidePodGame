
var myGamePiece;
var myObstacles = [];//tide pods
var lives = [];
var myScore;
var ended = false;
var fallSpeed = 5;
var face = document.createElement('img');
var pod = document.createElement('img');
var highscore = -1;
face.src = "./images/open-mouth.png";
pod.src = "./images/tide-pods.png";
function startGame() {
   
    myHighScore = new component("30px", "Consolas", "black", 5, 80, "text");
    if(highscore > 0){
        myHighScore.text = "High Score: " + highscore;
    }else{
        myHighScore.text = ""
    }
    myGameArea.start();
    for(var i = 0; i < 3; i+=1){
        lives.push(new component(30, 30, "blue", i*40, 10, "life"))
    }
    var mult = 6
    width = 11*mult;
    height = 15*mult;
    myGamePiece = new component(width, height, "blue", 10, myGameArea.canvas.height-height, "player");
    myScore = new component("30px", "Consolas", "black", myGameArea.canvas.width-170, 40, "text");
}
      

var factor = 0.4;
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.style.margin = "0 auto";
        this.canvas.style.display = "block";
        
        this.canvas.width = Math.min(1080 * factor, screen.width*0.8);
        this.canvas.height = Math.min(1920 * factor, screen.height*0.8);
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 15);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    again : function() {
        ended = false;
        myGameArea.frameNo = 0;
        fallSpeed = 5;
        myGameArea.clear();
        myScore.score = 0;
        // myGameArea.start();
        if(highscore > 0){
            myHighScore.text = "High Score: " + highscore;
         }else{
             myHighScore.text = ""
         }
        for(var i = 0; i < 3; i+=1){
            lives.push(new component(30, 30, "blue", i*40, 10, "life"))
        }
        intervalSize = 70;
    } 
}
var ctx = myGameArea.canvas
ctx.addEventListener("mousemove", setMousePosition, false);
ctx.addEventListener("mousedown", playAgain, false);
ctx.addEventListener("touchstart", setFingerPosition, false);
// ctx.addEventListener("touchend", setMousePosition, false);
// ctx.addEventListener("touchcancel", setMousePosition, false);
ctx.addEventListener("touchmove", setFingerPosition, false);

ctx.style.cursor = 'none';
function setMousePosition(e) {
 mouseX = e.clientX;
 mouseY = e.clientY;
}
function setFingerPosition(e) {
    var touches = e.touches;
    mouseX = touches[0].clientX;
    mouseY = touches[0].clientY;
}
function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    
    this.gravitySpeed = fallSpeed;

    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if(this.type == "player") {
            var mult = 5
            ctx.drawImage(face, this.x, this.y, width, height);
            // ctx.fillStyle = color;
            // ctx.fillRect(this.x, this.y, this.width, this.height);
        }else if(this.type == "again"){
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.font = "30px Consolas"
            ctx.fillStyle = "white";
            ctx.fillText("Play Again", this.x+10, this.y+40);
            myGameArea.canvas.style.cursor = 'crosshair';
        }else{
            ctx.drawImage(pod, this.x, this.y, width, height);
        }
    }
    this.fall = function() {
        // this.gravitySpeed += this.gravity;
        // this.x += this.speedX;
        this.y += this.gravitySpeed;
        // this.hitBottom();
    }
    this.newPos = function(){
        this.x = mouseX-this.width*0.75;
    }
    // this.hitBottom = function() {
    //     var rockbottom = myGameArea.canvas.height - this.height;
    //     if (this.y > rockbottom) {
    //         this.y = rockbottom;
    //         this.gravitySpeed = 0;
    //     }
    // }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    
}
var intervalSize = 70
function updateGameArea() {
    if(ended){
        myGameArea.clear();
        endGame();
        return null;
    }
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myScore.score += 1;
            myObstacles.splice(i, 1);
            i -= 1;
        }else if(myObstacles[i].y >= myGameArea.canvas.height){
            myObstacles.splice(i, 1);
            i -= 1;
            var life = lives.pop();
            if(typeof life == 'undefined'){
                endGame();
                ended = true;
            }
        }

    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(intervalSize)) {
        x = myGameArea.canvas.width;
        width = 60;
        height = 60;
        x = Math.random()*(myGameArea.canvas.width-width);
        var obstacle = new component(width, height, "red", x, 0);
        obstacle.gravity = 0.05; 
        myObstacles.push(obstacle);
    }
    if(everyinterval(350)){
        if(fallSpeed < 40){
            fallSpeed *= 1.3;
            intervalSize -= 1;
        }
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].update();
        myObstacles[i].fall();
    }
    for(i = 0; i < lives.length; i += 1){
        lives[i].update();
    }
    myScore.text="SCORE: " + myScore.score;
    myScore.update();
    // mySpeed.text = "SPEED: " + Math.floor(fallSpeed);
    myHighScore.update();
    myGamePiece.update();
    myGamePiece.newPos();
    
    
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

function endGame(){
    gameover = new component("30px", "Consolas", "black", 120, myGameArea.canvas.height/2, "text");
    score = new component("30px", "Consolas", "black", 120, myGameArea.canvas.height/2+30, "text");
    gameover.text = "Game Over";
    score.text = "Score: "+ myScore.score;
    
    if(myScore.score >= highscore){
        high = new component("30px", "Consolas", "black", 120, myGameArea.canvas.height/2+60, "text");
        highscore = myScore.score;
        high.text = "New Highscore!"
        high.update();
    }
    gameover.update();
    score.update();
    myPlayAgain = new component(200, 60, "green", 120, myGameArea.canvas.height/2+90, "again");
    myPlayAgain.update();
    
    // clearInterval(myGameArea.interval);
    // return null;
} 

function playAgain(){
    if(ended){
        console.log("again");
        myGameArea.again();
    }
}