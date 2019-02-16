let gameOver = false;
let player = 'X';
let numberOfPiecesPerPlayer = 3;
// set computer player to 'X', 'O' or ''
let computerPlayer = 'O';


function drawBoard() {
  // add a new div inside the body
  // with the class name board
  $('body').append('<div class="board"/>');
  // add nine divs inside the div 
  // with the class name board
  for (let i = 0; i < 9; i++) {
    $('.board').append('<div/>');
  }
  // add a restart button
  $('body').append('<button class="restart">Restart game</button>');
  // add a "how to move your pieces" explanation
  $('body').append('<div class="howToMove">You have played all your pieces. Move a piece by clicking it and then clicking an empty square.');
}

function addClickEvents() {
  // click on square on board
  $(document).on('click', '.board div', function () {
    let allPiecesInPlay =
      $('.board div:contains("' + player + '")').length >=
      numberOfPiecesPerPlayer;
    if (gameOver) {
      // the game is over so do nothing
      return;
    }
    if (allPiecesInPlay && $(this).text() === player) {
      $('.selected').removeClass('selected');
      $(this).addClass('selected');
      return;
    }
    if ($(this).text() !== '') {
      // the div is not empty so do nothing
      return;
    }
    if (allPiecesInPlay && $('.selected').length === 0) {
      return;
    }
    $(this).text(player);
    $('.selected').removeClass('selected').empty();
    // ternary operator to switch current player
    player = player === 'X' ? 'O' : 'X';
    // check for win or draw
    checkForWin();
    checkForDraw();
    computerMove();
    showHowToMove();
  });

  // remove nice alert
  $(document).on('click', '.niceAlert button', function () {
    $('.niceAlert').remove();
  });

  // restart
  $(document).on('click', '.restart', restart);
}

function checkForWin() {
  let colors = ['X', 'O'];
  let winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let board = boardAsString();
  // now check both colors for all combos
  for (let color of colors) {
    for (let combo of winningCombos) {
      if (
        board[combo[0]] === color &&
        board[combo[1]] === color &&
        board[combo[2]] === color
      ) {
        niceAlert(color + ' has won!');
        gameOver = true;
      }
    }
  }
}

function checkForDraw() {
  let emptySquares = $('.board div:empty').length;
  if (!gameOver && emptySquares === 0) {
    niceAlert('It is a draw!');
    gameOver = true;
  }
}

function niceAlert(text) {
  if ($('.niceAlert').length > 0) { return; }
  $('body').append('<div class="niceAlert">' + text + '</div>');
  $('.niceAlert').append('<button>OK</button>');
}

function restart() {
  $('.board div').empty();
  $('.howToMove').hide();
  gameOver = false;
  player = 'X';
}

function computerMove() {
  if (computerPlayer === player && !gameOver) {
    let board = boardAsString();
    while (board === boardAsString()) {
      let move = Math.floor(Math.random() * 9);
      $('.board div').eq(move).click();
    }
  }
}

function boardAsString() {
  let emptySquares = $('.board div:empty');
  emptySquares.text(' ');
  let str = $('.board').text();
  emptySquares.text('');
  return str;
}

function showHowToMove() {
  let allPiecesInPlay =
    $('.board div:contains("' + player + '")').length >=
    numberOfPiecesPerPlayer;
  if(allPiecesInPlay){
    $('.howToMove').show();
  }
}

// Start everything
drawBoard();
addClickEvents();
computerMove();
