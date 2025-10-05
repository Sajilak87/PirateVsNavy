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
