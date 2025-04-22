/* exported generateGrid, drawGrid */
/* global placeTile */
let smoked=false
function generateDungeonRoom(grid, numRows, numCols) {
    let roomWidth = random(4, 8) | 0;
    let roomHeight = random(4, 8) | 0;
    let roomX = random(0, numCols - roomWidth) | 0;
    let roomY = random(0, numRows - roomHeight) | 0;
    let hasChest = random(0, 1) | 0;

    for (let i = roomY; i < roomY + roomHeight; i++) {
        for (let j = roomX; j < roomX + roomWidth; j++) {
            grid[i][j] = ".";
            if (hasChest = true && random(0, 1) | 0) {
                placeTile(i, j, 2, 30);
                hasChest = false;
            }
        }
    }

}

function generateHallway(grid, numRows, numCols) {
    //from one side of the screen to the other
    //get a direction 
    let hallWayDirection = random(['east', 'west', 'north', 'south']);
    //Get the width and length of the hallway
    let hallWayWidth = random(2, 4) | 0;
    let hallWayLength = random(8, 20) | 0;

    //get the starting point of the hallway
    let hallWayX;
    let hallWayY;
    switch (hallWayDirection) {
        case 'north':
            hallWayX = random(0, numCols - 1 - hallWayWidth) | 0;
            hallWayY = numCols - 1;
            break;
        case 'south':
            hallWayX = random(0, numCols - 1 - hallWayWidth) | 0;
            hallWayY = 0;
            break;
        case 'east':
            hallWayX = numRows - 1;
            hallWayY = random(0, numRows - 1 - hallWayWidth) | 0;
            break;
        case 'west':
            hallWayX = 0;
            hallWayY = random(0, numRows - 1 - hallWayWidth) | 0;
            break;

    }

    //draw the hallway
    switch (hallWayDirection) {
        case 'north':
            for (let i = hallWayY; i > hallWayY - hallWayLength; i--) {
                for (let j = hallWayX; j < hallWayX + hallWayWidth; j++) {
                    grid[i][j] = ".";
                }
            }
            break;
        case 'south':
            for (let i = hallWayY; i < hallWayY + hallWayLength; i++) {
                for (let j = hallWayX; j < hallWayX + hallWayWidth; j++) {
                    grid[i][j] = ".";
                }
            }
            break;
        case 'east':
            for (let i = hallWayX; i > hallWayX - hallWayLength; i--) {
                for (let j = hallWayY; j < hallWayY + hallWayWidth; j++) {
                    grid[j][i] = ".";
                }
            }
            break;
        case 'west':
            for (let i = hallWayX; i < hallWayX + hallWayLength; i++) {
                for (let j = hallWayY; j < hallWayY + hallWayWidth; j++) {
                    grid[j][i] = ".";
                }
            }
            break;
    }



}

function dungeonGenerateGrid(numCols, numRows) {
    let grid = [];

    //Rectangluar room bounds
    //let dungeonX=5
    for (let i = 0; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < numCols; j++) {
            row.push("_");
        }
        grid.push(row);
    }
    for (let i = 0; i < random(8, 12); i++) {
        generateDungeonRoom(grid, numRows, numCols);
    }
    for (let i = 0; i < random(3, 6); i++) {
        generateHallway(grid, numRows, numCols);
    }
    return grid;
}

function drawDungeonGrid(grid) {
    
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // Check if the current cell is a river or forest tile
            // and draw the appropriate tile
            if (gridCheck(grid, i, j, "_")) {
                placeTile(i, j, 0, 21);
            } else if (gridCheck(grid, i, j, ".")) {
                dungeonDrawContext(grid, i, j, ".", 0, 0);
            }
        }
    }
    smoke();

}

function smoke() {
    let noiseLevel = 255;
    let noiseScale = 0.009;

    // Iterate from top to bottom.
    for (let y = 0; y < numCols*16; y += 1) {
        // Iterate from left to right.
        for (let x = 0; x < numRows*16 ; x += 1) {
            // Scale the input coordinates.
            let nx = noiseScale * x;
            let ny = noiseScale * y;
            let nt = noiseScale * frameCount;

            // Compute the noise value.
            let c = noiseLevel * noise(nx, ny, nt);

            // Draw the point.
            
            stroke(c,200)
            point(x, y);
        }
    }
}

const dungeonLookup = [
    [[0, 0]], //0
    [
        [4, 1],
        [5, 2],
        [6, 1],
    ], //1 done
    [
        [5, 2],
        [6, 1],
        [5, 0],
    ], //2 done
    [
        [27, 23],
    ], //3 
    [
        [5, 2],
    ], //4 done
    [[25, 23]], //5 )
    [
        [10, 2],
        [5, 0],
    ], //6 done
    [[26, 23]], //7 
    [
        [9, 1],
        [11, 1],
        [5, 0],
    ], //8 done(ish)
    [
        [4, 1],
        [6, 1],
    ], //9
    [[27, 21]], //10 
    [[27, 22]], //11 
    [[25, 21]], //12 
    [[25, 22]], //13 
    [[26, 21]], //14 
    [[10, 1]], //15 done
]



function dungeonDrawContext(grid, i, j, target, ti, tj) {
    //Get the code for this location and target.
    //Use the code as an array index to get a pair of tile offset numbers.
    //const [tiOffset, tjOffset] = dungeonLookup[code]; placeTile(i, j, ti + tiOffset, tj + tjOffset);
    let binary = gridCode(grid, i, j, target);

    for (let x = 0; x < dungeonLookup[binary].length; x++) {
        let t = dungeonLookup[binary][x];
        //place random floor tile
        placeTile(i, j, random(11, 14), random([21, 23, 24]));
        //place random chest
        if (random(0, 1) > 0.98 && binary == 15) {
            placeTile(i, j, random([0, 1, 2]), 30);
        }

        //Place autolitlling border tiles
        placeTile(i, j, t[0], t[1]);
        //place random door 
        if (random(0, 1) > 0.9 && binary == 14) {
            placeTile(i, j, random([25, 26]), random([25, 26]));
        }
    }


}


