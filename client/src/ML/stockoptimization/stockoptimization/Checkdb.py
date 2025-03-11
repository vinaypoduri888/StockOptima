import sqlite3

# Path to the database
db_path = r"Final-Year-Project-main\Final-Year-Project-main\StockOptimus_V2\client\src\ML\stockoptimization\stockoptimization\StockBuffer.db"

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Execute query to fetch all rows from stock_data table
cursor.execute("SELECT * FROM stock_data")
rows = cursor.fetchall()

# Print all rows
if rows:
    for row in rows:
        print(row)
else:
    print("No data found in stock_data.")

conn.close()
