const ship = document.getElementById("ship");
const popup = document.getElementById("popup");
const closePopupBtn = document.getElementById("closePopup");

// Coordinates of the points
const points = [
    { x: 80,  y: 260 },
    { x: 220, y: 150 },
    { x: 380, y: 200 },
    { x: 550, y: 120 },
    { x: 720, y: 240 }
];

let currentPoint = 0;

function moveShip() {
    if (currentPoint >= points.length) return;

    const p = points[currentPoint];
    ship.style.left = p.x + "px";
    ship.style.top = p.y + "px";

    if (currentPoint > 0) {
        setTimeout(showPopup, 1600);
    }
    else {
        currentPoint++;
        setTimeout(moveShip, 1600);
    }

}

function showPopup() {
    popup.style.display = "block";
}

function closePopup() {
    popup.style.display = "none";
    currentPoint++;
    setTimeout(moveShip, 300);
}

closePopupBtn.onclick = closePopup;


setTimeout(moveShip, 700);
