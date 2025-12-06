const SUMMARY_API = "http://127.0.0.1:5000/api/summary";

function getPirateId() {
    const stored = Number(localStorage.getItem("pirate_id"));
    return Number.isFinite(stored) ? stored : 1;
}

async function fetchSummary(pirateId) {
    const payload = { pirate_id: pirateId };

    let response = await fetch(SUMMARY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        response = await fetch(`${SUMMARY_API}?pirate_id=${encodeURIComponent(pirateId)}`);
    }

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Summary request failed (${response.status}): ${text}`);
    }

    return response.json();
}

function safeParseRoute(routeValue) {
    if (!routeValue) return null;
    if (typeof routeValue === "object") return routeValue;
    try {
        return JSON.parse(routeValue);
    } catch (err) {
        console.warn("Could not parse route JSON:", err);
        return null;
    }
}

function renderSummary(data) {
    const pirateNameEl = document.getElementById("pirateName");
    const boatNameEl = document.getElementById("boatName");
    const routeSummaryEl = document.getElementById("routeSummary");
    const encounterCountEl = document.getElementById("encounterCount");
    const encounterListEl = document.getElementById("encounterList");
    const statusTextEl = document.getElementById("statusText");
    const finalLifeEl = document.getElementById("finalLife");
    const finalGoldEl = document.getElementById("finalGold");

    const route = safeParseRoute(data.route);
    const stops = route?.stops || route?.path || [];
    const routeText = stops.length
        ? stops.join(" ➜ ")
        : `${data.start_airport_id || "??"} ➜ ${data.dest_airport || "??"}`;

    if (pirateNameEl) pirateNameEl.textContent = data.pirate_name || "Unknown pirate";
    if (boatNameEl) boatNameEl.textContent = data.boat_name || "Unknown boat";
    if (routeSummaryEl) routeSummaryEl.textContent = routeText;

    const encounterCount = route?.navy_meets ?? "-";
    if (encounterCountEl) encounterCountEl.textContent = encounterCount;

    if (encounterListEl) {
        encounterListEl.innerHTML = "";
        const li = document.createElement("li");
        li.textContent = "Encounter details not provided by API.";
        encounterListEl.appendChild(li);
    }

    if (statusTextEl) statusTextEl.textContent = data.result || "No result recorded.";
    if (finalLifeEl) finalLifeEl.textContent = `❤️ Life = ${data.final_life ?? "?"}`;
    if (finalGoldEl) finalGoldEl.textContent = `💰 Gold = ${data.final_gold ?? "?"}`;
}

async function loadSummary() {
    try {
        const data = await fetchSummary(getPirateId());
        if (data.error) {
            throw new Error(data.error);
        }
        renderSummary(data);
    } catch (err) {
        console.error("Failed to load summary:", err);
        const statusTextEl = document.getElementById("statusText");
        if (statusTextEl) statusTextEl.textContent = "Unable to load summary.";
    }
}

document.addEventListener("DOMContentLoaded", loadSummary);