PortScript.js
--------------------
window.addEventListener("DOMContentLoaded", async () => {

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


  let airports = [];
  try {
    const res = await fetch("http://127.0.0.1:5000/api/airports");
    const data = await res.json();
    console.log("Airports API response:", data);

    if (Array.isArray(data)) {
      airports = data;
    } else if (Array.isArray(data.airports)) {
      airports = data.airports;
    } else {
      console.error("Unexpected airports response shape:", data);
    }
  } catch (err) {
    console.error("Failed to fetch airports:", err);
  }


  if (!airports || airports.length === 0) {
    console.warn("No airports received from API.");
    return;
  }


  const frag = document.createDocumentFragment();

  airports.forEach((airport, i) => {
    const port = document.createElement("div");
    port.classList.add("port");
    port.style.position = "absolute";
    port.style.pointerEvents = "auto";

    const x = Math.random() * 90 + 5;
    const y = Math.random() * 90 + 5;
    port.style.left = x + "%";
    port.style.top = y + "%";

     port.title = airport.name || airport.ident || `Airport ${i + 1}`;

    port.addEventListener("click", async (e) => {
      e.stopPropagation();

      try {
      sessionStorage.setItem("StartingPort",airport.ident);

      sessionStorage.setItem("PortList", JSON.stringify(airports));

      window.location.href = "AvailableRoutes.html";

      } catch (err) {
        console.error("Error selecting port or fetching routes:", err);
      }
    });

    frag.appendChild(port);
  });

  portsContainer.appendChild(frag);
});