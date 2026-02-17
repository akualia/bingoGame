const SIZE = 5;
const TOTAL_IMAGES = 36;
let bingoAchieved = false;

const board = document.getElementById("board");
const overlay = document.getElementById("overlay");
const winSound = document.getElementById("winSound");

let gridStatus = Array(SIZE)
    .fill()
    .map(() => Array(SIZE).fill(0));

let numbers = Array.from({ length: TOTAL_IMAGES }, (_, i) => i + 1);
numbers.sort(() => Math.random() - 0.5);

let imgIndex = 0;

for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        if (r === 2 && c === 2) {
            cell.classList.add("marked");
            cell.innerHTML =
                '<div style="color:#22c55e; font-size:5vmin; font-weight:bold;">FREE</div>';
            gridStatus[r][c] = 1;
        } else {
            const img = document.createElement("img");
            img.src = `../assets/images/${numbers[imgIndex++]}.png`;
            cell.appendChild(img);
        }

        cell.onclick = () => handleMarking(cell, r, c);
        board.appendChild(cell);
    }
}

function handleMarking(cell, r, c) {
    if (bingoAchieved) {
        if (gridStatus[r][c] === 1 && !(r === 2 && c === 2)) {
            gridStatus[r][c] = 0;
            cell.classList.remove("marked");
            resetWinState();
        }
        return;
    }

    if (r === 2 && c === 2) return;

    if (gridStatus[r][c] === 0) {
        gridStatus[r][c] = 1;
        cell.classList.add("marked");
        checkBingo();
    } else {
        gridStatus[r][c] = 0;
        cell.classList.remove("marked");
    }
}

function checkBingo() {
    // Check Rows
    for (let r = 0; r < SIZE; r++) {
        if (gridStatus[r].every((v) => v === 1)) {
            drawLine("row", r);
            return triggerWin();
        }
    }
    for (let c = 0; c < SIZE; c++) {
        let colItems = [];
        for (let r = 0; r < SIZE; r++) colItems.push(gridStatus[r][c]);
        if (colItems.every((v) => v === 1)) {
            drawLine("col", c);
            return triggerWin();
        }
    }
    let diag1 = [],
        diag2 = [];
    for (let i = 0; i < SIZE; i++) {
        diag1.push(gridStatus[i][i]);
        diag2.push(gridStatus[i][SIZE - 1 - i]);
    }
    if (diag1.every((v) => v === 1)) {
        drawLine("diag1");
        return triggerWin();
    }
    if (diag2.every((v) => v === 1)) {
        drawLine("diag2");
        return triggerWin();
    }
}

function triggerWin() {
    bingoAchieved = true;
    overlay.classList.add("show");
    winSound.play().catch(() => console.warn("Sound blocked by browser policy."));
}

function resetWinState() {
    bingoAchieved = false;
    overlay.classList.remove("show");
    document.querySelectorAll(".line").forEach((line) => line.remove());
}

function drawLine(type, index) {
    const line = document.createElement("div");
    line.className = "line";
    const size = board.clientWidth;
    const cellSide = size / SIZE;

    if (type === "row") {
        line.style.width = "100%";
        line.style.top = index * cellSide + cellSide / 2 + "px";
        line.style.left = "0";
    } else if (type === "col") {
        line.style.width = "100%";
        line.style.top = "0";
        line.style.left = index * cellSide + cellSide / 2 + "px";
        line.style.transform = "rotate(90deg)";
    } else if (type === "diag1") {
        line.style.width = "141%";
        line.style.transform = "rotate(45deg)";
    } else if (type === "diag2") {
        line.style.width = "141%";
        line.style.top = "100%";
        line.style.transform = "rotate(-45deg)";
    }
    board.appendChild(line);
}

overlay.onclick = () => overlay.classList.remove("show");
