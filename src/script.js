// Declare an array to store the state of the game board
let fields = [null, null, null, null, null, null, null, null, null];
// Current player ("circle" or "cross")
let currentPlayer = "circle";

// Initialization function
function init() {
  // Render the game board
  render();
}

// Function for rendering the game board
function render() {
  // Get the container element from the HTML document
  const container = document.getElementById("content");
  // Create a table for the game board
  const table = document.createElement("table");
  table.classList.add("board");

  // Iterate over the rows
  for (let i = 0; i < 3; i++) {
    // Create a new table row
    const row = document.createElement("tr");
    // Iterate over the columns
    for (let j = 0; j < 3; j++) {
      // Create a new cell
      const cell = document.createElement("td");
      // Get the value of the field from the array
      const fieldValue = fields[i * 3 + j];
      
      // Check the field value and fill the cell with a circle or cross accordingly
      if (fieldValue === "circle") {
        const circleSVG = generateCircleSVG();
        cell.innerHTML = circleSVG;
      } else if (fieldValue === "cross") {
        const crossSVG = generateCrossSVG();
        cell.innerHTML = crossSVG;
      }
      
      // Set the click event for the cell
      cell.setAttribute("onclick", `handleClick(${i * 3 + j})`);
      
      // Add the cell to the row
      row.appendChild(cell);
    }
    
    // Add the row to the table
    table.appendChild(row);
  }
  
  // Clear the container
  container.innerHTML = "";
  // Add the table to the container
  container.appendChild(table);

  // Check if there is a winning combination
  const winningCombination = getWinningCombination();
  // If a winning combination exists, draw the winning line
  if (winningCombination) {
    drawWinningLine(winningCombination);
  }
}

// Function called when a cell is clicked
function handleClick(index) {
  // Check if the field is empty and there is no winning combination
  const fieldValue = fields[index];
  if (fieldValue === null && !getWinningCombination(fields)) {
    // Set the move of the current player in the array
    fields[index] = currentPlayer;

    // Generate the SVG code for the corresponding symbol
    const svg = currentPlayer === "circle" ? generateCircleSVG() : generateCrossSVG();

    // Update the cell in the HTML document with the SVG code
    const cell = document.getElementsByTagName("td")[index];
    cell.innerHTML = svg;
    cell.removeAttribute("onclick");

    // Switch to the other player
    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";

    // Check again if there is a winning combination
    const winningCombination = getWinningCombination(fields);
    if (winningCombination) {
      drawWinningLine(winningCombination);
    } else if (isGameDraw()) {
      showDrawAlert();
    }

    // If the current player is "cross" and there is no winning combination, execute the bot's move
    if (currentPlayer === "cross" && !getWinningCombination(fields) && !isGameDraw()) {
      playBotMove();
    }
  }
}

// Function to check if the game is a draw
function isGameDraw() {
  return !getAvailableMoves().length && !getWinningCombination(fields);
}

// Function to show a draw alert
function showDrawAlert() {
  const alertText = "Unentschieden!";
  const restartButton = "Neustarten";

  setTimeout(() => {
    alert(alertText);
    restartGame();
  }, 200);
}


function playBotMove() {
  if (currentPlayer === "cross" && !getWinningCombination()) {
    const availableMoves = getAvailableMoves();

    // Check for winning moves
    for (const move of availableMoves) {
      // Make a copy of the current fields array
      const tempFields = [...fields];
      // Simulate the move
      tempFields[move] = currentPlayer;
      // Check if it's a winning move
      if (getWinningCombination(tempFields)) {
        makeMove(move);
        return; // Exit the function after making the winning move
      }
    }

    // Check for blocking moves
    for (const move of availableMoves) {
      const tempFields = [...fields];
      tempFields[move] = "circle"; // Assume the opponent's move
      if (getWinningCombination(tempFields)) {
        makeMove(move);
        return; // Exit the function after making the blocking move
      }
    }

    // Choose the center move if available
    const centerMove = availableMoves.find(move => move === 4);
    if (centerMove !== undefined) {
      makeMove(centerMove);
      return; // Exit the function after making the center move
    }

    // Choose a random move from the available moves
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const randomMove = availableMoves[randomIndex];
    makeMove(randomMove);
  }
}

