import mysql.connector

# Establish database connection
def get_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='piratevsnavy_game',
        user='root',
        password='password',
        autocommit=True
    )