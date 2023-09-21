// Gameboard object 
const Gameboard = (function() {
    let board = [];
    let rows = 3;
    let columns = 3;

   const createBoard = () => {
    for (let i =0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j< columns; j++) {
            board[i][j] = 0;
        }
    }
   } 

   //Update board with mark made on display
   const updateGameboard = function (square, weapon) {
    const [row, col] = square.id.match(/\d+/g).map(Number);
    board[row][col] = weapon;
   }

   createBoard();
    
// console.log(board);
    return {
      board,
      updateGameboard,
      createBoard
    }

})();


//Player Object 
function createPlayer(player, weapon) {
    // define properties
    const obj = {player, weapon};

    // define methods

    return obj;
}

//Display Controller
const DisplayController = (function() {

    const grid = document.querySelector('.gameboard');
    const rows = 3;
    const columns = 3;
    const winnerDisplay = document.querySelector('.winner-display');

    //Creates grid cells adds to display
    const createGrid = () => {
        for (row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const square = document.createElement('div');
                square.classList.add('square'); 
                square.id = `[${row}][${col}]`;
                grid.append(square);
            }
        }
    }

    createGrid();

   
    //Iterates through array and displays data to gameboard
    const renderBoard = function (board) {

        for (let i =0; i < rows; i++) {
            
            for (let j = 0; j< columns; j++) {
                if (board[i][j]) {
                    const square = document.getElementById(`[${i}][${j}]`);
                    square.innerHTML = board[i][j];
                }
            }
        }
    }

    //allow players to add marks to a specific spot on the board
    renderBoard(Gameboard.board);

    const squares = document.querySelectorAll('.square');

    squares.forEach(square => {
        square.addEventListener('click', event => {
            if (!square.innerHTML) {
                Game.playRound(square);
            }
            
        })
    })

   

    //Clear all marks from the display
    const clearDisplay = function () {
        squares.forEach(square => {
            square.innerHTML = '';
        })

        winnerDisplay.innerHTML = '';
    }



    //Display game winner 
    const displayWinner = (winner) => {
        winnerDisplay.innerHTML = winner.player;
        
    }

    //Display Tie
    const displayTie = () => {
        winnerDisplay.innerHTML = winner.player;
    }

    return {

        displayWinner, displayTie, clearDisplay

    }


})();


// Game Flow
const Game = (function() {

    let turn = 1;
    let winner; 
    let board = Gameboard.board;
    const player1 = createPlayer('p1', 'X');
    const player2 = createPlayer('p2', 'O');
    
    //If turn is odd, next mark is made by player one
    const playRound = function (square) {

        if (turn < 9) {
            if (turn % 2 != 0) {
                square.innerHTML = player1.weapon;
                Gameboard.updateGameboard(square, player1.weapon);
                isGameOver(board);
            } else if (turn % 2 == 0) {
                square.innerHTML = player2.weapon;
                Gameboard.updateGameboard(square, player2.weapon);
                isGameOver(board);
            }   
            turn++;

        } 

    }

    const isGameOver = (board) => {

        //Check top row
        if (board[0][0] == board[0][1] && board[0][0] == board[0][2] && board[0][0] != 0) {
            findWinner(board[0][0]);
        }

         //Check middle row
         if (board[1][0] == board[1][1] && board[1][0] == board[1][2] && board[1][0] != 0) {
            findWinner(board[1][0]);
        }

          //Check bottom row
          if (board[2][0] == board[2][1] && board[2][0] == board[2][2] && board[2][0] != 0) {
            findWinner(board[2][0]);
        }

         //Check diagonal 
         if (board[0][0] == board[1][1] && board[0][0] == board[0][0] && board[2][2] != 0) {
            findWinner(board[0][0]);
        }

        //Check diagonal 
        if (board[2][0] == board[1][1] && board[2][0] == board[0][2] && board[2][0] != 0) {
            findWinner(board[2][0]);
        }

         //Check leftmost column
         if (board[0][0] == board[1][0] && board[0][0] == board[2][0] && board[0][0] != 0) {
            findWinner(board[0][0]);
        }

        //Check middle column
        if (board[0][1] == board[1][1] && board[0][1] == board[2][1] && board[0][1] != 0) {
            findWinner(board[0][1]);
        }

        //Check rightmost column
        if (board[0][2] == board[1][2] && board[0][2] == board[2][2] && board[0][2] != 0) {
            findWinner(board[0][2]);
        }

        //Check for tie
        if (turn == 9 && !winner){
            DisplayController.displayTie();
        }

    }

    //Use weapon from winning pattern to find winning player
    const findWinner = (weapon) => {
        if (weapon == 'X') {
            winner = player1;
        } else if (weapon == "O") {
            winner = player2;
        }

        DisplayController.displayWinner(winner);
    }

    //Clear the board, reset variables, and clear display
    const resetGame = () => {
        Gameboard.createBoard();
        winner = null;
        turn = 1;
        DisplayController.clearDisplay();
    }

    document.querySelector('.reset-btn').addEventListener('click', resetGame)




    return {
        playRound, player1, player2, winner, resetGame
    }

})();