import sqlite3
import pandas as pd
import os

# ------------------- Paths -------------------
# Use raw strings (r"") to avoid escape sequence errors
db_path = r"Final-Year-Project-main\Final-Year-Project-main\StockOptimus_V2\client\src\ML\stockoptimization\stockoptimization\StockBuffer.db"
excel_path = r"Final-Year-Project-main\Final-Year-Project-main\StockOptimus_V2\client\src\ML\stockoptimization\stockoptimization\output.xlsx"

# Ensure directory exists
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# ------------------- Create Database & Table -------------------
def create_table():
    """Create the stock_data table if it doesn't already exist."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS stock_data (
        state TEXT,
        commodity TEXT,
        stockBuffer REAL,
        seasonality_factor REAL DEFAULT 1.0
    );
    ''')

    conn.commit()
    conn.close()
    print("Database initialized and table verified.")

# ------------------- Insert Data from Excel -------------------
def insert_data_from_excel():
    """Insert rows from Excel into stock_data table."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Read Excel file into DataFrame
    df = pd.read_excel(excel_path)

    # Ensure correct column names
    if not {'states/uts', 'commodity', 'stockBuffer'}.issubset(df.columns):
        print("Error: Excel file doesn't have the required columns.")
        conn.close()
        return

    # Rename columns to match database schema
    df.rename(columns={'states/uts': 'state', 'commodity': 'commodity', 'stockBuffer': 'stockBuffer'}, inplace=True)

    # Insert rows into stock_data
    for _, row in df.iterrows():
        cursor.execute('''
        INSERT INTO stock_data (state, commodity, stockBuffer) 
        VALUES (?, ?, ?)
        ''', (row['state'], row['commodity'], row['stockBuffer']))

    conn.commit()
    conn.close()
    print(f"Data from {excel_path} inserted successfully.")

# ------------------- Main Execution -------------------
def main():
    create_table()  # Ensure table exists
    insert_data_from_excel()  # Populate data

if __name__ == "__main__":
    main()
