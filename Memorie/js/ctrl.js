'use strict';
import {playBoard, players} from './main';

// ///////////////////////////////////////////
// Global Vars & Objects
// ///////////////////////////////////////////
let cards;
let playerNumbers;

// ///////////////////////////////////////////
// Event Listeners
// ///////////////////////////////////////////
$('.level').click((e) => {
  $('.level').css('border', 'solid 3px #fafae5');
  $(e.target).css('border', 'solid 3px rgba(195, 197, 46, 1');

  if (e.target.classList.contains('easy')) {
    cards = 16;
    $(playBoard.board).attr('class', 'small');
  } else if (e.target.classList.contains('medium')) {
    cards = 36;
    $(playBoard.board).attr('class', 'medium');
  } else if (e.target.classList.contains('hard')) {
    cards = 64;
    $(playBoard.board).attr('class', 'large');
  }
});

$('.players').click(function(e) {
  $('.players').css('border', 'solid 3px #fafae5');
  $(e.target).css('border', 'solid 3px rgba(195, 197, 46, 1');

  playerNumbers = $(this).html();
});

$('.play').click(function() {
  $('#welcome').css('display', 'none');

  playBoard.buildBoard();
  playBoard.closeOpenCards();
  players.createPlayers();
  players.createScoreBoard();

  // Closing the cards after 3 secondes
  setTimeout(function() {
    $('.flip-card-inner').addClass('closed');
    playBoard.closeOpenCards();
  }, 3000);
});

// ///////////////////////////////////////////
// Functions
// //////////////////////////////////////////

/** This function creates the end message*/
function end() {
  const closed = $('.closed');
  const playersA = players.players;

  if (closed.length === 0) {
    const winMesWrapper = document.createElement('div');
    const winMes = document.createElement('div');
    $(winMesWrapper).attr('id', 'winMesWrapper');
    $(winMes).attr('id', 'winMes');

    playersA.sort((a, b) => (a.correct > b.correct) ? -1 : ((b.correct > a.correct) ? 1 : 0));

    for (let i = 0; i < playersA.length; i++) {
      const player = document.createElement('div');
      let status = '';

      if (i === 0) {
        status = 'WINNER: ';
        $(player).attr('id', 'winner');
      }

      $(player).html(`
        <h1>${status + playersA[i].name}</h1>
        <p>Correct Pairs: ${playersA[i].correct}</p>
        <p>Incorrect Pairs: ${playersA[i].wrong}</p>
        `);
      $(winMes).append(player);
    };

    const restart = document.createElement('button');
    $(restart).attr('class', 'restart');
    $(restart).html('Play again!');

    $(winMes).append(restart);
    $(winMesWrapper).append(winMes);
    $('#board').prepend(winMesWrapper);

    $(restart).click(function() {
      location.reload();
    });
  }
}

// ///////////////////////////////////////////
// Export
// //////////////////////////////////////////
export {cards, playerNumbers, end};
