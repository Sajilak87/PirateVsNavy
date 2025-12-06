const ship = document.getElementById("ship");
const popup = document.getElementById("popup");
const closePopupBtn = document.getElementById("closePopup");

const fightBtn = document.querySelector(".game-btn.fight");
const tradeBtn = document.querySelector(".game-btn.trade");

const enemyHpFill = document.getElementById("enemyHpFill");
const lootFill = document.getElementById("lootFill");
const outcomeMsg = document.getElementById("outcomeMsg");

const points = [
    { x: 80,  y: 260 },
    { x: 220, y: 150 },
    { x: 380, y: 200 },
    { x: 550, y: 120 },
    { x: 720, y: 240 }
];

let currentPoint = 0;

let totalEncounters = 0;
let encountersDone = 0;
let gameFinished = false;

// ----- INITIAL GAME STATE FROM BACKEND -----
function loadGameState() {
    fetch("http://127.0.0.1:5000/api/game-state")
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }
            totalEncounters = data.total_encounters;
            encountersDone = data.encounters_done || 0;

            moveShipToPoint(0);

            setTimeout(moveShip, 700);
        })
        .catch(err => {
            console.error("Error loading game state:", err);
        });
}

function moveShipToPoint(index) {
    if (index < 0 || index >= points.length) return;
    const p = points[index];
    ship.style.left = p.x + "px";
    ship.style.top = p.y + "px";
}

function moveShip() {
    if (gameFinished) return;
    if (currentPoint >= points.length) return;

    moveShipToPoint(currentPoint);

    if (currentPoint > 0) {
        setTimeout(showPopup, 600);
    } else {
        currentPoint++;
        setTimeout(moveShip, 1600);
    }
}

function showPopup() {
    if (encountersDone >= totalEncounters) {
        currentPoint++;
        setTimeout(moveShip, 300);
        return;
    }

    outcomeMsg.textContent = `Encounter ${encountersDone + 1} of ${totalEncounters}`;
    enemyHpFill.style.width = "100%";
    lootFill.style.width = "50%";
    popup.style.display = "block";
}

function closePopup() {
    popup.style.display = "none";

    if (gameFinished) {
        window.location.href = "../GameSummary.html";
        return;
    }

    currentPoint++;
    setTimeout(moveShip, 300);
}

function sendChoice(strategy) {
    // strategy = "fight" or "trade"
    fetch("/api/next-encounter", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({strategy})
    })
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
                return;
            }

            encountersDone = data.encounters_done;
            gameFinished = data.done;

            const out = data.outcome;
            // Example from backend: out = { mode, life_loss, gold_delta }
            outcomeMsg.textContent =
                `${out.mode.toUpperCase()} | Life -${out.life_loss}, Gold ${out.gold_delta >= 0 ? "+" : ""}${out.gold_delta}`;

            // Just a simple visual: shrink HP bar, change loot
            enemyHpFill.style.width = Math.max(0, 100 - out.life_loss * 2) + "%";
            lootFill.style.width = (50 + out.gold_delta) + "%";

            // After short delay, close popup and move on
            setTimeout(() => {
                closePopup();
            }, 1000);
        })
        .catch(err => {
            console.error("Error sending choice:", err);
            alert("Error talking to server.");
        });
}

// ----- EVENT HANDLERS -----
closePopupBtn.onclick = closePopup;

fightBtn.addEventListener("click", function () {
    sendChoice("fight");
});

tradeBtn.addEventListener("click", function () {
    sendChoice("trade");
});

// ----- START -----
loadGameState();
