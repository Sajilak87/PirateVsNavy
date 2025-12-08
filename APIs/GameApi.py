
from flask import Flask, request, jsonify
from flask_cors import CORS

from ALLQueries import (
    create_pirate, get_pirate,list_boats,list_random_airports,update_pirate_stats,save_game_run,get_Summary
)
from GameEngine import GameEngine

engine = GameEngine()

app = Flask(__name__)


CORS(app)

@app.post("/api/create_pirate")
def create_pirate_api():
    data =request.get_json()

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


@app.post("/api/set-start")
def api_set_start():

    data = request.get_json()
    start_id = data.get("start_ident")
    airports = data.get("Ports")

    dest = engine.select_destination(start_id, airports)


    return jsonify({
        "start_airport_id": start_id,
        "dest_airport": dest
    })


@app.post("/api/routes")
def api_routes():
    data = request.get_json()
    airports = data.get("airports")
    start_id = data.get("start_airport_id")
    dest = data.get("dest_airport")



    if not airports or not start_id or not dest:
        return jsonify({"error": "Missing start/destination"}), 400

    routes = engine.generate_routes(
        selectedAirports=airports,
        start_airport_id=start_id,
        dest_airport_id=dest,
        n_routes=5
    )

    simple_routes = []
    for i, r in enumerate(routes, 1):
        path = [s["ident"] for s in r["stops"]]
        simple_routes.append({
            "index": i,
            "navy_meets": r["navy_meets"],
            "path": path
        })

    return jsonify({
        "start_airport_id": start_id,
        "dest_airport": dest,
        "routes": simple_routes
    })

@app.route("/api/choose-route", methods=["POST"])
def api_choose_route():
    data = request.get_json()
    idx = data.get("route_index")

    routes = data.get("routes")
    if not routes:
        return jsonify({"error": "No routes generated yet"}), 400

    try:
        idx = int(idx)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid route index"}), 400

    if not (1 <= idx <= len(routes)):
        return jsonify({"error": "Route index out of range"}), 400

    chosen = routes[idx - 1]

    return jsonify({
        "chosen_index": idx,
        "chosen_path": [s["ident"] for s in chosen["stops"]],
        "navy_meets": chosen["navy_meets"]
    })



@app.post("/api/game-state")
def api_game_state():
    data = request.get_json()
    pirate_id = data.get("pirate_id")

    p = get_pirate(pirate_id)

    return jsonify({
        "pirate": {
            "id": pirate_id,
            "name": p["pirate_name"],
            "boat": p["boat_name"]
        },
        "life": p["life"],
        "gold": p["gold"]
    })


@app.route("/api/next-encounter", methods=["POST"])
def api_next_encounter():
    data = request.get_json() or {}

    pirate_id = data.get("pirate_id")
    route = data.get("chosen_route") or {}
    start_id = data.get("start_id")
    dest_ident = data.get("dest_ident")

    if not pirate_id or not route:
        return jsonify({"error": "Missing game state"}), 400

    strategy = data.get("strategy")
    if strategy not in ("fight", "trade"):
        return jsonify({"error": "Invalid strategy"}), 400

    idx = data.get("encounter_index", 0)
    gold = data.get("curr_gold")
    life = data.get("curr_life")

    total = route.get("navy_meets", 0)

    if idx >= total or life is None or gold is None or life <= 0:
        return jsonify({"error": "No more encounters"}), 400

    gold, life, outcome = engine._encounter(strategy, gold, life)

    idx += 1
    done = (idx >= total) or (life <= 0)

    if done:
        update_pirate_stats(pirate_id, gold, life)

        chosen_route_simple = {
            "stops": route.get("path", []),
            "navy_meets": route.get("navy_meets", 0)
        }

        result_str = "success" if life > 0 else "death"

        save_game_run(
            pirate_id=pirate_id,
            start_airport_id=start_id,
            dest_airport_id=dest_ident,
            chosen_route=chosen_route_simple,
            result=result_str,
            final_gold=gold,
            final_life=life
        )

    return jsonify({
        "outcome": outcome,
        "life": life,
        "gold": gold,
        "encounters_done": idx,
        "total_encounters": total,
        "done": done
    })


@app.route("/api/summary", methods=["POST"])
def api_summary():
    data = request.get_json()
    pirate_id = data.get("Pirate_id")
    p = get_pirate(pirate_id)

    game_summary  = get_Summary(pirate_id)

    summary = {
        "pirate_name": p["pirate_name"],
        "boat_name": p["boat_name"],
        "start_airport_id": game_summary["start_airport_id"],
        "dest_airport": game_summary["dest_airport_id"],
        "route": game_summary["chosen_route"],
        "final_gold": game_summary["final_gold"],
        "final_life": game_summary["final_life"],
        "result": game_summary["result"]
    }
    if not summary:
        return jsonify({"error": "No summary"}), 400
    return jsonify(summary)



if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)