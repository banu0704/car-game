const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameAreaRoad = document.querySelector('.gameAreaRoad');
const music = new Audio('music.mp3');

let player = {
    speed: 5,
    score: 0
} 
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

document.addEventListener('keydown', (e)=> {   
    e.preventDefault();
    keys[e.key] = true; 
    // console.log(e.key);
    // console.log(keys);
});
document.addEventListener('keyup', (e)=> {   
    e.preventDefault();
    keys[e.key] = false; 
    // console.log(e.key);
    // console.log(keys);
});
function isCollide(a,b){ // a is car, b is enemy car
    aRect = a.getBoundingClientRect(); // gives the dimensions of car
    bRect = b.getBoundingClientRect(); // givrs the dimensions of enemyCar
   // console.log(aRect);
   // console.log(bRect);
    return!(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right))
};
// ---------------- to move lines ------------------------
function moveLines(){
    let lines = document.querySelectorAll('.lines');
    lines.forEach(function(item){
        if(item.y >= 700){
            item.y -= 750;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    })
};
function endGame(){
    music.pause();
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game Over <br> Your final score is " + player.score + "<br> Press here to restart the Game"
}
// ------------------- to move cars ---------------------
function moveEnemyCars(car){
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach((item)=>{
        if(isCollide(car, item)){
            endGame();
        }
        if(item.y >= 700){
            item.y = -300;
            item.style.left = Math.floor(Math.random()*350) + "px";
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    })
};
function playGame(){ 
    // console.log("Hey I clicked");
    let car = document.querySelector('.car');
    let road = gameAreaRoad.getBoundingClientRect(); //gives the dimensions of road
    // console.log(road);

    if(player.start){  // if player started the game
        moveLines();
        moveEnemyCars(car);
        music.play();
        
        if(keys.ArrowUp && player.y > road.top+70){ 
            player.y -= player.speed 
        };
        if(keys.ArrowDown && player.y < (road.bottom-70)){ 
            player.y += player.speed 
        };
        if(keys.ArrowLeft && player.x > 0){ 
            player.x -= player.speed 
        };
        if(keys.ArrowRight && player.x <(road.width-50)){
            player.x += player.speed 
        };

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        window.requestAnimationFrame(playGame);

        player.score++;
        let playerScore = player.score - 1;
        score.innerText = "Score: " + playerScore;
    }
};

startScreen.addEventListener('click', ()=>{
    startScreen.classList.add('hide'); 
  //  gameAreaRoad.classList.remove('hide');
    gameAreaRoad.innerHTML ="";

    player.start = true; 
    player.score = 0;
    window.requestAnimationFrame(playGame); 
    
    // ------------------car---------------------------
    let car = document.createElement('div');
    car.setAttribute('class', 'car');  
    gameAreaRoad.appendChild(car); 
    
    // ------------ multiple lines using for loop -------------------------
    for(let x=0; x<8; x++){
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'lines');
        roadLine.y = (x*150); //vertical direction 
        roadLine.style.top = roadLine.y + "px";
        gameAreaRoad.appendChild(roadLine);
    }

    // ---------------- multiple cars -------------------------
    for(let x=0; x<3; x++){
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemy');
        enemyCar.y = ((x+1)*350)*-1; // reduces the distance b/w 3rd and next coming 1st car 
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundColor = randomColor();
        enemyCar.style.left = Math.floor(Math.random()*350) + "px"; // gives some random position , the value is in 0. so we multiply 350 some random no
        gameAreaRoad.appendChild(enemyCar);
    }

    player.x = car.offsetLeft;
    player.y = car.offsetTop;
});
function randomColor(){
    function c(){
        let hex = Math.floor(Math.random()*256).toString(16);
        return ("0" + String(hex)).substr(-2);
    }
        return "#"+c()+c()+c();
}



