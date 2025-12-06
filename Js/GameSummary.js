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
