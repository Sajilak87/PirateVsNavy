import mysql.connector

def get_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='gamedb',  # your DB name
        user='root',                   # your MariaDB username
        password='907360270@aks',  # 🔥 your actual MariaDB password
        autocommit=True,
        auth_plugin="mysql_native_password"
    )


