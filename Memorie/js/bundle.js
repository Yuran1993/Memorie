var memorie = (function (exports) {
  'use strict';

  // ///////////////////////////////////////////
  // Global Vars & Objects
  // ///////////////////////////////////////////
  let cards$$1;
  let playerNumbers$$1;

  // ///////////////////////////////////////////
  // Event Listeners
  // ///////////////////////////////////////////
  $('.level').click((e) => {
    $('.level').css('border', 'solid 3px #fafae5');
    $(e.target).css('border', 'solid 3px rgba(195, 197, 46, 1');

    if (e.target.classList.contains('easy')) {
      cards$$1 = 16;
      $(board$$1).attr('class', 'small');
    } else if (e.target.classList.contains('medium')) {
      cards$$1 = 36;
      $(board$$1).attr('class', 'medium');
    } else if (e.target.classList.contains('hard')) {
      cards$$1 = 64;
      $(board$$1).attr('class', 'large');
    }
  });

  $('.players').click(function(e) {
    $('.players').css('border', 'solid 3px #fafae5');
    $(e.target).css('border', 'solid 3px rgba(195, 197, 46, 1');

    playerNumbers$$1 = $(this).html();
  });

  $('.play').click(function() {
    $('#welcome').css('display', 'none');

    buildBoard$$1();
    closeOpenCards$$1();
    createPlayers$$1();
    createScoreBoard$$1();

    // Closing the cards after 3 secondes
    setTimeout(function() {
      $('.flip-card-inner').addClass('closed');
      closeOpenCards$$1();
    }, 3000);
  });

  // ///////////////////////////////////////////
  // Functions
  // //////////////////////////////////////////

  /** This function creates the end message*/
  function end$$1() {
    const closed = $('.closed');
    const playersA = players$$1;

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
      }
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

  var ctrl = /*#__PURE__*/Object.freeze({
    get cards () { return cards$$1; },
    get playerNumbers () { return playerNumbers$$1; },
    end: end$$1
  });

  // ///////////////////////////////////////////
  // Global Vars & Objects
  // ///////////////////////////////////////////
  let firstCard;
  let secondeCard;
  let playerIndex$$1 = 0;
  let secondeCardBool = false;

  const board$$1 = document.createElement('div');
  $(board$$1).attr('id', 'board');

  // ///////////////////////////////////////////
  // Functions
  // ///////////////////////////////////////////
  /** this function creates the playboard*/
  function buildBoard$$1() {
    // Variables
    const cardsArray = [];

    // Creating cards
    for (let i = 0; i < cards$$1/2; i++) {
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
      $(board$$1).prepend(cardsArray[i]);
    }

    // Adding board to DOM
    $('#wrapper').prepend(board$$1);

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
      closeOpenCards$$1();
    } else {
      secondeCard = currentCard;
      secondeCardBool = false;
      closeOpenCards$$1();
      match(firstCard, secondeCard);
    }
  }
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
          $(card).css('border', `solid 3px ${players$$1[playerIndex$$1].color}`);
        });
      }, 750);

      players$$1[playerIndex$$1].correct++;
    } else {
      bothCards.forEach((card) => {
        $(card).children('.flip-card-inner').addClass('closed');
      });

      players$$1[playerIndex$$1].wrong++;
      playerIndex$$1 < playerNumbers$$1-1 ? playerIndex$$1++ : playerIndex$$1 = 0;
    }
    updateScoreBoard$$1();
    end$$1();
  }

  /** This function openens and closes the cards*/
  const closeOpenCards$$1 = () => {
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

  var playBoard = /*#__PURE__*/Object.freeze({
    board: board$$1,
    buildBoard: buildBoard$$1,
    closeOpenCards: closeOpenCards$$1,
    get playerIndex () { return playerIndex$$1; }
  });

  // ///////////////////////////////////////////
  // Global Vars & Objects
  // ///////////////////////////////////////////
  const colors = ['blue', 'green', 'gold', 'orange', 'red'];
  const players$$1 = [];
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
  }
  // ///////////////////////////////////////////
  // Functions
  // ///////////////////////////////////////////
  // This function create the players with the Player Object.
  const createPlayers$$1 = () => {
    for (let i = 0; i < playerNumbers$$1; i++) {
      const player = new Player(i);
      players$$1.push(player);
    }
    //updateScoreBoard();
  };

  const createScoreBoard$$1 = () => {
    scoreBoard = document.createElement('div');
    $(scoreBoard).attr('class', 'score-board');

    for (let i = 0; i < players$$1.length; i++) {
      const player = document.createElement('div');
      $(player).attr('class', 'html-players');
      $(player).attr('id', 'player-' + [i]);

      const playerName = `<h1>${players$$1[i].name}</h1> <h2>Score: ${players$$1[i].correct}</h2>`;

      $(player).css('color', players$$1[i].color);

      $(player).append(playerName);
      $(scoreBoard).append(player);
    }  $(wrapper).append(scoreBoard);
    updateScoreBoard$$1();
  };

  // This function creates and updates the scoreBoard.
  const updateScoreBoard$$1 = () => {
    const allPlayers = $('.html-players').toArray();
    const currentPlayer = document.getElementById(`player-${playerIndex$$1}`);

    // Adds the score to the scoreBoard
    $(currentPlayer).children('h2').html(`Score: ${players$$1[playerIndex$$1].correct}`);

    // creates the translate and onderline for the player who's turn it is.
    allPlayers.forEach((player) => {
      $(player).children('h1').css('textDecoration', 'none');
      $(player).css('transform', 'translateX(0px)');
    });

    $(currentPlayer).children('h1').css('textDecoration', 'underline');
    $(currentPlayer).css('transform', 'translateX(20px)');
  };

  var players$1 = /*#__PURE__*/Object.freeze({
    players: players$$1,
    createPlayers: createPlayers$$1,
    createScoreBoard: createScoreBoard$$1,
    updateScoreBoard: updateScoreBoard$$1
  });

  exports.ctrl = ctrl;
  exports.playBoard = playBoard;
  exports.players = players$1;

  return exports;

}({}));
