

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


def play(self):
    # Create pirate
    pirate_id = self.create_pirate_interactive()

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


    def choose_start_airport_interactive(self, region: str):

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

    def select_destination(self,start_airport_id: str, airportList: list):

        available = [a for a in airportList if a["ident"] != start_airport_id]

        # Randomly pick one destination
        destination = random.choice(available)
        return destination

        # Region & airports
        airports = self.choose_start_airport_form_list()
        start_id = self.choose_start_airport_interactive(airports)


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

