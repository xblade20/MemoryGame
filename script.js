const icons = ['🍎', '🍌', '🍒', '🍓', '🍉', '🍇', '🍍', '🥥'];

let grid = [];
let flippedCards = [];
let moves = 0;
let timerInterval;
let time = 0;
let isGameOver = false;
let hasStarted = false;
let isFlipping = false; // Prevent multiple flips at once

document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
  // Reset the game state
  isGameOver = false;
  moves = 0;
  time = 0;
  flippedCards = [];
  grid = generateGrid();
  updateUI();

  // Clear existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Render the board
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  grid.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.index = index;
    cardElement.dataset.icon = card.icon;
    cardElement.addEventListener("click", handleCardClick);
    board.appendChild(cardElement);
  });
}

function generateGrid() {
  const allIcons = [...icons, ...icons];
  const shuffledIcons = allIcons.sort(() => Math.random() - 0.5);

  return shuffledIcons.map(icon => ({
    icon,
    isFlipped: false,
    isMatched: false
  }));
}

function handleCardClick(e) {
  if (isGameOver || isFlipping) return; // Prevent interaction while flipping or game is over

  // Start the timer when the user clicks the first card
  if (!hasStarted) {
    hasStarted = true;
    startTimer();
  }

  const cardIndex = e.target.dataset.index;
  const card = grid[cardIndex];

  // Prevent flipping the card if it's already flipped or matched
  if (card.isFlipped || card.isMatched || e.target.classList.contains("flipping")) return;

  // Add the flipping class to trigger the flip animation
  e.target.classList.add("flipping");

  // Flip the card
  card.isFlipped = true;
  e.target.classList.add("flipped");
  e.target.textContent = card.icon;
  flippedCards.push({ index: cardIndex, card, element: e.target });

  // Check for a match
  if (flippedCards.length === 2) {
    moves++;
    updateUI();

    const [firstCard, secondCard] = flippedCards;

    isFlipping = true; // Prevent further interactions while checking match

    if (firstCard.card.icon === secondCard.card.icon) {
      firstCard.card.isMatched = true;
      secondCard.card.isMatched = true;
      flippedCards = [];
      
      // Check if the game is over
      if (grid.every(card => card.isMatched)) {
        isGameOver = true;
        clearInterval(timerInterval); // Stop the timer when the game is won
        setTimeout(showWinModal, 100);
      }

      isFlipping = false; // Re-enable flipping once cards are matched
    } else {
      setTimeout(() => {
        // Flip back the cards after animation
        firstCard.element.classList.remove("flipped");
        secondCard.element.classList.remove("flipped");

        firstCard.card.isFlipped = false;
        secondCard.card.isFlipped = false;

        // Remove the flipping class to re-enable clicking
        firstCard.element.classList.remove("flipping");
        secondCard.element.classList.remove("flipping");

        // Ensure the icon is hidden
        firstCard.element.textContent = "";
        secondCard.element.textContent = "";

        flippedCards = [];
        isFlipping = false; // Re-enable flipping after both cards are reset
      }, 1000); // Wait for the animation to complete
    }
  }
}

function startTimer() {
  timerInterval = setInterval(updateTime, 1000);
}

function updateUI() {
  document.getElementById("move-counter").textContent = moves;
  document.getElementById("timer").textContent = time;
  updateBoard();
}

function updateBoard() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((cardElement, index) => {
    const card = grid[index];
    if (card.isFlipped || card.isMatched) {
      cardElement.classList.add("flipped");
      cardElement.textContent = card.icon;
    } else {
      cardElement.classList.remove("flipped");
      cardElement.textContent = "";
    }
  });
}

function updateTime() {
  time++;
  document.getElementById("timer").textContent = time;
}

function showWinModal() {
  document.getElementById("final-moves").textContent = moves;
  document.getElementById("final-time").textContent = time;
  document.getElementById("win-modal").style.display = "flex";
}

function restartGame() {
  document.getElementById("win-modal").style.display = "none";
  initGame();

  hasStarted = false;
}
