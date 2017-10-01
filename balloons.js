// Balloons Document objects:
var arena = document.querySelector("#arena");
var balloons = document.querySelectorAll('.balloon');
var score = document.querySelector("#score");
var levelDisplay = document.querySelector("#level");
var levelScore = 300;
var level = 1;

var balloonSize = parseInt(balloons[0].clientHeight);
var topPosition = parseInt(arena.clientTop) - balloonSize;
var bottomPosition = parseInt(arena.clientHeight) + balloonSize;

function initArenaSize() {
    // Misc Balloons Document objects:
    var gameframe = document.querySelector("#gameframe");
    var title = document.querySelector("#title");       // title div
    var player = document.querySelector("#player");     // player div
    var markee = document.querySelector("#markee");     // markee div

   // gameframe.width = window.innerWidth; // + "px";
  //  gameframe.height = window.innerHeight; // + "px";
    //arena.height = window.innerHeight - (title.clientHeight + player.clientHeight + markee.clientHeight) + "px";
    //arena.width = window.innerWidth;

    console.log(arena.clientHeight, window.innerHeight);
    balloonSize = parseInt(balloons[0].clientHeight);
    topPosition = parseInt(arena.clientTop) - balloonSize;
    bottomPosition = parseInt(arena.clientHeight) + balloonSize;
}

function init() {
    initArenaSize();
    window.addEventListener('resize', 
        function(ev) {
            initArenaSize();
        });

    var theTime = Date.now();
    for (var i = 0; i < balloons.length; i++) {
        var id = balloons[i].id;
        balloons[i].y = bottomPosition;
        balloons[i].style.top = Math.floor(balloons[i].y) + "px";
        balloons[i].style.left = Math.floor(Math.random() * (arena.clientWidth - balloonSize)) + "px";
        balloons[i].style.opacity = 1.0;
        
        var c = balloons[i].className;
        if (c == "red balloon") {
            balloons[i].dy = 0.95;
        }
        else if (c == "green balloon") {
            balloons[i].dy = 0.90;
        }
        else if (c == "yellow balloon") {
            balloons[i].dy = 0.85;
        }
        else if (c == "blue balloon") {
            balloons[i].dy = 0.80;
        }
        balloons[i].dy += 0.1 * Math.random();

        score.score = 0;
        if (i <= level) {
            balloons[i].status = 3;                
        }
        else {
            balloons[i].status = -1;                
        }
        balloons[i].time = theTime + Math.floor(Math.random() * 200); // ms to wait for start
        balloons[i].addEventListener('click', function(ev){
            ev.target.status = 1; // Begin pop
            score.score += Math.floor(ev.target.dy * 100);
            score.innerText = "Score: " + score.score;
        });
    }
}

function gameLoop() {
    var theTime = Date.now();

    for (var i = 0; i < balloons.length; i++) {
        var status = balloons[i].status;

        if (status == 0) {
            // Balloon is OKAY
            balloons[i].y -= balloons[i].dy;
            if (balloons[i].y < topPosition
        )
            {
                balloons[i].y = bottomPosition;
            }
            balloons[i].style.top = Math.floor(balloons[i].y) + "px";
        }
        else if (status == 1) {
            // Balloon popping init
            balloons[i].innerText = ">POP!<";
            balloons[i].time = theTime;
            balloons[i].style.opacity = 1.0;
            balloons[i].status++;   // next stage
        }
        else if (status == 2) {
            // Balloon popping 
            var totalPopTime = 300; // ms
            var msPassed = theTime - balloons[i].time;
            if (msPassed < totalPopTime) {
                balloons[i].style.opacity = (totalPopTime - msPassed) / totalPopTime;                
            }
            else {
                // animated pop is complete
                // move balloon to reset position
                balloons[i].y = bottomPosition;
                balloons[i].style.top = Math.floor(balloons[i].y) + "px";
                balloons[i].style.left = Math.floor(Math.random() * (arena.clientWidth - balloonSize)) + "px";
                balloons[i].innerText = "";
                balloons[i].style.opacity = 0.0;
                balloons[i].time = theTime + Math.floor(Math.random() * 1000); // ms to wait for reset
                balloons[i].status++;  // set this balloon to next stage
            }
        }
        else if (status == 3) {
            // Balloon reset
            var bTime = balloons[i].time;
            var diffTime = theTime - bTime;

            if (diffTime > 0)
            {
                if (Math.random() > 0.0) {
                    balloons[i].status = 0; // Start again.
                    balloons[i].style.opacity = 1.0;
                }
            }
        }
    }

    if (score.score >= levelScore) {
        levelScore *= 2;
        level++;
        alert("Great! You made it to level " + level + "!");
        levelDisplay.innerText = "Level: " + level;

        for (var i = 0; i < balloons.length; i++) {
            balloons[i].dy += 0.5 * Math.random();
            
            if (i <= level) {
                balloons[i].status = 1;                
            }
            else {
                balloons[i].status = -1;                
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

function start() {
//    alert("BALLOONS!  Level: " + level + "!");    
    init();
    gameLoop();
}
