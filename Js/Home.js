// Close button functionality
document.getElementById("closeBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to close the page?")) {
        window.close();
    }
});
