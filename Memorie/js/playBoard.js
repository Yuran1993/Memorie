'use strict';
import {ctrl, players} from './main';

// ///////////////////////////////////////////
// Global Vars & Objects
// ///////////////////////////////////////////
let firstCard;
let secondeCard;
let playerIndex = 0;
let secondeCardBool = false;

const board = document.createElement('div');
$(board).attr('id', 'board');

// ///////////////////////////////////////////
// Functions
// ///////////////////////////////////////////
/** this function creates the playboard*/
function buildBoard() {
  // Variables
  const cardsArray = [];

  // Creating cards
  for (let i = 0; i < ctrl.cards/2; i++) {
    for (let j = 0; j < 2; j++) {
      const card = `
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="images/card-${i}.jpg">
          </div>
          <div class="flip-card-back">
            <img src="images/back.jpg">
          </div>
        </div>
      </div>`;
      cardsArray.push(card);
    }
  }

  // Shuffeling cards
  cardsArray.sort(function() {
    return 0.5 - Math.random();
  });

  // Adding cards to board
  for (let i = 0; i < cardsArray.length; i++) {
    $(board).prepend(cardsArray[i]);
  }

  // Adding board to DOM
  $('#wrapper').prepend(board);

  // Click event for the cards
  $('.flip-card').click(function(e) {
    cardClick(e);
  });
}

/**
This get executed when one of the cards get clicked
@param {element} e = event object
*/
function cardClick(e) {
  // Variables
  const currentCard = $(e.target).closest('div.flip-card');

  $(currentCard).children('div').removeClass('closed');

  if (!secondeCardBool) {
    firstCard = currentCard;
    secondeCardBool = true;
    closeOpenCards();
  } else {
    secondeCard = currentCard;
    secondeCardBool = false;
    closeOpenCards();
    match(firstCard, secondeCard);
  }
};

/** This function checks if there is a match and if so acts accordingly.
@param {object} firstCard, this is the first clicked card.
@param {object} secondeCard, this is the seconde clicked card.
*/
function match(firstCard, secondeCard) {
  const bothCards = [firstCard, secondeCard];
  const firstCardSrc = $(firstCard).find('.flip-card-front>img').attr('src');
  const secondeCardSrc = $(secondeCard).find('.flip-card-front>img').attr('src');

  if (firstCardSrc === secondeCardSrc) {
    setTimeout(function() {
      bothCards.forEach((card) => {
        $(card).css('border', `solid 3px ${players.players[playerIndex].color}`);
      });
    }, 750);

    players.players[playerIndex].correct++;
  } else {
    bothCards.forEach((card) => {
      $(card).children('.flip-card-inner').addClass('closed');
    });

    players.players[playerIndex].wrong++;
    playerIndex < ctrl.playerNumbers-1 ? playerIndex++ : playerIndex = 0;
  }
  players.updateScoreBoard();
  ctrl.end();
}

/** This function openens and closes the cards*/
const closeOpenCards = () => {
  const cards = $('.flip-card-inner').toArray();

  cards.forEach(function(card) {
    if (card.classList.contains('closed')) {
      $(card).css('transform', 'rotateY(180deg)');
      $(card).parent().css('pointer-events', 'auto');
    } else {
      $(card).css('transform', 'rotateY(0deg)');
      $(card).parent().css('pointer-events', 'none');
    }
  });
};

export {board, buildBoard, closeOpenCards, playerIndex};
