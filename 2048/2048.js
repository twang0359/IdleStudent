var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // creates a <div></div> tag
            let tile = document.createElement("div");
           
            // set coordinates that correlative to board ie <div id="0-0"></div>
            tile.id = r.toString() + "-" + c.toString();

            // get num on board 
            let num = board[r][c];

            // applies changes based on tile num
            updateTile(tile, num);

            //adds tile div tag to board ie fills board with tiles
            document.getElementById("board").append(tile);
        }
    }

    //creates two tile to start game
    setTwo();
    setTwo();
}

//return true if empty tile
function hasEmptyTile(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 0){
                return true;
            }
        }
    }
}

// if there's an open tile after movement then this func is called
function setTwo(){
    if(!hasEmptyTile()){
        return;
    }

    let found = false;
    while(!found){
        //random r, c
        let r = Math.floor(Math.random() * rows); //Math.random -> between (0,1) * 4 -> (0, 4), Math.floor round down
        let c = Math.floor(Math.random() * columns);

        if(board[r][c] == 0){
           board[r][c] = 2;
           let tile = document.getElementById(r.toString() + "-" + c.toString()); 
           tile.innerText = "2";
           tile.classList.add("x2");
           found = true;
        }
    }
}

function updateTile(tile, num){
    // clear tile after we slide
    tile.innerText = "";

    // clear classList, don't want a tile to keep old class name
    tile.classList.value = "";

    // add tile back ie empty tile
    tile.classList.add("tile");

    // changes class based on number; keep the css
    if(num > 0){
        tile.innerText = num.toString();
        if(num <= 4096){
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }

}

// what is an event listener??
document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft"){
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight"){
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp"){
        slideUp();
        setTwo();
    }
    else if(e.code == "ArrowDown"){
        slideDown();
        setTwo();
    }

    document.getElementById("score").innerText = score;
})

function filterZero(row) {
    return row.filter(num => num != 0); // create a new array without zeroes
}

function slide(row) {
    //[0, 2, 2, 2]
    row = filterZero(row); // get rid of zeroes -> [2, 2, 2]

    //slide
    for(let i = 0; i < row.length - 1; i++){
        //check every 2
        if(row[i] == row[i + 1]){
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        } // [2, 2, 2] -> [4,0,2]
    }

    row = filterZero(row); //[4, 2]

    //add back zeroes
    while (row.length < columns){
        row.push(0);
    } // [4, 2, 0,0]

    return row;
}

function slideLeft(){
    for(let r = 0; r < rows; r++){
        let row = board[r];
        row = slide(row);
        board[r] = row;

        // Update html
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// pretty much same as left but in reverse hence the reason i reversed array in function
function slideRight(){
    for(let r = 0; r < rows; r++){
        let row = board[r]; // [2, 2, 2, 0]
        row.reverse(); // [0, 2, 2, 2]
        row = slide(row); // if i go slideLeft [4, 2, 0, 0]
        row.reverse(); // reverse arr -> [0, 0, 2, 4] -> looks like if i slid right
        board[r] = row; 

        // Update rows and columns from html
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

//the idea to treat column as a row and then slideUp -> slideLeft
function slideUp(){
    for(let c = 0; c < columns; c++){
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row)
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        // Update rows and columns from html
        for(let r = 0; r < rows; r++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

//the idea to treat column as a row and then slideDown -> slideRight
function slideDown(){
    for(let c = 0; c < columns; c++){
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row)
        row.reverse();

        // Update rows and columns from html
        for(let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}