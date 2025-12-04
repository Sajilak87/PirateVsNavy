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

    // Choose button
    const chooseBtn = document.getElementById("chooseBtn");
    const boatInput = document.getElementById("boatInput");

    if (chooseBtn && boatInput) {
        chooseBtn.addEventListener("click", () => {
            const boat = boatInput.value.trim();

            if (!boat) {
                alert("Please choose a boat.");
            } else {
                alert("You selected: " + boat);
            }
        });
    }
});
