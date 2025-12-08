

document.addEventListener("DOMContentLoaded", () => {
    // Home button

    const name = sessionStorage.getItem("PirateName");
    document.getElementById("username").innerText = name;
    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            window.location.href = "Home.html";
        });
    }

    // Back button
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.history.back();
        });
    }

    // Load boats from API
    loadBoats();



});

// ----------------------
// LOAD BOATS FROM API
// ----------------------
async function loadBoats() {
    const listContainer = document.getElementById("boatList");
    if (!listContainer) return;

    try {
        const response = await fetch("http://127.0.0.1:5000/api/boats");
        const data = await response.json();
        const boats = data.boats;

        listContainer.innerHTML = "";

        boats.forEach((boat, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="boat-number">${index + 1}.</span>
                <span class="boat-name">${boat.name}</span>
                <span class="boat-stats">(Life ${boat.base_life}, Gold ${boat.base_gold})</span>
            `;
            listContainer.appendChild(li);
        });

        // Set max boat number for input
        const input = document.getElementById("boatNumber");
        if (input) {
            input.max = boats.length;
        }

    } catch (err) {
        console.error("Boat API error:", err);
        listContainer.innerHTML =
            "<li>Error: Could not load boats from API.</li>";
    }
}


const chooseBtn1 = document.getElementById("chooseBoatBtn");
const boatNumberInput1 = document.getElementById("boatNumber");
// When user clicks GO
if (chooseBtn1 && boatNumberInput1) {
    chooseBtn1.addEventListener("click", async () => {
        const n = parseInt(boatNumberInput1.value, 10);
        const max = parseInt(boatNumberInput1.max || "0", 10);

        if (Number.isNaN(n) || n < 1 || n > max) {
            alert(`Please enter a boat number from 1 to ${max}.`);
            return;
        }

        // Get selected boat name from the list
        const listItems = document.querySelectorAll("#boatList li");
        const chosenLi = listItems[n - 1];
        const pirateName = sessionStorage.getItem("PirateName");

        // ----- NEW: CALL CREATE PIRATE API -----
        try {
            const res = await fetch("http://127.0.0.1:5000/api/create_pirate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pirate_name: pirateName,
                    boat_id: n,

                })
            });

            const result = await res.json();

            if (res.ok) {
                //alert("Pirate created! ID = " + result.pirate_id);
                sessionStorage.setItem("PirateId",result.pirate_id)
                 window.location.href = "SelectAPort.html";
            } else {
                alert("Error: " + result.error);
            }

        } catch (err) {
            console.error(err);
        }

    });
}
