document.addEventListener("DOMContentLoaded", function() {
    let Player = 'X';
    let p1Scores = 0;
    let p2Scores = 0;
    let gameRunning = false;
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 4, 6]
    ];

    const resultsDisplay = document.getElementById("resultsDisplayed");
    let mode = 'PVP';

    function switchPlayer() {
        Player = Player === 'X' ? 'O' : 'X';
    }

    function updateCell(cell, index) {
        gameBoard[index] = Player;
        cell.textContent = Player;
    }

    function cellClicks() {
        const cellsIndex = this.getAttribute("data-index");
        if (gameBoard[cellsIndex] !== '' || !gameRunning) {
            return;
        }
        updateCell(this, cellsIndex);

        const winner = Winner();

        if (winner) {
            if (winner === 'X') {
                p1Scores++;
            } else if (winner === 'O') {
                p2Scores++;
            }
            resultsDisplay.textContent = `${winner} wins`;
            resultsDisplay.style.display = 'block'; // Show results text
            gameRunning = false;
            turnIndicator();

        } else if (!gameBoard.includes("")) { // Handle draw scenario
            resultsDisplay.textContent = "DRAW";
            resultsDisplay.style.display = 'block'; // Show results text
            gameRunning = false;

        } else {
            switchPlayer();
            turnIndicator();
        }
    }

    function startGame() {
        gameRunning = true;
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        resultsDisplay.textContent = ""; 

        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', cellClicks);
            cell.textContent = ''; 
        });

        turnIndicator();
    }

    function Winner() {

        for (let i = 0; i < winningConditions.length; i++) {
            const WinningCombo = winningConditions[i];

            const a = gameBoard[WinningCombo[0]];
            const b = gameBoard[WinningCombo[1]];
            const c = gameBoard[WinningCombo[2]];
    
            if (a !== '' && a === b && b === c) {
                gameRunning = false;
                return Player; // Return the current player as the winner
            }
        }
        return null;
    }
    

    function restartButon() {
        Player = 'X';
        gameRunning = true;
        gameBoard = ['', '', '', '', '', '', '', '', ''];

        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = ''; // Clear each cell
        });
        
        resultsDisplay.textContent = ""; // Clear results display
        resultsDisplay.style.display = 'none'; // Hide results text
        turnIndicator();
    }

    function turnIndicator() {
        const p1Container = document.getElementById('P1');
        const p2Container = document.getElementById('P2');

        p1Container.textContent = `P1 (X): ${p1Scores}`;
        p2Container.textContent = `P2 (O): ${p2Scores}`;

        if (Player === 'X') {
            p1Container.classList.add('active');
            p2Container.classList.remove('active');
        } else {
            p2Container.classList.add('active');
            p1Container.classList.remove('active');
        }

        if(mode === 'AI' && Player === 'O' && gameRunning){
            //delays ai making a move by a second
            setTimeout(AI,1000);
        }
    }

    function AI(){
        let emptyIndexs = [];//empty cells
        for(let i = 0; i < gameBoard.length; i++){
            if(gameBoard[i] === ''){
                emptyIndexs.push(i);
            }
        }

        if(emptyIndexs.length > 0){
            const randomIndex = emptyIndexs[Math.floor(Math.random() * emptyIndexs.length)];
            const index = document.querySelector(`.cell[data-index = "${randomIndex}"]`);
            updateCell(index, randomIndex);

            const winner = Winner();
            if (winner) {
                if (winner === 'X') {
                    p1Scores++;
                } else if (winner === 'O') {
                    p2Scores++;
                }
                resultsDisplay.textContent = `${winner} wins`;
                resultsDisplay.style.display = 'block'; // Show results text
                gameRunning = false;
               
            } else if (!gameBoard.includes("")) { 
                resultsDisplay.textContent = "DRAW";
                resultsDisplay.style.display = 'block'; // Show results text
                gameRunning = false;
    
            } else {
                switchPlayer();
                turnIndicator();
            }
        }
    }

    function changeMode(){
        mode = mode === 'PVP' ? 'AI' : 'PVP';
        //Adds text to show which mode ur in
        document.getElementById('modeChange').textContent = `Mode:${mode}`;
        restartButon();
    }
    document.getElementById('modeChange').addEventListener('click', changeMode);
    document.getElementById('restartGame').addEventListener('click', restartButon);
    startGame();
});
