import DBConnection as db
import json as json
import random

def create_pirate(pirate_name: str, boat_id: int):
    with db.get_db() as (conn):
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT base_life, base_gold FROM boats WHERE id=%s", (boat_id,))
        row = cur.fetchone()
        if not row:
            raise ValueError("Invalid boat_id")
        cur.execute(
            "INSERT INTO pirates (pirate_name, boat_id, gold, life) VALUES (%s, %s, %s, %s)",
            (pirate_name, boat_id, row["base_gold"], row["base_life"]),
        )
        return cur.lastrowid

def get_pirate(pirate_id: int):
    with db.get_db() as (conn):
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT p.id, p.pirate_name, p.gold, p.life, b.name AS boat_name
            FROM pirates p
            JOIN boats b ON p.boat_id=b.id
            WHERE p.id=%s
        """, (pirate_id,))
        row = cur.fetchone()
        if not row:
            raise ValueError("Pirate not found")
        return row