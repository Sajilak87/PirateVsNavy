import random
from typing import Dict, Tuple

from ALLQueries import (
    list_boats, create_pirate, get_pirate, update_pirate_stats,
    list_regions, save_game_run, list_random_airports
)


class GameEngine:
    def __init__(self, rng_seed: int | None = None):
        self.rng = random.Random(rng_seed)

    def create_pirate_interactive(self):
        pirate_name = input("Enter your pirate name: ").strip() or "Nameless Corsair"
        boat_id = self.choose_boat_interactive()
        pirate_id = create_pirate(pirate_name, boat_id)
        p = get_pirate(pirate_id)
        print(f"\nAhoy {p['pirate_name']} aboard the {p['boat_name']}! "
              f"Starting with {p['life']} life and {p['gold']} gold.\n")
        return pirate_id

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

    def choose_region_interactive(self):
        regions = list_regions()
        print("=== Choose Region ===")
        for i, r in enumerate(regions, 1):
            print(f"{i}. {r}")
        while True:
            try:
                idx = int(input("Enter region number: ").strip())
                if 1 <= idx <= len(regions):
                    return regions[idx - 1]
                print("Invalid region number.")
            except ValueError:
                print("Please enter a number.")

    def choose_start_airport_form_list(self):
        airports = list_random_airports()
        return airports

    def choose_start_airport_interactive(self, region: list):

        print(f"\n=== Airports ===")
        for a in region:
            print(f"{a['ident']} - {a['name']}")
        while True:
            try:
                aid = input("Pick your START airport (code): ").strip()
                if any(a["ident"] == aid for a in region):
                    return aid
                print("Invalid airport id.")
            except ValueError:
                print("Please enter a number.")

    def select_destination(self, start_airport_id: str, airportList: list):

        available = [a for a in airportList if a["ident"] != start_airport_id]

        # Randomly pick one destination
        destination = random.choice(available)
        return destination

        # ----------- Route Generation -----------

    def _pick_intermediates(self, region: list, start_id: str, dest_id: str, max_hops: int):
        """Pick up to max_hops distinct airports (not start/dest) as waypoints."""
        candidates = [a for a in region if a["ident"] not in {start_id, dest_id}]
        self.rng.shuffle(candidates)
        hops = self.rng.randint(0, max_hops)
        return candidates[:hops]

    def generate_routes(self, selectedAirports: list, start_airport_id: str, dest_airport_id: str, n_routes: int = 4):

        aps_all = {a["ident"]: a for a in selectedAirports}
        start = aps_all[start_airport_id]
        dest = aps_all[dest_airport_id]

        routes = []
        for _ in range(n_routes):
            waypoints = self._pick_intermediates(selectedAirports, start["ident"], dest["ident"], max_hops=3)
            stops = [start] + waypoints + [dest]
            # Navy meets scale roughly with hops, plus randomness
            base_meets = max(1, len(stops) - 1)
            navy_meets = base_meets + self.rng.randint(0, 2)
            routes.append({"stops": stops, "navy_meets": navy_meets})
        return routes

    def _encounter(self, strategy: str, gold: int, life: int) -> Tuple[int, int, Dict]:

        outcome = {}
        if strategy == "fight":
            life_loss = self.rng.randint(5, 25)
            gold_gain = self.rng.randint(0, 40)
            life = max(0, life - life_loss)
            gold += gold_gain
            outcome = {"mode": "fight", "life_loss": life_loss, "gold_delta": +gold_gain}
        else:
            gold_loss = self.rng.randint(10, 40)
            life_loss = self.rng.randint(0, 8)
            gold = max(0, gold - gold_loss)
            life = max(0, life - life_loss)
            outcome = {"mode": "trade", "life_loss": life_loss, "gold_delta": -gold_loss}
        return gold, life, outcome

    def run_route_interactive(self, pirate_id: int, route: Dict):
        p = get_pirate(pirate_id)
        gold, life = p["gold"], p["life"]

        print("\n=== Route Selected ===")
        print(" -> ".join([s['ident'] for s in route["stops"]]))
        print(f"Navy will meet you {route['navy_meets']} time(s).")
        steps_log = []

        for i in range(1, route["navy_meets"] + 1):
            print(f"\nEncounter {i}/{route['navy_meets']}:")
            choice = ""
            while choice not in ("t", "f"):
                choice = input("Trade (t) or Fight (f)? ").strip().lower()
            strategy = "trade" if choice == "t" else "fight"
            gold, life, outcome = self._encounter(strategy, gold, life)
            steps_log.append(outcome)
            print(f"Outcome: {outcome['mode'].upper()} | Life change: -{outcome['life_loss']} | "
                  f"Gold change: {outcome['gold_delta']} | Current (Life={life}, Gold={gold})")
            if life <= 0:
                print("\n💀 Your crew has perished!")
                break
                # Save updated stats to pirate
        update_pirate_stats(pirate_id, gold, life)

        return {
                "final_gold": gold,
                "final_life": life,
                "steps_log": steps_log,
                "reached": life > 0,  # simple rule: reach destination if still alive
            }

    def print_summary(self, pirate_id: int, start: Dict, dest: Dict, route: Dict, result: Dict):
        p = get_pirate(pirate_id)
        print("\n========== VOYAGE SUMMARY ==========")
        print(f"Pirate : {p['pirate_name']}  |  Boat: {p['boat_name']}")
        print(f"Route  : {' -> '.join([s['ident'] for s in route['stops']])}")
        print(f"Encounters: {len(result['steps_log'])}")
        for idx, step in enumerate(result["steps_log"], 1):
            sign = "+" if step["gold_delta"] >= 0 else ""
            print(f"  {idx}. {step['mode'].title()} | Life -{step['life_loss']} | Gold {sign}{step['gold_delta']}")
        status = "🏴‍☠️ Found the treasure!" if result["reached"] else "💀 Lost at sea..."
        print(f"\nStatus : {status}")
        print(f"Final  : Life={result['final_life']} | Gold={result['final_gold']}")
        print("====================================\n")


    def play(self):

        pirate_id = self.create_pirate_interactive()

        airports = self.choose_start_airport_form_list()
        start_id = self.choose_start_airport_interactive(airports)
        dest = self.select_destination(start_id, airports)
        print(f"🏴‍☠️ Destination chosen: {dest['name']} ({dest['ident']})")

        routes = self.generate_routes(airports, start_id, dest["ident"], n_routes=4)
        print("\n=== Available Routes ===")

        for i, r in enumerate(routes, 1):
            path = " -> ".join([s["ident"] for s in r["stops"]])
            print(f"{i}. {path}   | Navy meets: {r['navy_meets']}")
        chosen = None
        while chosen is None:
            try:
                idx = int(input("Pick route number: ").strip())
                if 1 <= idx <= len(routes):
                    chosen = routes[idx - 1]
                else:
                    print("Invalid route number.")
            except ValueError:
                print("Please enter a number.")

                # Run encounters
        result = self.run_route_interactive(pirate_id, chosen)

        # Save summary
        save_game_run(
                pirate_id=pirate_id,
                start_airport_id=start_id,
                dest_airport_id=dest["ident"],
                chosen_route={"stops": [s["ident"] for s in chosen["stops"]], "navy_meets": chosen["navy_meets"]},
                result="success" if result["reached"] else "death",
                final_gold=result["final_gold"],
                final_life=result["final_life"]
            )

        # Print
        # Fetch start/dest dicts for summary
        start = next(s for s in chosen["stops"] if s["ident"] == start_id)
        self.print_summary(pirate_id, start, dest, chosen, result)







