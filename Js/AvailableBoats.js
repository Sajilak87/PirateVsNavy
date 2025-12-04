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

    // Choose boat
    const chooseBtn = document.getElementById("chooseBoatBtn");
    const boatNumberInput = document.getElementById("boatNumber");

    if (chooseBtn && boatNumberInput) {
        chooseBtn.addEventListener("click", () => {
            const n = parseInt(boatNumberInput.value, 10);

            if (Number.isNaN(n) || n < 1 || n > 4) {
                alert("Please enter a boat number from 1 to 4.");
                return;
            }

            // For now just show which boat was chosen.
            // Later you can connect this to backend.
            const names = [
                "Sea Serpent",
                "Black Gull",
                "Crimson Tide",
                "Iron Leviathan"
            ];

            alert("You chose: " + names[n - 1]);
        });
    }
});
