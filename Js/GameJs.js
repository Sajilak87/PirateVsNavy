const ship = document.getElementById("ship");
const popup = document.getElementById("popup");
const closePopupBtn = document.getElementById("closePopup");

const fightBtn = document.querySelector(".game-btn.fight");
const tradeBtn = document.querySelector(".game-btn.trade");

const outcomeMsg = document.getElementById("outcomeMsg");

const mapDiv = document.getElementById("map");

const PATH_PRESETS = {
    1: [
        { x: 100, y: 280 },
        { x: 290, y: 200 }
    ],

    2: [
        { x: 120, y: 260 },
        { x: 250, y: 140 },
        { x: 420, y: 230 }
    ],

    3: [
        { x: 90,  y: 300 },
        { x: 240, y: 180 },
        { x: 380, y: 260 },
        { x: 550, y: 150 }
    ],

    4: [
        { x: 110, y: 260 },
        { x: 220, y: 120 },
        { x: 360, y: 110 },
        { x: 520, y: 150 },
        { x: 700, y: 260 }
    ],

    5: [
        { x: 80,  y: 180 },
        { x: 180, y: 300 },
        { x: 310, y: 180 },
        { x: 440, y: 300 },
        { x: 580, y: 180 },
        { x: 720, y: 260 }
    ]
};

const navyMeets = Number(sessionStorage.getItem("NavyMeets")) || 1;

let points = PATH_PRESETS[navyMeets] || PATH_PRESETS[1];

let currentPoint = 0;

let totalEncounters = navyMeets;
let encountersDone = 0;
let gameFinished = false;


function drawPoints() {
      const name = sessionStorage.getItem("PirateName");
    document.getElementById("username").innerText = name;
    points.forEach(p => {
        const dot = document.createElement("div");
        dot.className = "point";
        dot.style.left = p.x + "px";
        dot.style.top = p.y + "px";
        mapDiv.appendChild(dot);
    });
}

function loadGameState() {
    const pirateId = Number(sessionStorage.getItem("PirateId"));

    fetch("http://127.0.0.1:5000/api/game-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            pirate_id: pirateId
        })
    })
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }
               // Initial stats
         life = data.life;
         gold = data.gold;

        document.getElementById("lifeValue").textContent = life;
        document.getElementById("goldValue").textContent = gold;

        encountersDone = data.encounters_done || 0;

        // Start movement
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
    popup.style.display = "block";
}

function closePopup() {
    popup.style.display = "none";

    if (gameFinished) {
        window.location.href = "GameSummary.html";
        return;
    }

    currentPoint++;
    setTimeout(moveShip, 300);
}

 function sendChoice(strategy) {
    const pirateId = Number(sessionStorage.getItem("PirateId"));
    const chosenRouteStr = sessionStorage.getItem("SelectedRoute");
    const chosenRoute = chosenRouteStr ? JSON.parse(chosenRouteStr) : null;

    const startId = sessionStorage.getItem("StartingPort");
    const destStr = sessionStorage.getItem("DestinationPort");
    const destObj = destStr ? JSON.parse(destStr) : null;

    fetch("http://127.0.0.1:5000/api/next-encounter", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            pirate_id: pirateId,
            chosen_route: chosenRoute,
            start_id: startId,
            dest_ident: destObj ? destObj.ident : null,
            strategy: strategy,
            encounter_index: encountersDone,
            curr_gold: gold,
            curr_life: life
        })
    })
        .then(async (r) => {
            if (!r.ok) {
                const txt = await r.text();
                console.error("next-encounter error:", r.status, txt);
                alert("Server error " + r.status);
                return null;
            }
            return r.json();
        })
        .then(data => {
            if (!data) return;
            if (data.error) {
                alert("Error: " + data.error);
                return;
            }

            encountersDone = data.encounters_done;
            gameFinished = data.done;

            const out = data.outcome;
            outcomeMsg.textContent =
                `${out.mode.toUpperCase()} | Life -${out.life_loss}, Gold ${out.gold_delta >= 0 ? "+" : ""}${out.gold_delta}`;

            life = data.life;
            gold = data.gold;

            document.getElementById("lifeValue").textContent = life;
            document.getElementById("goldValue").textContent = gold;

            setTimeout(() => {
                closePopup();
            }, 1000);
        })
        .catch(err => {
            console.error("Error sending choice:", err);
        });
}


closePopupBtn.onclick = closePopup;

fightBtn.addEventListener("click", function () {
    sendChoice("fight");
});

tradeBtn.addEventListener("click", function () {
    sendChoice("trade");
});


drawPoints();
loadGameState();
