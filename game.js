document.addEventListener("keydown", keyDownHandler, false);


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
const interval = setInterval(gameEngine, 50);


const snakeHeight = 10;

const directions = {
    Up: {dx: 0, dy: -1},
    Down: {dx: 0, dy: 1},
    Left: {dx: -1, dy: 0},
    Right: {dx: 1, dy: 0}
};

const cols = canvas.width / snakeHeight;
const rows = canvas.height / snakeHeight;

const centerX = cols / 2;
const centerY = rows / 2;

let snake = {
    parts: [{
       x: centerX,
       y: centerY,
       d: directions.Right
    },{
        x: centerX - 1,
        y: centerY,
        d: directions.Right
    },{
        x: centerX - 2,
        y: centerY,
        d: directions.Right
    }]
}

let food = {
    active: false,
    x: 0,
    y: 0,
}

let score = 0;

let moveLock = false;

function moveSnake(){
    const l = snake.parts.length;


    for(let i = l - 1; i >= 0; i--){
        
        

        if(i != l - 1){snake.parts[i + 1].d = snake.parts[i].d;}
        snake.parts[i].x += snake.parts[i].d.dx;
        snake.parts[i].y += snake.parts[i].d.dy;

        /*
        Horizontal walls collition detection
        */
        if(snake.parts[i].x == cols){
            snake.parts[i].x = 0;
        }else if(snake.parts[i].x == -1){
            snake.parts[i].x = cols - 1;
        }

        /*
        Vertical walls collition detection
        */
        if(snake.parts[i].y == rows){
            snake.parts[i].y = 0;
        }else if(snake.parts[i].y == -1){
            snake.parts[i].y = rows - 1;
        }

    }

    moveLock = false;

}

function snakeCollition(){

    const head = snake.parts[0];
    const l = snake.parts.length;

    for(let i = 1; i < l; i++){
        if(head.x == snake.parts[i].x && head.y == snake.parts[i].y){return true;}
    }

    return false;

}

function snakeEat(){
    const snakeHead = snake.parts[0];

    if(snakeHead.x === food.x && snakeHead.y === food.y){
        const lastPart = snake.parts[snake.parts.length - 1];
        const newPart = {
            x: lastPart.x - lastPart.d.dx,
            y: lastPart.y - lastPart.d.dy,
            d: lastPart.d
        }
        snake.parts.push(newPart);
        food.active = false;

        updateScore();
    }
}


function drawSnake(){
    
    for (let i = 0; i < snake.parts.length; i++){
        const part = snake.parts[i];
        ctx.beginPath();
        ctx.rect(part.x * snakeHeight, part.y * snakeHeight, snakeHeight, snakeHeight);
        ctx.fillStyle = "#5C5470";
        ctx.fill();
        ctx.closePath();
    }

}

function drawFood(){
    if(!food.active){

        const rc = Math.floor(Math.random() * cols);
        const rr = Math.floor(Math.random() * rows);

        food.x = rc;
        food.y = rr;
        food.active = true;
    }

    ctx.beginPath();
    ctx.rect(food.x * snakeHeight, food.y * snakeHeight, snakeHeight, snakeHeight);
    ctx.fillStyle = "#910A67";
    ctx.fill();
    ctx.closePath();
}

function updateScore(){
    score += 1;
    document.getElementById('score').innerHTML = score;
}

function gameEngine(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    moveSnake();
    drawSnake();
    snakeEat();
    drawFood();snakeEat();
    
    if(snakeCollition()){
        alert("GAME OVER");
        clearInterval(interval);
        document.location.reload();
    }
}

function keyDownHandler(e){
    const dir = snake.parts[0].d;

    if((e.key === "ArrowRight" || e.key === "ArrowLeft") &&
       (dir == directions.Up || dir == directions.Down) && !moveLock){

        if(e.key === "ArrowRight") {snake.parts[0].d = directions.Right;}
        if(e.key === "ArrowLeft") {snake.parts[0].d = directions.Left;}
        
        moveLock = true;

    } else if((e.key === "ArrowUp" || e.key === "ArrowDown") &&
              (dir == directions.Right || dir == directions.Left) && !moveLock){

        if(e.key === "ArrowUp") {snake.parts[0].d = directions.Up;}
        if(e.key === "ArrowDown") {snake.parts[0].d = directions.Down;}

        moveLock = true;

    }
    
} 

