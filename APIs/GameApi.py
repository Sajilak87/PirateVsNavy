from flask import Flask, request, jsonify

from ALLQueries import (
    create_pirate, get_pirate,list_boats,list_random_airports
)


app = Flask(__name__)


@app.post("/api/create_pirate")
def create_pirate_api():
    data = request.json

    pirate_name = data.get("pirate_name", "Nameless Corsair")
    boat_id = data.get("boat_id")

    if boat_id is None:
        return jsonify({"error": "boat_id is required"}), 400

    pirate_id = create_pirate(pirate_name, boat_id)

    pirate = get_pirate(pirate_id)

    response = {
        "pirate_id": pirate_id,
        "pirate_name": pirate["pirate_name"],
        "boat_name": pirate["boat_name"],
        "life": pirate["life"],
        "gold": pirate["gold"],
        "message": f"Ahoy {pirate['pirate_name']} aboard the {pirate['boat_name']}!"
    }

    return jsonify(response)

@app.get("/api/boats")
def get_boats():
    boats = list_boats()
    return jsonify({"boats": boats})

@app.get("/api/airports")
def get_airports():
    airports = list_random_airports()
    return jsonify(airports)

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)