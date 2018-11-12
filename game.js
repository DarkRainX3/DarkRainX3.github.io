var canvas;
var ctx;
var ballX = 50;
var ballY = 50;
var xv = 10
var yv = 10;
var info = document.getElementById('info');
var moreinfo = document.getElementById('moreinfo');
var speed = 29; // pretty much frames per second
var lPadY = 250;
var rPadY = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WIN_SCORE = 3;
var midPad = lPadY + PADDLE_HEIGHT/2
var lScore = 0;
var rScore = 0;
var showWinScreen = false;
var winner = 0;

window.onload = function() {
    canv = document.getElementById("gameCanvas");
    ctx = canv.getContext("2d");
    canv.addEventListener('mousedown', handleMouseClick);
    canv.addEventListener('mousemove', function (evt) {
        var mousePos = calcMousePos(evt);
        lPadY=mousePos.y-PADDLE_HEIGHT/2;
    })

    setInterval(function() {
        drawEverything();
        move();
    }, 1000/speed);
}

function handleMouseClick(evt) {
    if (showWinScreen){
        lScore = 0;
        rScore = 0;
        showWinScreen=false;
    }
}

function resetBall() {
    if (lScore >= WIN_SCORE || rScore >= WIN_SCORE) {
        if (lScore >= WIN_SCORE){
            winner = 0;
        }
        else {
            winner = 1;
        }
        showWinScreen = true;
    }
    ballX = canv.width/2;
    ballY = canv.height/2;
    yv = Math.floor(Math.random()*10)+1
    if (Math.floor(Math.random()*2)>0)
        yv = -yv
}

function calcMousePos(evt) {
    var rect = canv.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function move() {
    if (showWinScreen){
        ctx.fillStyle = 'white';
        if (winner == 0){
            ctx.fillText("You Win! \n Click to Continue", canv.width/2-60,canv.height/2+50);
            return;
        }
        else if (winner == 1){
            ctx.fillText("You Lose! \n Click to Continue", canv.width/2-60,canv.height/2+50);
            return;
        }
        return;
    }
    if (rPadY+PADDLE_HEIGHT/2<ballY-20)
        rPadY += (ballY-(rPadY+PADDLE_HEIGHT/2))/6;
    if (rPadY+PADDLE_HEIGHT/2>ballY+20)
        rPadY -= ((rPadY+PADDLE_HEIGHT/2)-ballY)/6;

    if (ballX >= canv.width-20){
        if (ballY>rPadY && ballY <rPadY+PADDLE_HEIGHT) {
            xv=-10;
            yv=(ballY-(rPadY+PADDLE_HEIGHT/2))/2.5
        }
    }
    if (ballX >= canv.width-10){
        lScore++;
        resetBall();
    }
    if (ballX <=20){
        if (ballY>lPadY && ballY <lPadY+PADDLE_HEIGHT) {
            xv=10;
            yv=(ballY-(lPadY+PADDLE_HEIGHT/2))/2.5
        }
    }
    if (ballX <= 10) {
        rScore++
        resetBall();
    }
    if (ballY >= canv.height-10)
        yv = -yv;
    if (ballY <=10)
        yv = -yv;
    ballY +=yv;
    ballX +=xv;
}
function drawNet() {
    for (var i =0; i<canv.height; i+=40) {
        colorRect(canv.width/2,i+10,2,20,'white');
    }
}
function drawEverything() {
    if (lPadY+PADDLE_HEIGHT > canv.height-1)
        lPadY=(canv.height-PADDLE_HEIGHT-1)
    if (lPadY <= 0)
        lPadY=(1)
    //info.textContent = (rPadY+PADDLE_HEIGHT/2) + " " + ballY +" ai correction: "+(ballY-(rPadY+PADDLE_HEIGHT/2))/5 +'\n'+ (ballY-(lPadY+PADDLE_HEIGHT/2));
    //moreinfo.textContent = " expected speed: "+(ballY-(lPadY+PADDLE_HEIGHT/2))*0.33 + "ballspeed: "+ yv+' winner: '+winner + ' '+ lScore+ ' ' + rScore;
    //canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canv.width,canv.height);
    drawNet();
    //left paddle
    colorRect(1,lPadY,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

    //right paddle
    colorRect(canv.width-PADDLE_THICKNESS-1,rPadY,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

    //ball
    ctx.beginPath();
    ctx.arc(ballX,ballY,10,0,2*Math.PI, false);
    ctx.fillStyle="lime";
    ctx.fill();
    ctx.lineWidth = 0;
    ctx.stroke();
    ctx.fillText(lScore,170,200);
    ctx.fillText(rScore,canv.width-170,200);
}

function colorRect(x,y,w,h,c){
    ctx.fillStyle = c;
    ctx.fillRect(x,y,w,h);
}
