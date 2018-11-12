window.onload = function() {
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");    //makes obj that has methods for drawing
    // on canvas, "2d" has various shapes
    document.addEventListener("keydown",keyPush);
    //interval = setInterval(game,1000/speed);
    setTimeout(game,200);
    var speedout = document.getElementById('speed');
}
var speed = 5;  //snake speed
xv = yv = 0;    // x,y velocity
px=py=10;   //player position
gs = 20;   //gridsize
tc = 20;    //tile count
ax = Math.floor(Math.random()*tc); // first food
ay = Math.floor(Math.random()*tc);
trail = []; //snake position
tail = 3;   //lenght of snake
var score = 0;
function game() {
    setTimeout(game,1000/speed);
    px+=xv;
    py+=yv;
    if(px<0) {
        px=tc-1;
    }
    if(px>tc-1) {
        px = 0;
    }
    if(py<0) {
        py=tc-1;
    }
    if(py>tc-1) {
        py = 0;
    }
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);

    ctx.fillStyle="teal";
    for (var i = 1; i<trail.length; i++) {
        ctx.fillRect(trail[i].x*gs-1,trail[i].y*gs-1,gs,gs);
        if(trail[i].x==px && trail[i].y==py){
            tail = 3;
            speed = 5;
            score=xv=yv=0;
            speedout.textContent = "Speed: "+(speed-5)+ " Score: "+  score;
            // clearInterval(interval)
            // interval = setInterval(game,1000/speed);
        }
    }
    ctx.beginPath();
    ctx.arc(px*gs+9,py*gs+9,10,0,2*Math.PI, false);
    ctx.fillStyle="lime";
    ctx.fill();
    ctx.lineWidth = 0;
    ctx.stroke();
    trail.push({x:px,y:py});
    while(trail.length>tail){
        trail.shift();
    }
    if (ax==px && ay==py) {
        tail++;
        if (speed<=10)
            speed++;
        else
            speed+=0.5;
        score++;
        //setTimeout(game,speed);
        // clearInterval(interval)
        // interval = setInterval(game,1000/speed);
        speedout.textContent = "Speed: "+(speed-5)+ " Score: "+  score;
        tempx = Math.floor(Math.random()*tc);
        tempy = Math.floor(Math.random()*tc);
        while (checkPos(tempx,tempy)==true){
            tempx = Math.floor(Math.random()*tc);
            tempy = Math.floor(Math.random()*tc);
        }
        ax=tempx;
        ay=tempy;
    }

    ctx.beginPath();
    ctx.arc(ax*gs+9,ay*gs+9,10,0,2*Math.PI, false);
    ctx.fillStyle="red";
    ctx.fill();
    ctx.stroke();
    //ctx.fillRect(ax*gs,ay*gs,gs-2,gs-2);
}
function checkPos(x,y) {
    for (var i = 0; i<trail.length; i++){
        if (trail[i].x==x && trail[i].y==y)
            return true;
    }
    return false;
}
function keyPush(e) {
    if (e.keyCode==37){
        if(xv==1)
            return;
        xv=-1;yv=0;
            return;
    }
    else if (e.keyCode==38){
        if(yv==1)
            return;
        xv=0;yv=-1;
            return;
    }
    else if (e.keyCode==39){
        if(xv==-1)
            return;
        xv=1;yv=0;
            return;
    }
    else if (e.keyCode==40){
        if(yv==-1)
            return;
        xv=0;yv=1;
            return;
    }
  // switch(e.keyCode) {
  //   case 37:
  //       if(xv==1)
  //           break;
  //       xv=-1;yv=0;
  //       break;
  //   case 38:
  //       if(yv==1)
  //           break;
  //       xv=0;yv=-1;
  //       break;
  //   case 39:
  //       if(xv==-1)
  //           break;
  //       xv=1;yv=0;
  //       break;
  //   case 40:
  //       if(yv==-1)
  //           break;
  //       xv=0;yv=1;
  //       break;
  // }
}
