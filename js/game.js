window.onload = function () {
  const canvas = document.querySelector('.game'),
      ctx = canvas.getContext('2d'),
      gridSize = 20,
      scoreContainer = document.querySelector('.score');

  let velocityX = 0,
      velocityY = 0,
      playerX = 10,
      playerY = 10,
      appleX = 15,
      appleY = 15, // initials
      trail = [],
      tail = 5,
      score = 0;
  
  // effects
  
  function triggerEffect(ex,ey) {
    console.log(ex, ey);
    //get acutal offset
    const offset = {
      x: canvas.getBoundingClientRect().left + (ex * gridSize+10),
      y: canvas.getBoundingClientRect().top + (ey * gridSize+10)
    }

    const burst = new mojs.Burst({
      left: offset.x, top: offset.y,
      radius:   { 20 : 35 },
      angle:    0,
      count: 8,
      children: {
        shape:        'line',
        radius:       10,
        scale:        1,
        stroke:       '#ff9900',
        strokeDasharray: '100%',
        strokeDashoffset: { '-100%' : '100%' },
        duration:     700,
        easing:       'quad.out',
      }
    });
    burst.replay();
  }
  

  window.addEventListener('keydown', keyPress);
  let gameLoop = setInterval(game, 1000/10);
  
  function lose () {
    clearInterval(gameLoop);
    scoreContainer.innerHTML = `<p>Your Score was ${score}`;
  }
  
  function game() {
    scoreContainer.innerHTML = `SCORE: ${score}`;
    // set velocity 
    playerX += velocityX;
    playerY += velocityY;

    if (playerX >= gridSize || playerX < 0 || playerY >= gridSize || playerY < 0) {
      // playerX = 0;
      lose();      
    }
    
    // clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    // draw apple 
    ctx.fillStyle = '#ff9900';
    ctx.fillRect(appleX*gridSize, appleY*gridSize, gridSize-2, gridSize-2);
    
    ctx.fillStyle = '#ff0099';
    for (let i = 0; i<trail.length; i++) {
      ctx.fillRect(trail[i].x*gridSize, trail[i].y*gridSize, gridSize-2, gridSize-2);
      if(trail[i].x === playerX && trail[i].y === playerY && score>0) {
        lose();
      }
    }
    
    trail.push({x:playerX,y:playerY});
    
    while(trail.length>tail) {
      trail.shift();
    }
    
    if (appleX === playerX && appleY === playerY) {
      tail++;
      score++;
      triggerEffect(appleX, appleY);
      appleX = Math.floor(Math.random() * gridSize);
      appleY = Math.floor(Math.random() * gridSize);
    }
    

  }

  function keyPress(e) {
    switch (e.keyCode) {
      // left
      case 37:
        velocityX = -1;
        velocityY = 0;
        break;
      // right
      case 39:
        velocityX = 1;
        velocityY = 0;
        break;

      case 38:
        velocityX = 0;
        velocityY = -1;
        break;

      case 40:
        velocityX = 0;
        velocityY = 1;
        break;
    }
  } 
}