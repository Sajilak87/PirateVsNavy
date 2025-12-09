document.addEventListener("DOMContentLoaded", () => {
      const name = sessionStorage.getItem("PirateName");
    document.getElementById("username").innerText = name;
    loadSummary();
});

async function loadSummary() {
    const pirateId = Number(sessionStorage.getItem("PirateId"));

    if (!pirateId) {
        console.error("No PirateId in sessionStorage");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:5000/api/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Pirate_id: pirateId })
        });

        if (!res.ok) {
            console.error("Summary API error:", res.status);
            console.error(await res.text());
            return;
        }

        const data = await res.json();
        console.log("Summary data:", data);

        if (data.error) {
            console.error("API error:", data.error);
            return;
        }

        fillSummaryUI(data);

    } catch (err) {
        console.error("Error loading summary:", err);
    }
}

function fillSummaryUI(summary) {
    // Basic info
    document.getElementById("pirateName").textContent = summary.pirate_name || "Unknown";
    document.getElementById("boatName").textContent = summary.boat_name || "Unknown";

    // Route summary
    let routeText = "";
    let encounterCount = 0;

    let routeObj = summary.route;

    if (typeof routeObj === "string") {
        try {
            routeObj = JSON.parse(routeObj);
        } catch (e) {
        }
    }

    if (routeObj && Array.isArray(routeObj.stops)) {
        routeText = routeObj.stops.join(" ➜ ");
        encounterCount = routeObj.navy_meets || 0;
    } else if (Array.isArray(routeObj)) {
        routeText = routeObj.join(" ➜ ");
    } else if (typeof routeObj === "string") {
        routeText = routeObj;
    } else {
        routeText = "Unknown route";
    }

    document.getElementById("routeSummary").textContent = routeText;
    document.getElementById("encounterCount").textContent = encounterCount;

    const statusEl = document.getElementById("statusText");
    if (summary.result === "success") {
        statusEl.textContent = "✨ Found the treasure!";
    } else if (summary.result === "death") {
        statusEl.textContent = "💀 Ship lost at sea...";
    } else {
        statusEl.textContent = "Voyage completed.";
    }

    document.getElementById("finalLife").textContent =
        `❤️ Life = ${summary.final_life}`;
    document.getElementById("finalGold").textContent =
        `💰 Gold = ${summary.final_gold}`;

    const list = document.getElementById("encounterList");
    list.innerHTML = "";

    if (encounterCount > 0) {
        const li = document.createElement("li");
        li.textContent = `Total encounters: ${encounterCount}`;
        list.appendChild(li);
    } else {
        const li = document.createElement("li");
        li.textContent = "No encounters recorded.";
        list.appendChild(li);
    }
}