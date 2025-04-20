/* exported generateGrid, drawGrid */
/* global placeTile */



function generateRiver(grid, numRows, numCols) {
    let startRow = random(0, numRows) | 0;
    let startCol = random(0, numCols) | 0;
    let riverLength = random(100, 400);
    let riverWidth = random(3, 7);

    let row = startRow;
    let col = startCol;

    let direction = random(4) | 0;
    for (let i = 0; i < riverLength; i++) {
        // Mark the current cell as part of the river
        grid[row][col] = ".";

        //For the width of the river increase river sized based on direction
        for (let j = 0; j < riverWidth; j++) {
            if (row + j < grid.length - 1) {
                grid[row + j][col] = ".";
            }
        }

        //Random Chancto change direction
        if (random() > 0.5) {
            direction = random(4) | 0;
        }
        if (random() > 0.5) {
            riverWidth = random(3, 7);
        }

        if (direction === 0 && row > 0) {
            row--; //North
        } else if (direction === 1 && row < grid.length - 1) {
            row++; //South
        } else if (direction === 2 && col < grid[0].length - 1) {
            col++; //East
        } else if (direction === 3 && col > 0) {
            col--; //West
        }
    }
}

function generateForest(grid, numRows, numCols) {
    let centerRow = random(0, numRows) | 0;
    let centerCol = random(0, numCols) | 0;
    let radius = random(5, 12);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            // Calculate distance from the center
            let distance = Math.sqrt((i - centerRow) ** 2 + (j - centerCol) ** 2);
            distance += random(1, 5);
            if (distance <= radius) {
                grid[i][j] = "T";
            }
        }
    }
}

function generateGrid(numCols, numRows) {
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

    for (let i = 0; i < random(1, 4); i++) {
        generateForest(grid, numRows, numCols);
    }
    for (let i = 0; i < random(1, 2); i++) {
        generateRiver(grid, numRows, numCols);
    }

    return grid;
}

function drawGrid(grid) {

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // Check if the current cell is a river or forest tile
            // and draw the appropriate tile
            if (gridCheck(grid, i, j, "_")) {
                placeTile(i, j, random(4) | 0, 0);
            } else if (gridCheck(grid, i, j, "T")) {
                placeTile(i, j, random(4) | 0, 0);
                placeTile(i, j, 14, 0);
            } else if (gridCheck(grid, i, j, ".")) {
                overworldDrawContext(grid, i, j, ".", 0, 0);
            }
        }
    }
}

const lookup = [
    [[0, 0]], //0
    [
        [4, 1],
        [5, 2],
        [6, 1],
    ], //1
    [
        [5, 2],
        [6, 1],
        [5, 0],
    ], //2 done
    [
        [5, 2],
        [6, 1],
    ], //3 done
    [
        [10, 2],
        [5, 0],
        [4, 1],
    ], //4 done
    [[9, 2]], //5 (doneish)
    [
        [10, 2],
        [5, 0],
    ], //6 done
    [[10, 2]], //7 done
    [
        [9, 1],
        [11, 1],
        [5, 0],
    ], //8 done(ish)
    [
        [4, 1],
        [6, 1],
    ], //9
    [[11, 0]], //10 done
    [[11, 1]], //11 done
    [[9, 0]], //12 done
    [[9, 1]], //13 done
    [[10, 0]], //14 done
    [[10, 1]], //15 done
];

function gridCheck(grid, i, j, target) {
    // Check if i, j is within the grid boundaries
    if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
        return grid[i][j] === target; // Return true if grid[i][j] matches target
    }
    return false; // Out of bounds or no match
}

function gridCode(grid, i, j, target) {
    // Form a 4-bit code using gridCheck on the north/south/east/west
    //neighbors of i,j for the target code.
    //You might us an example like (northBit<<0)
    // +(southBit<<1)+(eastBit<<2)+(westBit<<3).
    //First check if there is a tile using gridCheck

    let code = 0;
    //North
    if (gridCheck(grid, i - 1, j, target)) {
        code += 1;
    }
    //West
    if (gridCheck(grid, i, j - 1, target)) {
        code += 2;
    }
    //East
    if (gridCheck(grid, i, j + 1, target)) {
        code += 4;
    }
    //South
    if (gridCheck(grid, i + 1, j, target)) {
        code += 8;
    }
    return code;
}

function overworldDrawContext(grid, i, j, target, ti, tj) {
    //Get the code for this location and target.
    //Use the code as an array index to get a pair of tile offset numbers.
    //const [tiOffset, tjOffset] = lookup[code]; placeTile(i, j, ti + tiOffset, tj + tjOffset);
    let binary = gridCode(grid, i, j, target);
    //let code = lookup[binary];

    //placeTile(i, j, code[0],code[1]);
    //const [tiOffset, tjOffset] = lookup[binary];
    let nL = random(0, 1);
    let nH = random(1, 2);
    let randomTile = random([1, 2, 3])
    let n = noise(nL, nH, frameCount * random(0.001, 0.005));
    if (n > 0.6) {

        //place special water
        /*
        if (randomTile == 1) {
            placeTile(i, j, 1, 13);
        }else if (randomTile == 2) {
            placeTile(i, j, 2, 13);
        } else if (randomTile == 3) {
            placeTile(i, j, 3, 13);
        }
        */
        placeTile(i, j, 2, 13);

    } else {
        //Place normal water tile
        placeTile(i, j, 0, 13);
    }


    for (let x = 0; x < lookup[binary].length; x++) {
        let t = lookup[binary][x];
        placeTile(i, j, t[0], t[1]);
    }

    
}


