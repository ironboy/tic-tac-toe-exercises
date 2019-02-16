let gameOver = false;
let player = 'X';
let numberOfPiecesPerPlayer = Infinity;
let bigBoard = true;
// set computer player to 'X', 'O' or ''
let computerPlayer = 'O';

function drawBoard() {
  // add a new div inside the body
  // with the class name board
  $('body').append('<div class="board"/>');
  if (bigBoard) {
    $('.board').addClass('bigBoard');
  }
  for (let i = 0; i < (bigBoard ? 625 : 9); i++) {
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
    // check for win or draw
    checkForWin();
    checkForDraw();
    showHowToMove();
    player = player === 'X' ? 'O' : 'X';
    computerMove();
  });

  // remove nice alert
  $(document).on('click', '.niceAlert button', function () {
    $('.niceAlert').remove();
  });

  // restart
  $(document).on('click', '.restart', restart);
}

function checkForWin() {
  let inRowToWin = bigBoard ? 5 : 3;
  let perRow = bigBoard ? 25 : 3;
  let board = boardAsString();
  for (let square = 0; square < perRow ** 2; square++) {
    let horizontalWin = true;
    let verticalWin = true;
    let diagonalWin1 = true;
    let diagonalWin2 = true;
    for (let i = 0; i < inRowToWin; i++) {
      horizontalWin = horizontalWin && board[square + i] === player;
      verticalWin = verticalWin && board[square + i * perRow] === player;
      diagonalWin1 = diagonalWin1 && board[square + i * perRow + i] === player;
      diagonalWin2 = diagonalWin2 && board[square + i * perRow - i] === player;

    }
    horizontalWin = horizontalWin && square % perRow <= perRow - inRowToWin;
    diagonalWin1 = diagonalWin1 && square % perRow <= perRow - inRowToWin;
    diagonalWin2 = diagonalWin2 && square % perRow >= inRowToWin - 1;
    if (horizontalWin || verticalWin || diagonalWin1 || diagonalWin2) {
      gameOver = true;
      niceAlert(player + ' won!');
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
      let move = Math.floor(Math.random() * (bigBoard ? 625 : 9));
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
  if (allPiecesInPlay) {
    $('.howToMove').show();
  }
}

// Start everything
drawBoard();
addClickEvents();
computerMove();
