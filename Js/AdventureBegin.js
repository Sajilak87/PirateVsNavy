document.addEventListener("DOMContentLoaded", () => {
    const map = document.getElementById("map-preview");
    if (!map) return;

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
    const points = PATH_PRESETS[navyMeets] || PATH_PRESETS[1];

    renderPoints(map, points);
    renderShips(map, points);
});

function renderPoints(mapEl, points) {
    mapEl.innerHTML = "";
    points.forEach((p) => {
        const dot = document.createElement("div");
        dot.className = "point";
        dot.style.left = `${p.x}px`;
        dot.style.top = `${p.y}px`;
        mapEl.appendChild(dot);
    });
}

function renderShips(mapEl, points) {
    points.forEach((p) => {
        const ship = document.createElement("img");
        ship.src = "Images/pirate-ship.png";
        ship.alt = "Ship";
        ship.className = "preview-ship";
        ship.style.left = `${p.x}px`;
        ship.style.top = `${p.y}px`;
        mapEl.appendChild(ship);
    });
}