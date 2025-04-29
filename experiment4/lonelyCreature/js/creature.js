let creatures = [{ x: 0, y: 0 }];
let enemies = [];

function moveCreatures() {
  for (let creature of creatures) {
    let moves = [];
    if (isTileMoveable(creature.x + 1, creature.y)) {
      moves.push([1, 0]); // Right
    }
    if (isTileMoveable(creature.x - 1, creature.y)) {
      moves.push([-1, 0]); // Left
    }
    if (isTileMoveable(creature.x, creature.y + 1)) {
      moves.push([0, 1]); // Down
    }
    if (isTileMoveable(creature.x, creature.y - 1)) {
      moves.push([0, -1]); // Up
    }

    if (moves.length > 0) {
      let target = random(moves);
      creature.x += target[0];
      creature.y += target[1];

      // Check if the creature collided with an enemy
      for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        if (creature.x === enemy.x && creature.y === enemy.y) {
          creatures.push({ x: enemy.x, y: enemy.y }); // Add the enemy as a new creature
          enemies.splice(i, 1); // Remove the enemy
        }
      }
    }
  }
}

function drawCreature(creature) {
  push();
  //translate(creature.x, creature.y);

  noStroke();

  let t = (sin(frameCount * 0.02) + 1) / 2;
  let color1 = color(0, 100, 255); //
  let color2 = color(100, 149, 237); // Cornflower blue
  let currentColor = lerpColor(color1, color2, t);

  let coreSize = 15 + 2 * sin(frameCount * 0.02);
  fill(currentColor);
  ellipse(0, 0, coreSize, coreSize);

  pop();
}

function isTileMoveable(i, j) {
  let n = clicks[[i, j]] || 0;

  let hashIsEven = XXH.h32("tile:" + [i, j], worldSeed) % 2 === 0;

  if (hashIsEven) {
    return n % 2 === 1;
  } else {
    return n % 2 === 0;
  }
}

// --- Enemy Logic ---

function spawnEnemy() {
  let enemyX = floor(random(-10, 10));
  let enemyY = floor(random(-10, 10));
  //dont let creauteres spawn on the enemy
  for (let creature of creatures) {
    if (enemyX === creature.x && enemyY === creature.y) {
      return spawnEnemy();
    }
  }

  enemies.push({ x: enemyX, y: enemyY });
}

function moveEnemies() {
  for (let enemy of enemies) {
    let directions = [
      [1, 0], 
      [-1, 0], 
      [0, 1],
      [0, -1],
    ];

    let randomMove = random(directions);

    for (let creature of creatures) {
      if (creature.x === newX && creature.y === newY) {
        // Convert the enemy into a creature
        creatures.push({ x: enemy.x, y: enemy.y });
        enemies.splice(i, 1); 
        return; 
      }
    }
    enemy.x += randomMove[0];
    enemy.y += randomMove[1];
  }
}

function drawEnemy(enemy) {
  push();
  //translate(enemy.x , enemy.y * th);
  noStroke();
  fill(255, 50, 50);
  ellipse(0, 0, 10, 10);
  pop();
}
