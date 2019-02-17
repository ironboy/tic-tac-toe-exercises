let gameOver = false;
let player = 'X';
let numberOfPiecesPerPlayer = Infinity;
let bigBoard = true;
let smartComputerPlayer = true;
let scorePrio = calculateScorePrio();
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
    if (gameOver) {
      // the game is over so do nothing
      return;
    }
    if (allPiecesInPlay() && $(this).text() === player) {
      $('.selected').removeClass('selected');
      $(this).addClass('selected');
      return;
    }
    if ($(this).text() !== '') {
      // the div is not empty so do nothing
      return;
    }
    if (allPiecesInPlay() && $('.selected').length === 0) {
      return;
    }
    $(this).text(player);
    $('.selected').removeClass('selected').empty();
    // check for win or draw
    checkForWin();
    checkForDraw();
    showHowToMove();
    player = player === 'X' ? 'O' : 'X';
    setTimeout(function(){ computerMove(); }, 100);
  });

  // remove nice alert
  $(document).on('click', '.niceAlert button', function () {
    $('.niceAlert').remove();
  });

  // restart
  $(document).on('click', '.restart', restart);
}

function checkForWin(inRowToWin = bigBoard ? 5 : 3, board = boardAsString(), realCheck = true) {
  let perRow = bigBoard ? 25 : 3;
  let wins = 0;
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
      if(realCheck){
        gameOver = true;
        niceAlert(player + ' won!');
      }
    }
    wins += horizontalWin + verticalWin + diagonalWin1 + diagonalWin2;
  }
  return wins;
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
  if (computerPlayer !== player || gameOver) { return; }
  // dumb player
  if (!smartComputerPlayer) {
    let board = boardAsString();
    while (board === boardAsString()) {
      let move = Math.floor(Math.random() * (bigBoard ? 625 : 9));
      $('.board div').eq(move).click();
    }
    return;
  }
  // smart player
  let boardCopy = boardAsString().split('');
  let possibleMoves = [];
  let allInPlay = allPiecesInPlay();
  for (let moveFrom = 0; moveFrom < (bigBoard ? 625 : 9); moveFrom++) {
    let board = boardCopy.slice();
    if (!allInPlay) { moveFrom = Infinity; }
    else if (board[moveFrom] !== player) { continue; }
    if (moveFrom < Infinity) { boardFrom = ' '; }
    let realPlayer = player;
    for (let color of ['X', 'O']) {
      player = color;
      for (let moveTo = 0; moveTo < (bigBoard ? 625 : 9); moveTo++) {
        let b = board.slice();
        if (b[moveTo] !== ' ') { continue; }
        b[moveTo] = color;
        let score = 0;
        for (let inRow = 1; inRow <= (bigBoard ? 5 : 3); inRow++) {
          let before = checkForWin(inRow, boardCopy, false);
          let after = checkForWin(inRow, b, false);
          score += scorePrio[(color === realPlayer ? 'me' : 'opponent') + inRow] * (after - before);
        }
        possibleMoves.push({board: b, moveFrom: moveFrom, moveTo: moveTo, score: score});
      }
    }
    player = realPlayer;
  }
  possibleMoves.sort(function(a,b){
    let boardMiddle = bigBoard ? 312 : 4;
    if(a.score === b.score){
      if(a.moveTo === boardMiddle){ return -1; }
      return a%2 - b%2;
    }
    return b.score - a.score;
  });
  let move = possibleMoves[0];
  if(move.moveFrom < Infinity){ $('.board div').eq(move.moveFrom).click(); }
  $('.board div').eq(move.moveTo).click();
}

function boardAsString() {
  let emptySquares = $('.board div:empty');
  emptySquares.text(' ');
  let str = $('.board').text();
  emptySquares.text('');
  return str;
}

function showHowToMove() {
  if (allPiecesInPlay()) {
    $('.howToMove').show();
  }
}

function allPiecesInPlay() {
  return $('.board div:contains("' + player + '")').length >=
    numberOfPiecesPerPlayer;
}

function calculateScorePrio(){
  let prio = bigBoard ? 'm5,o5,o4,o3,m4,m3,m2,m1,o2,o1' : 'm3,o3,o2,m2,m1,o1';
  prio = prio.split(',');
  let prioPoints = {};
  let co = prio.length - 1;
  for(let p of prio){
    let key = p.split('m').join('me').split('o').join('opponent');
    prioPoints[key] = 100 ** co;
    co--;
  }
  return prioPoints;
}

// Start everything
drawBoard();
addClickEvents();
computerMove();
