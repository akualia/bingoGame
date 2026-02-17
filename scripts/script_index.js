let grid = document.getElementById("grid");
let popup = document.getElementById("popup");
let popupImg = document.getElementById("popup-img");

function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function openPopup(src) {
    popupImg.src = src;
    popup.style.display = "flex";
}

function closePopup() {
    popup.style.display = "none";
    popupImg.src = "";
}

function createBoard() {
    grid.innerHTML = "";
    let images = [];
    for (let i = 1; i <= 36; i++) images.push(`../assets/images/${i}.png`);

    shuffle(images);

    let colors = ["color1", "color2", "color3", "color4"];

    for (let i = 1; i <= 36; i++) {
        let cell = document.createElement("div");
        cell.className = "cell " + colors[(i - 1) % 4];

        let span = document.createElement("span");
        span.innerText = i;

        let img = document.createElement("img");
        img.src = images[i - 1];

        cell.onclick = () => {
            if (!cell.classList.contains("open")) {
                cell.classList.add("open");
            } else {
                openPopup(img.src);
            }
        };

        cell.appendChild(span);
        cell.appendChild(img);
        grid.appendChild(cell);
    }
}

function resetBoard() {
    createBoard();
}

createBoard();
