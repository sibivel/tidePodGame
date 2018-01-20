
var myGamePiece;
var myObstacles = [];//tide pods
var myScore;
var fallSpeed = 5;
var face = document.createElement('img');
var pod = document.createElement('img');
face.src = "./images/open-mouth.png";
pod.src = "./images/tide-pods.png";
function startGame() {
   
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    mySpeed = new component("30px", "Consolas", "black", 40, 40, "text");
    myGameArea.start();
    var mult = 6
    width = 11*mult;
    height = 15*mult;
    myGamePiece = new component(width, height, "blue", 10, myGameArea.canvas.height-height, "player");
}
      

var factor = 0.4;
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1080 * factor;
        this.canvas.height = 1920 * factor;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 15);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
var ctx = myGameArea.canvas
ctx.addEventListener("mousemove", setMousePosition, false);
ctx.style.cursor = 'none';
function setMousePosition(e) {
 mouseX = e.clientX;
 mouseY = e.clientY;
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

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myScore.score += 1;
            myObstacles.splice(i, 1);
            i -= 1;
        }else if(myObstacles[i].y >= ctx.height){
            myObstacles.splice(i, 1);
            i -= 1;
        }

    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        x = myGameArea.canvas.width;
        width = 50;
        height = 50;
        x = Math.random()*myGameArea.canvas.width
        var obstacle = new component(width, height, "red", x, 0);
        obstacle.gravity = 0.05; 
        myObstacles.push(obstacle);
    }
    if(everyinterval(500)){
        if(fallSpeed < 40){
            fallSpeed *= 1.2;
        }
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].update();
        myObstacles[i].fall();
    }
    myScore.text="SCORE: " + myScore.score;
    myScore.update();
    mySpeed.text = "SPEED: " + Math.floor(fallSpeed);
    mySpeed.update();
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