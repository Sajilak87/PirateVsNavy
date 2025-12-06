window.addEventListener("load", async () => {
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
    const res = await fetch("/api/airports");
    airports = await res.json();
  } catch (err) {
    console.error("Failed to fetch airports:", err);
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

    port.title = airport.name;

    port.addEventListener("Click", async (e) => {
      e.stopPropagation();
      alert(`Port Selected! (#${i + 1} - ${airport.ident})`);
      try {
        const startRes = await fetch("/api/set-start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start_ident: airport.ident,
            Ports: airports
          })
        });

        const startData = await startRes.json();
        console.log("Start airport set:", startData);

        const routesRes = await fetch("/api/routes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            airports,
            start_airport_id: startData.start_airport_id,
            dest_airport: startData.dest_airport
          })
        });



  }







    });
    frag.appendChild(port);
  }

  portsContainer.appendChild(frag);

})