// Function to make a move
function makeMove(move) {
  fields[move] = currentPlayer;
  const cell = document.getElementsByTagName("td")[move];
  const svg = generateCrossSVG();
  cell.innerHTML = svg;
  cell.removeAttribute("onclick");
  currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
  const winningCombination = getWinningCombination();
  if (winningCombination) {
    drawWinningLine(winningCombination);
  }
}

// Function that returns a list of available moves
function getAvailableMoves() {
  const availableMoves = [];
  for (let i = 0; i < fields.length; i++) {
    if (fields[i] === null) {
      availableMoves.push(i);
    }
  }
  return availableMoves;
}

// Function that checks if there is a winning combination
function getWinningCombination() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal combinations
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical combinations
    [0, 4, 8], [2, 4, 6] // diagonal combinations
  ];

  // Iterate over the winning combinations
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    // Check if the fields of the combination are equal and not empty
    if (
      fields[a] !== null &&
      fields[a] === fields[b] &&
      fields[a] === fields[c]
    ) {
      // Return the winning combination
      return combination;
    }
  }

  // If there is no winning combination, return null
  return null;
}

// Function that draws the winning line
function drawWinningLine(winningCombination) {
  // Get the table and cells from the HTML document
  const table = document.querySelector(".board");
  const cells = table.getElementsByTagName("td");

  const [a, b, c] = winningCombination;
  const cellA = cells[a];
  const cellB = cells[b];
  const cellC = cells[c];

  // Create a div element for the winning line
  const lineElement = document.createElement("div");
  lineElement.classList.add("winning-line");

  // Calculate the coordinates and length of the winning line
  const rectA = cellA.getBoundingClientRect();
  const rectB = cellB.getBoundingClientRect();
  const rectC = cellC.getBoundingClientRect();

  const startX = (rectA.left + rectA.right) / 2;
  const startY = (rectA.top + rectA.bottom) / 2;
  const endX = (rectC.left + rectC.right) / 2;
  const endY = (rectC.top + rectC.bottom) / 2;

  const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

  // Calculate the angle and transform the winning line accordingly
  const angle = Math.atan2(endY - startY, endX - startX);
  const transform = `rotate(${angle}rad)`;

  // Set the position, length, and transformation of the winning line
  lineElement.style.top = `${startY}px`;
  lineElement.style.left = `${startX}px`;
  lineElement.style.width = `${length}px`;
  lineElement.style.transform = transform;

  // Add the winning line to the HTML document
  table.parentNode.appendChild(lineElement);

  // Mark the winning cells
  cellA.classList.add("winning-cell");
  cellB.classList.add("winning-cell");
  cellC.classList.add("winning-cell");
}

// Function that generates the SVG code for a circle
function generateCircleSVG() {
  const color = "#00B0EF";
  const width = 70;
  const height = 70;

  return `<svg width="${width}" height="${height}">
            <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none">
              <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
            </circle>
          </svg>`;
}

// Function that generates the SVG code for a cross
function generateCrossSVG() {
  const color = "#FFC000";
  const width = 70;
  const height = 70;

  const svgCode = `
    <svg width="${width}" height="${height}">
      <line x1="0" y1="0" x2="${width}" y2="${height}"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="0; ${width}" dur="200ms" />
        <animate attributeName="y2" values="0; ${height}" dur="200ms" />
      </line>
      <line x1="${width}" y1="0" x2="0" y2="${height}"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="${width}; 0" dur="200ms" />
        <animate attributeName="y2" values="0; ${height}" dur="200ms" />
      </line>
    </svg>
  `;
  return svgCode;
}

// Function to restart the game
function restartGame() {
  // Reset the game board
  fields = [null, null, null, null, null, null, null, null, null];
  // Reset the current player
  currentPlayer = "circle";
  // Render the game board again
  render();
}
