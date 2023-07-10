let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle";

function init() {
  render();
}

function render() {
  const container = document.getElementById("content");
  const table = document.createElement("table");
  table.classList.add("board");

  let cellIndex = 0;
  for (let i = 0; i < 3; i++) {
    const row = document.createElement("tr"); // Erstellt eine <tr>-Zeile
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement("td"); // Erstellt ein <td>-Element
      const fieldValue = fields[cellIndex];
      if (fieldValue === "circle") {
        const circleSVG = generateCircleSVG();
        cell.innerHTML = circleSVG; // Fügt das generierte SVG für den Kreis in das <td>-Element ein
      } else if (fieldValue === "cross") {
        const crossSVG = generateCrossSVG();
        cell.innerHTML = crossSVG; // Fügt das generierte SVG für das Kreuz in das <td>-Element ein
      }
      cell.setAttribute("onclick", `handleClick(${cellIndex})`);
      row.appendChild(cell); // Fügt das <td>-Element zur aktuellen <tr>-Zeile hinzu
      cellIndex++;
    }
    table.appendChild(row); // Fügt die aktuelle <tr>-Zeile zum <table>-Element hinzu
  }

  container.innerHTML = ""; // Leert den Container
  container.appendChild(table); // Fügt das <table>-Element dem Container hinzu

  const winningCombination = getWinningCombination();
  if (winningCombination) {
    drawWinningLine(winningCombination); // Zeichnet die Gewinnlinie, falls das Spiel gewonnen wurde
  }
}

function handleClick(index) {
  const fieldValue = fields[index];
  if (fieldValue === null && !getWinningCombination()) {
    fields[index] = currentPlayer; // Setzt den aktuellen Spieler in das entsprechende Feld
    const svg =
      currentPlayer === "circle" ? generateCircleSVG() : generateCrossSVG();
    const cell = document.getElementsByTagName("td")[index];
    cell.innerHTML = svg; // Fügt das generierte SVG für den aktuellen Spieler in das <td>-Element ein
    cell.removeAttribute("onclick"); // Entfernt das onclick-Attribut, um erneutes Klicken zu verhindern
    currentPlayer = currentPlayer === "circle" ? "cross" : "circle"; // Wechselt den aktuellen Spieler

    const winningCombination = getWinningCombination();
    if (winningCombination) {
      drawWinningLine(winningCombination); // Zeichnet die Gewinnlinie, falls das Spiel gewonnen wurde
    }
  }
}

function getWinningCombination() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontale Kombinationen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikale Kombinationen
    [0, 4, 8], [2, 4, 6] // diagonale Kombinationen
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      fields[a] !== null &&
      fields[a] === fields[b] &&
      fields[a] === fields[c]
    ) {
      return combination; // Gibt die Gewinnkombination zurück, wenn eine gefunden wurde
    }
  }

  return null; // Gibt null zurück, wenn keine Gewinnkombination gefunden wurde
}

function drawWinningLine(winningCombination) {
  const table = document.querySelector(".board");
  const cells = table.getElementsByTagName("td");

  const [a, b, c] = winningCombination;
  const cellA = cells[a];
  const cellB = cells[b];
  const cellC = cells[c];

  const lineElement = document.createElement("div");
  lineElement.classList.add("winning-line");

  const rectA = cellA.getBoundingClientRect();
  const rectB = cellB.getBoundingClientRect();
  const rectC = cellC.getBoundingClientRect();

  const startX = (rectA.left + rectA.right) / 2;
  const startY = (rectA.top + rectA.bottom) / 2;
  const endX = (rectC.left + rectC.right) / 2;
  const endY = (rectC.top + rectC.bottom) / 2;

  const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

  const angle = Math.atan2(endY - startY, endX - startX);
  const transform = `rotate(${angle}rad)`;

  lineElement.style.top = `${startY}px`;
  lineElement.style.left = `${startX}px`;
  lineElement.style.width = `${length}px`;
  lineElement.style.transform = transform;

  table.parentNode.appendChild(lineElement); // Fügt die Gewinnlinie zum übergeordneten Container hinzu
}

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
