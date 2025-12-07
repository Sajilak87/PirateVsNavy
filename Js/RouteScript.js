window.addEventListener("DOMContentLoaded", () => {
    SelectDestination();
    });

async function SelectDestination() {
    const PortList = JSON.parse(sessionStorage.getItem("PortList"));
    const startAirportId = sessionStorage.getItem("StartingPort");

    if (!startAirportId) {
        console.error("Missing pirateId or startAirportId in sessionStorage");
        return;
    }

    try {
        const setStartRes = await fetch("http://127.0.0.1:5000/api/set-start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                start_ident: startAirportId,
                Ports : PortList

            })
        });

        if (!setStartRes.ok) {
            console.error("Failed to set start:", setStartRes.status);
            const errText = await setStartRes.text();
            console.error("Response text:", errText);
            return;
        }


        const setStartData = await setStartRes.json();
        const destinationPort = setStartData.dest_airport;
        sessionStorage.setItem("DestinationPort", JSON.stringify(destinationPort));

        loadAvailableRoutes();


    } catch (err) {
        console.error("Error in SelectDestination:", err);
    }
}

async function loadAvailableRoutes() {
    const PortListStr = sessionStorage.getItem("PortList");
    const startAirportId = sessionStorage.getItem("StartingPort");
    const destStr = sessionStorage.getItem("DestinationPort");

    const airports = JSON.parse(PortListStr);
    const destObj = JSON.parse(destStr);      // we stored this with JSON.stringify()
    const destIdent = destObj.ident;


    try {
        const response = await fetch("http://127.0.0.1:5000/api/routes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                airports: airports,
                start_airport_id: startAirportId,
                dest_airport: destIdent
            })
        });

        if (!response.ok) {
            console.error("Route API error:", response.status);
            console.error(await response.text());
            return;
        }

        const data = await response.json();
        console.log("Routes:", data);

        renderRoutes(data.routes);

    } catch (err) {
        console.error("Error loading routes:", err);
    }
}

function renderRoutes(routes) {
    const list = document.getElementById("routeList");
    list.innerHTML = "";

    routes.forEach(route => {
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.href = "#";

        const pathText = route.path.join(" -> ");
        a.textContent = `${route.index}. ${pathText}  |  Navy meets: ${route.navy_meets}`;

        a.addEventListener("click", () => {
            sessionStorage.setItem("SelectedRouteIndex", route.index);
            sessionStorage.setItem("NavyMeets",route.navy_meets);

            sessionStorage.setItem("SelectedRoute", JSON.stringify(route));

            window.location.href = "GamePlay.html";
        });

        li.appendChild(a);
        list.appendChild(li);
    });
}



