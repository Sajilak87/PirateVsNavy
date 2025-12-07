// Close button functionality
document.getElementById("closeBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to close the page?")) {
        window.close();
    }
});

document.getElementById("startBtn").addEventListener("click", function () {
    // Load popup HTML dynamically
    fetch("Popup_Box.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("popupContainer").innerHTML = data;

            // Show popup
            document.querySelector(".popup-overlay").style.display = "flex";

            // Close button
            document.getElementById("popupClose").onclick = () => {
                document.querySelector(".popup-overlay").style.display = "none";
            };

            // Submit button → go to Welcome page
            document.getElementById("goBtn").onclick = () => {
                const name = document.getElementById("pirateName").value.trim();
                if (name === "") {
                    alert("Enter Pirate’s Name!");
                    return;
                }

                sessionStorage.setItem("PirateName",name);

                // Redirect to group member's welcome UI
                window.location.href = "WelcomeMsg.html";
            };
        });
});

async function registerPirate(pirateName) {
    const response = await fetch("http://127.0.0.1:5000/api/create_pirate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            pirate_name: pirateName
        })
    });

    const data = await response.json();
    return data;
}

