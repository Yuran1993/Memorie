'use strict';
import {ctrl, playBoard} from './main.js';

// ///////////////////////////////////////////
// Global Vars & Objects
// ///////////////////////////////////////////
const colors = ['blue', 'green', 'gold', 'orange', 'red'];
const players = [];
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
// Functions
// ///////////////////////////////////////////
// This function create the players with the Player Object.
const createPlayers = () => {
  for (let i = 0; i < ctrl.playerNumbers; i++) {
    const player = new Player(i);
    players.push(player);
  };
};

const createScoreBoard = () => {
  scoreBoard = document.createElement('div');
  $(scoreBoard).attr('class', 'score-board');

  for (let i = 0; i < players.length; i++) {
    const player = document.createElement('div');
    $(player).attr('class', 'html-players');
    $(player).attr('id', 'player-' + [i]);

    const playerName = `<h1>${players[i].name}</h1> <h2>Score: ${players[i].correct}</h2>`;

    $(player).css('color', players[i].color);

    $(player).append(playerName);
    $(scoreBoard).append(player);
  };
  $(wrapper).append(scoreBoard);
  updateScoreBoard();
};

// This function creates and updates the scoreBoard.
const updateScoreBoard = () => {
  const allPlayers = $('.html-players').toArray();
  const currentPlayer = document.getElementById(`player-${playBoard.playerIndex}`);

  // Adds the score to the scoreBoard
  $(currentPlayer).children('h2').html(`Score: ${players[playBoard.playerIndex].correct}`);

  // creates the translate and onderline for the player who's turn it is.
  allPlayers.forEach((player) => {
    $(player).children('h1').css('textDecoration', 'none');
    $(player).css('transform', 'translateX(0px)');
  });

  $(currentPlayer).children('h1').css('textDecoration', 'underline');
  $(currentPlayer).css('transform', 'translateX(20px)');
};

export {players, createPlayers, createScoreBoard, updateScoreBoard};
