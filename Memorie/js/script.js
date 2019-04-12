'use strict';

$(document).ready(function() {
  function c(element) {
    console.log(element);
  }

  // ///////////////////////////////////////////
  // Global Vars & Objects
  // ///////////////////////////////////////////
  // Board & cards
  const board = document.createElement('div');
  $(board).attr('id', 'board');
  let cards;

  // Players & scoreBoard
  const colors = ['blue', 'green', 'gold', 'orange', 'red'];
  let playerNumbers;
  const players = [];
  let playerIndex = 0;
  let scoreBoard;

  /**
  Player Object
  @param {number} i states how many players are in the game
  */
  function Player(i) {
    this.name = 'player ' + (i+1);
    this.color = colors[i];
    this.correct = 0;
    this.wrong = 0;
  };

  // ///////////////////////////////////////////
  // Event Listeners
  // ///////////////////////////////////////////
  $('.level').click((e) => {
    if (e.target.classList.contains('easy')) {
      cards = 16;
      $(board).attr('class', 'small');
    } else if (e.target.classList.contains('medium')) {
      cards = 36;
      $(board).attr('class', 'medium');
    } else if (e.target.classList.contains('hard')) {
      cards = 64;
      $(board).attr('class', 'large');
    }
  });

  $('.players').click(function() {
    playerNumbers = $(this).html();
  });

  $('.play').click(function() {
    const cardsArray = [];

    let firstCard;
    let secondeCard;
    let secondeCardBool = false;

    if (cards && playerNumbers) {
      $('#welcome').css('display', 'none');

      // Creating board and cards
      for (let i = 0; i < cards/2; i++) {
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

      cardsArray.sort(function() {
        return 0.5 - Math.random();
      });

      for (let i = 0; i < cardsArray.length; i++) {
        $(board).prepend(cardsArray[i]);
      }

      $('#wrapper').prepend(board);

      // Click event for the cards
      $('.flip-card').click(function() {
        closeCards();

        $(this).children('div').removeClass('closed');
        $(this).children('div').css('transform', 'rotateY(0deg)');
        $(this).css('pointer-events', 'none');

        if (!secondeCardBool) {
          firstCard = this;
          secondeCardBool = true;
        } else {
          secondeCard = this;
          secondeCardBool = false;
          match(firstCard, secondeCard);
          end();
        }
      });

      // Closing the cards after 3 secondes
      $('.flip-card-inner').addClass('closed');
      setTimeout(function() {
        closeCards();
      }, 3000);

      // Creating scoreboard & the players
      scoreBoard = document.createElement('div');
      $(scoreBoard).attr('class', 'score-board');
      $(wrapper).append(scoreBoard);

      createPlayers();
    }
  });

  // ///////////////////////////////////////////
  // Functions
  // ///////////////////////////////////////////
  // This function create the players with the Player Object.
  const createPlayers = () => {
    for (let i = 0; i < playerNumbers; i++) {
      const player = new Player(i);
      players.push(player);
    };

    updateScoreBoard();
  };

  // This function creates and updates the scoreBoard.
  const updateScoreBoard = () => {
    $(scoreBoard).empty();

    for (let i = 0; i < players.length; i++) {
      const player = document.createElement('div');
      $(player).attr('class', 'player-' + [i]);

      const playerName = `<h1>${players[i].name}</h1> <h2>Score: ${players[i].correct}</h2>`;

      $(player).css('color', players[i].color);

      $(player).append(playerName);
      $(scoreBoard).append(player);
    };

    // creates the translate and onderline for the player who's turn it is.
    $('.score-board>div').children().css('textDecoration', 'none');
    $('.score-board>div').css('transform', 'translateX(0)');
    $(`.player-${playerIndex} > h1`).css('textDecoration', 'underline');
    $(`.player-${playerIndex}`).css('transform', 'translateX(20px)');
  };

  /** This function checks if there is a match and if so acts accordingly.
  @param {object} firstCard, this is the first clicked card.
  @param {object} secondeCard, this is the seconde clicked card.
  */
  function match(firstCard, secondeCard) {
    const bothCards = [firstCard, secondeCard];
    if ($(firstCard).find('.flip-card-front>img').attr('src') === $(secondeCard).find('.flip-card-front>img').attr('src')) {
      setTimeout(function() {
        $(bothCards).css('border', `solid 3px ${players[playerIndex].color}`);
      }, 750);

      players[playerIndex].correct++;
    } else {
      $(bothCards).find('.flip-card-inner').addClass('closed');
      $(bothCards).css('pointer-events', 'auto');

      players[playerIndex].wrong++;
      playerIndex < playerNumbers-1 ? playerIndex++ : playerIndex = 0;
    }
    updateScoreBoard();
  }

  const closeCards = () => $('.closed').css('transform', 'rotateY(180deg)');

  /** This function creates the end message*/
  function end() {
    const closed = $('.closed');
    if (closed.length === 0) {
      const winMesWrapper = document.createElement('div');
      const winMes = document.createElement('div');
      $(winMesWrapper).attr('id', 'winMesWrapper');
      $(winMes).attr('id', 'winMes');

      players.sort((a, b) => (a.correct > b.correct) ? -1 : ((b.correct > a.correct) ? 1 : 0));

      for (let i = 0; i < players.length; i++) {
        const player = document.createElement('div');
        let status = '';

        if (i === 0) {
          status = 'Winner: ';
          $(player).attr('id', 'winner');
        }

        $(player).html(`
          <h1>${status + players[i].name}</h1>
          <p>Correct Pairs: ${players[i].correct}</p>
          <p>Incorrect Pairs: ${players[i].wrong}</p>
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
});
