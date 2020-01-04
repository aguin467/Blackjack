//
// Blackjack
// Author: aguin467
// Github: https://www.github.com/aguin467
//

/*
 Blackjack Game
 Pluralsight course by Mark Zamoyta
*/

// Cards variables
// let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
//   values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eigth', 'Seven',
//     'Six', 'Five', 'Four', 'Three', 'Two'
//   ];

const suits = ['hearts', 'clubs', 'diams', 'spades'];

const ranks = ['a', 'k', 'q', 'j', 10, 9, 8, 7, 6, 5, 4, 3, 2];

// DOM variables
let textArea = document.getElementById('text-area'),
  newGameButton = document.getElementById('new-game-button'),
  hitButton = document.getElementById('hit-button'),
  stayButton = document.getElementById('stay-button');

//Game variables
let gameStarted = false,
  gameOver = false,
  playerWon = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
});

hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function createDeck() {
  let deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      const card = {
        suit: suit,
        rank: rank,
      };
      deck.push(card);
    })
  });
  console.log(deck);
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString(card) {
  console.log(card);
  const stringCard = `
    <div class="card rank-${card.rank} ${card.suit}">
      <span class="rank">${card.rank}</span>
      <span class="suit">&${card.suit};</span>
    </div>`;
  return stringCard;
}

function getNextCard() {
  return deck.shift();
}

function getCardNumericValue(card) {
  switch (card.rank) {
    case 'a':
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    case 6:
      return 6;
    case 7:
      return 7;
    case 8:
      return 8;
    case 9:
      return 9;
    default: 
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'a') {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame() {

  updateScores();

  if (gameOver) {
    // let dealer take cards
    while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  } else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  } else if (gameOver) {

    if (playerScore > dealerScore) {
      playerWon = true;
    } else {
      PlayerWon = false;
    }
  }
}

function showStatus() {
  if (!gameStarted) {
    textArea.innerHTML = 'Welcome to Blackjack!';
    return;
  }

  let dealerCardString = '';
  console.log(dealerCards);
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }

  let playerCardString = '';
  console.log('playerCards', playerCards);
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }

  updateScores();

  textArea.innerHTML =
    'Dealer has:<br> <div class="flex-container">' +
    dealerCardString +
    '</div>(score: ' + dealerScore + ')\n\n' +

    'Player has:<br> <div class="flex-container">' +
    playerCardString +
    '</div>(score: ' + playerScore + ')\n\n';

  if (gameOver) {
    if (playerWon) {
      textArea.innerHTML += "YOU WIN!";
    } else {
      textArea.innerHTML += "DEALER WINS!";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}