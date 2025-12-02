// OPEN POPUP WHEN CLICKING START BUTTON
document.querySelector(".btn").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("popup").style.display = "flex";
});

// CLOSE POPUP
document.getElementById("popupClose").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
});

// GO BUTTON → NEXT PAGE
document.getElementById("goBtn").addEventListener("click", function () {
    const name = document.getElementById("pirateName").value.trim();

    if (name === "") {
        alert("Please enter a pirate name!");
        return;
    }

    // Pass name through URL (or use localStorage)
    window.location.href = "WelcomeMsg.html?name=" + encodeURIComponent(name);
});
