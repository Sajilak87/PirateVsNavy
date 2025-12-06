document.addEventListener("DOMContentLoaded", () => {
    // Home button
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

    const chooseBtn = document.getElementById("chooseBoatBtn");
    const boatNumberInput = document.getElementById("boatNumber");

    // When user clicks GO
    if (chooseBtn && boatNumberInput) {
        chooseBtn.addEventListener("click", () => {
            const n = parseInt(boatNumberInput.value, 10);

            const max = parseInt(boatNumberInput.max || "0", 10);

            if (Number.isNaN(n) || n < 1 || n > max) {
                alert(`Please enter a boat number from 1 to ${max}.`);
                return;
            }

            // Get selected boat name from the list
            const listItems = document.querySelectorAll("#boatList li");
            const chosenLi = listItems[n - 1];
            const nameSpan = chosenLi.querySelector(".boat-name");
            const chosenName = nameSpan.textContent;

            alert("You selected: " + chosenName);

            // later: save selected boat to localStorage or send to API
        });
    }
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
