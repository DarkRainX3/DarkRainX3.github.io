canv = document.getElementById("gameCanvas");
ctx = canv.getContext("2d");
var speed = 500;
var gameOver = false;
var score = 0;
const SQ = 20;
const ROW = 20;
const COL = 10;
const VACANT = "grey";
const O = [[[0, 0, 0, 0],[0, 1, 1, 0],[0, 1, 1, 0],[0, 0, 0, 0]]];
const I = [[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]];
const L = [[[0, 0, 1],[1, 1, 1],[0, 0, 0]],[[0, 1, 0],[0, 1, 0],[0, 1, 1]],[[0, 0, 0],[1, 1, 1],[1, 0, 0]],[[1, 1, 0],[0, 1, 0],[0, 1, 0]]];
const S = [[[0, 1, 1],[1, 1, 0],[0, 0, 0]],[[0, 1, 0],[0, 1, 1],[0, 0, 1]],[[0, 0, 0],[0, 1, 1],[1, 1, 0]],[[1, 0, 0],[1, 1, 0],[0, 1, 0]]];
const T = [[[0, 1, 0],[1, 1, 1],[0, 0, 0]],[[0, 1, 0],[0, 1, 1],[0, 1, 0]],[[0, 0, 0],[1, 1, 1],[0, 1, 0]],[[0, 1, 0],[1, 1, 0],[0, 1, 0]]];
const Z = [[[1,1,0],[0,1,1],[0,0,0]],[[0,0,1],[0,1,1],[0,1,0]],[[0,0,0],[1,1,0],[0,1,1]],[[0,1,0],[1,1,0],[1,0,0]]];
const J = [[[1,0,0],[1,1,1],[0,0,0]],[[0,1,1],[0,1,0],[0,1,0]],[[0,0,0],[1,1,1],[0,0,1]],[[0,1,0],[0,1,0],[1,1,0]]];
const PIECES = [[Z,"red"],[S,"green"],[T,"cyan"],[O,"indigo"],[L,"blue"],[I,"purple"],[J,"orange"]];
var scoreOut = document.getElementById('score');
scoreOut.textContent = " Score: "+  score;
let board = [];
for (var r = 0; r<ROW; r++){
    board [r]= [];
    for (var c = 0; c<COL; c++){
        board[r][c]=VACANT;
    }
}
drawBoard();
window.onload = function() {
    ctx.strokeStyle = "white";
    ctx.strokeRect(0,0,200,400);
    document.addEventListener("keydown",keyPush);
}

let p = randomPiece();

function randomPiece() {
    var r = Math.floor(Math.random()*PIECES.length);
    return new Piece (PIECES[r][0],PIECES[r][1]);
}

function Piece(tet, color){
    this.tet = tet;
    this.tetN=0;
    this.activeTet = this.tet[this.tetN];
    this.color=color;
    this.x = 3;
    this.y = -1;
}

Piece.prototype.draw = function () {
    for (var r = 0; r<this.activeTet.length; r++){
        for (var c = 0; c<this.activeTet.length; c++){
            if(this.activeTet[r][c]){
                drawSquare(this.x+c,this.y+r,this.color);
            }
        }
    }
}

Piece.prototype.unDraw = function () {
    for (var r = 0; r<this.activeTet.length; r++){
        for (var c = 0; c<this.activeTet.length; c++){
            if(this.activeTet[r][c]){
                drawSquare(this.x+c,this.y+r,VACANT);
            }
        }
    }
}

Piece.prototype.moveDown = function () {
    if(!this.collision(0,1,this.activeTet)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        this.lock();
        p = randomPiece();
    }
}

Piece.prototype.moveRight = function () {
    if(!this.collision(1,0,this.activeTet)){
        this.unDraw();
        this.x++;
        this.draw();
    }

}

Piece.prototype.moveLeft = function () {
    if(!this.collision(-1,0,this.activeTet)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.rotate = function (dir) {
    let kick = 0;
    if(this.collision(0,0,this.tet[(this.tetN+dir+40)%this.tet.length])){
        if (this.x >COL/2){
            kick = -1;
        }
        else {
            kick = 1;
        }
    }
    if(!this.collision(kick,0,this.tet[(this.tetN+dir+40)%this.tet.length])){
        this.unDraw();
        this.x+=kick;
        this.tetN = (this.tetN+1)%this.tet.length;
        this.activeTet = this.tet[this.tetN];
        this.draw();
    }
}

Piece.prototype.collision = function (x,y,piece) {
    for (var r = 0; r<piece.length; r++){
        for (var c = 0; c<piece.length; c++){
            if(!piece[r][c]){
                continue;
            }
            let xx = this.x+c+x;
            let yy = this.y+r+y;
            if (xx<0 || xx >COL || yy >= ROW){
                return true;
            }
            if (yy < 0 ){
                continue;
            }
            if (board[yy][xx] != VACANT){
                return true;
            }
        }
    }
    return false;
}

Piece.prototype.lock = function () {
    for (var r = 0; r<this.activeTet.length; r++){
        for (var c = 0; c<this.activeTet.length; c++){
            if(!this.activeTet[r][c]){
                continue;
            }
            if(this.y+r<=0){
                alert("GGGGGGGGGGGG");
                drawBoard();
                gameOver=true;
                break;
            }
            board[this.y+r][this.x+c]=this.color;
        }
    }
    for (r = 0; r<ROW; r++){
        let isFull = true;
        for (c = 0; c<COL; c++){
            isFull = isFull && (board[r][c] != VACANT);
        }
        if (isFull){
            for(y = r; y>1; y--){
                for (c = 0; c<COL; c++){
                    board[y][c]=board[y-1][c];
                }
            }
            for (c = 0; c<COL; c++){
                board[0][c]=VACANT;
            }
            score +=10;
            scoreOut.textContent = " Score: "+  score;
            if (score%50==0){
                speed -=100;
            }
            drawBoard();
        }
    }
}

let dropStart = Date.now();
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta>speed){
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver){
        requestAnimationFrame(drop);
        ctx.strokeStyle = "white";
        ctx.strokeRect(0,0,200,400);
    }
}

drop();

function drawPiece(piece,color){
    for (var r = 0; r<piece.length; r++){
        for (var c = 0; c<piece.length; c++){
            if(piece[r][c]){
                drawSquare(c,r,color);
            }
        }
    }
}

function drawBoard(){
    for (var r = 0; r<ROW; r++){
        for (var c = 0; c<COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

function drawSquare(x,y,color){
    ctx.fillStyle=color;
    ctx.fillRect(x*SQ,y*SQ,19,19);
    ctx.strokeStyle="black";
    ctx.strokeRect(x*SQ,y*SQ,19,19);
}

function keyPush(e) {
    if (e.keyCode==37){
        p.moveLeft();
    }
    else if (e.keyCode==38||e.keyCode==88){
        p.rotate(1);
    }
    else if (e.keyCode==90||e.keyCode==17){
        p.rotate(-1);
    }
    else if (e.keyCode==39){
        p.moveRight();
    }
    else if (e.keyCode==40){
        p.moveDown();
    }
    else if (e.keyCode==32){
        // for(i=0; i<20; i++){
        //     if (p.collision(0,1,p.activeTet)){
        //         break;
        //     }
        //     p.moveDown();
        // }
        while(!p.collision(0,1,p.activeTet)){
            p.unDraw();
            p.y++;
            p.draw();
        }
        p.lock();
        p = randomPiece();

    }
}
