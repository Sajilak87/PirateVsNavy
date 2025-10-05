
import DBConnection as db
import json as json
import random

def list_boats():
    with db.get_db() as (conn):
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, name, base_life, base_gold FROM boats ORDER BY id;")
        return cur.fetchall()

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

def list_random_airports():
        witdh
        db.get_db() as conn:
        cur = conn.cursor(dictionary=True)
        cur.execute("""
                SELECT Id,ident, name, iso_region 
                FROM airport 
                WHERE type = 'large_airport'
                ORDER BY RAND() 
                LIMIT 10;
            """)
        return cur.fetchall()

def airports_in_region(region: str):
    with db.get_db() as (conn):
        cur = conn.cursor()
        cur.execute("SELECT id, code, name FROM airport WHERE iso_region=%s ORDER BY code;", (region,))
        return cur.fetchall()