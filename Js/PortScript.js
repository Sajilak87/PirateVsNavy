const portsContainer = document.getElementById("Ports");
const map = document.getElementById("Map");

map.onload = () => {
    for (let i = 0; i < 10; i++) {
        const port = document.createElement("div");
        port.classList.add("Port");

        const x = Math.random() * 90 + 5;
        const y = Math.random() * 90 + 5;

        port.style.left = x + "%";
        port.style.top = y + "%";

        port.addEventListener("Click", () => {
             alert(`Port Selected! (#${i + 1})`);
        });





        }

}