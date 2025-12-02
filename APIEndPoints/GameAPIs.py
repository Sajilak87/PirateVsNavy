from flask import Flask, request, jsonify

from ALLQueries import (
    list_boats, create_pirate, get_pirate, update_pirate_stats,
    list_regions, save_game_run, list_random_airports
)


app = Flask(__name__)

@app.post("/create_pirate")
def create_pirate_api():
    data = request.get_json()


    if not data or "pirate_name" not in data:
        return jsonify({"error": "pirate_name is required"}), 400

    pirate_name = data.get("pirate_name", "Nameless Corsair")
    boat_id = choose_boat_interactive()

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

@app.get("/RandomPorts")
def choose_start_airport_api():
    airports = list_random_airports()
    return jsonify(airports)


def choose_boat_interactive(self):
    boats = list_boats()
    print("\n=== Choose your Pirate Boat ===")
    for b in boats:
        print(f"{b['id']}. {b['name']}  (Life {b['base_life']}, Gold {b['base_gold']})")
    while True:
        try:
            boat_id = int(input("Enter boat number: ").strip())
            if any(b["id"] == boat_id for b in boats):
                return boat_id
            print("Invalid boat number.")
        except ValueError:
            print("Please enter a number.")

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)