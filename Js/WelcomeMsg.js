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

    setTimeout(showPopup, 1600); // wait for move animation
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

// Start animation
setTimeout(moveShip, 700);


// This runs after the HTML is parsed because of "defer"
const homeBtn = document.getElementById("homeBtn");
if (homeBtn) {
    homeBtn.addEventListener("click", function () {
        // Home.html is in the same folder as WelcomeMsg.html
        window.location.href = "Home.html";
    });
}

// (optional) Back button logic
const backBtn = document.getElementById("backBtn");
if (backBtn) {
    backBtn.addEventListener("click", function () {
        window.history.back();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Wait 5 seconds
    setTimeout(() => {
        // Redirect to boats page
        window.location.href = "Boats.html";
    }, 5000);
});
