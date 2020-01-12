/**
  Blackjack Game
  Inspired from: Pluralsight course by Mark Zamoyta
*/

// Game Variables
const suits = ['hearts', 'clubs', 'diams', 'spades'];
const ranks = ['a', 'k', 'q', 'j', 10, 9, 8, 7, 6, 5, 4, 3, 2];

// DOM variables
const textArea = document.getElementById('text-area');
const newGameButton = document.getElementById('new-game-button');
const hitButton = document.getElementById('hit-button');
const stayButton = document.getElementById('stay-button');

// Game variables
let gameStarted = false;
let gameOver = false;
let playerWon = false;
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;
let deck = [];

/**
 * Creates the Deck and returns it
 */
function createDeck() {
  deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      const card = {
        suit,
        rank,
      };
      deck.push(card);
    });
  });
  return deck;
}

/**
 * Shuffles the deck
 */
function shuffleDeck() {
  /* eslint-disable no-plusplus */
  for (let i = 0; i < deck.length; i++) {
    const swapIdx = Math.trunc(Math.random() * deck.length);
    const tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
  /* eslint-enable no-plusplus */
}

/**
 * Returns the Markup for card
 * @param {any} card Card to create markup
 * @returns {String} markup of the card
 */
function getCardString(card) {
  const stringCard = `
    <div class="card rank-${card.rank} ${card.suit}">
      <span class="rank">${card.rank}</span>
      <span class="suit">&${card.suit};</span>
    </div>`;
  return stringCard;
}

/**
 * Returns the next card
 * @returns {Array} shifted deck array
 */
function getNextCard() {
  return deck.shift();
}

/**
 * Returns numeric value for card rank
 * @param {Object} card Card
 * @returns {Number} game value of provided card
 */
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

/**
 * Gets the score for provided cards array
 * @param {Array} cardArray Cards array of Dealer or player
 * @returns {Number} score for player or dealer
 */
function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  /* eslint-disable no-plusplus */
  for (let i = 0; i < cardArray.length; i++) {
    const card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'a') {
      hasAce = true;
    }
  }
  /* eslint-enable no-plusplus */
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

/**
 * Updates player's and Dealer's score
 */
function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

/**
 * Checks if game has ended or not.
 */
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
      playerWon = false;
    }
  }
}

/**
 * Shows the game's status
 */
function showStatus() {
  if (!gameStarted) {
    textArea.innerHTML = 'Welcome to Blackjack!';
    return;
  }

  let dealerCardString = '';
  /* eslint-disable no-plusplus */
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += `${getCardString(dealerCards[i])}\n`;
  }

  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += `${getCardString(playerCards[i])}\n`;
  }
  /* eslint-enable no-plusplus */

  updateScores();

  textArea.innerHTML = `Dealer has:<br> <div class="flex-container">${
    dealerCardString
  }</div>(score: ${dealerScore})\n\n`

    + `Player has:<br> <div class="flex-container">${
      playerCardString
    }</div>(score: ${playerScore})\n\n`;

  if (gameOver) {
    if (playerWon) {
      textArea.innerHTML += 'YOU WIN!';
    } else {
      textArea.innerHTML += 'DEALER WINS!';
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}

// Click event listener for New Game Button
newGameButton.addEventListener('click', () => {
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

// Click event listener for Hit Button
hitButton.addEventListener('click', () => {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

// Click event listener for Stay Button
stayButton.addEventListener('click', () => {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

// Updating the screen when page loads
hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();
