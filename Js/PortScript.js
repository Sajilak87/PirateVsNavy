window.addEventListener("load",() => {
let portsContainer = document.getElementById("ports");
const mapContainer = document.getElementById("mapContainer") || document.body;

if (!portsContainer) {
console.warn('No element with id="ports" found - creating one automatically.');
portsContainer = document.createElement("div");
portsContainer.id = "ports";
portsContainer.style.position = "absolute";
portsContainer.style.inset = "0";
portsContainer.style.pointerEvents = "none";
mapContainer.appendChild(portsContainer);
}

const map = document.getElementById("map");
  if (!map) {
    console.warn('No element with id="map" found. Ports will still be created inside #mapContainer, but position may be off.');
  } else {
  const parent = map.parentElement;
    if (parent && getComputedStyle(parent).position === "static") {
      parent.style.position = "relative";
    }
  }
const frag = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const port = document.createElement("div");
  port.classList.add("port");



window.addEventListener("load", () => {
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

        portsContainer.appendChild(port);

    }

});