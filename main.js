function drawBoard(){
  // add a new div inside the body
  // with the class name board
  $('body').append('<div class="board"/>');
  // add nine divs inside the div 
  // with the class name board
  for(let i = 0; i < 9; i++){
    $('.board').append('<div/>');
  }
}

function addClickEvent(){
  let player = 'X';
  $(document).on('click', '.board div', function(){
    if($(this).text() !== ''){
      // the div is not empty so do nothing
      return;
    }
    $(this).text(player);
    // ternary operator to switch current player
    player = player === 'X' ? 'O' : 'X';
    // check for win
    checkForWin();
  });
}

function checkForWin(){
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
  let board = [];
  // loop through each div in the board
  // using jQuery:s each method
  $('.board div').each(function(){
    board.push($(this).text());
  });
  // now check both colors for all combos
  for(let color of colors){
    for(let combo of winningCombos){
      if(
        board[combo[0]] === color &&
        board[combo[1]] === color &&
        board[combo[2]] === color
      ){
        // Wait 1 millisecond before
        // our alert so that the
        // board is redrawn...
        setTimeout(function(){
          alert(color + ' has won!');
        }, 1);
      }
    }
  }
}

// Start everything
drawBoard();
addClickEvent();