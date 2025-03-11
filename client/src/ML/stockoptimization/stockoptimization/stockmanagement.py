import sqlite3
import json
import google.generativeai as genai
from datetime import datetime
import os

# ------------------- Gemini API Key -------------------
genai.configure(api_key="AIzaSyCxjqKQjzxxZT97hnpuP74RLAoM_ZYk8W0")

# ------------------- SQLite Database Connection -------------------
def connect_sqlite():
    """Connect to the StockBuffer SQLite database using the correct path."""
    db_path = os.path.join(os.path.dirname(__file__), 'StockBuffer.db')
    print(f"Connecting to database at: {db_path}")
    return sqlite3.connect(db_path)


# ------------------- Fetch Stock Buffer & Seasonality -------------------
def fetch_stock_data(state, commodity):
    """Retrieve stock buffer and seasonality data for the given state and commodity."""
    conn = connect_sqlite()
    cursor = conn.cursor()

    # Add a 'seasonality_factor' column to the database if not already there
    query = """
    SELECT stockBuffer, seasonality_factor FROM stock_data
    WHERE state = ? AND commodity = ?
    """
    cursor.execute(query, (state, commodity))
    result = cursor.fetchone()

    conn.close()
    return result if result else (None, None)

# ------------------- Update Stock Buffer -------------------
def update_stock_buffer(state, commodity, new_stock_buffer):
    """Update the stock buffer in the database after stock adjustments."""
    conn = connect_sqlite()
    cursor = conn.cursor()

    query = """
    UPDATE stock_data
    SET stockBuffer = ?
    WHERE state = ? AND commodity = ?
    """
    cursor.execute(query, (new_stock_buffer, state, commodity))
    conn.commit()
    conn.close()

# ------------------- Seasonality Weightage -------------------
def get_seasonality_factor(commodity):
    """Assign seasonality factor (0.5 to 1.5) based on the current month."""
    seasonality = {
        "wheat": {3: 1.5, 4: 1.3, 5: 1.2},  # peak season in March-May
        "tomato": {6: 1.5, 7: 1.4, 8: 1.3},  # peak season in summer
        "rice": {9: 1.5, 10: 1.4, 11: 1.3},  # peak harvest in autumn
    }
    current_month = datetime.now().month
    return seasonality.get(commodity.lower(), {}).get(current_month, 1.0)

# ------------------- Average Price Retrieval -------------------
def get_average_price(commodity):
    
    avgPrices = {     
        'rice': 43.05,
        'wheat': 32.82,
        'atta (wheat)': 38.01,
        'gram dal': 89.57,
        'tur/arhar Dal': 136.72,
        'urad dal': 121.07,
        'moong dal': 112.69,
        'masoor dal': 88.7,
        'sugar': 45.33,
        'milk @': 58.26,
        'groundnut oil (packed)': 191.9,
        'mustard oil (packed)': 167.49,
        'vanaspati (packed)': 151.03,
        'soya oil (packed)': 145.14,
        'sunflower oil (packed)': 157.7,
        'palm oil (packed)': 137.84,
        'gur': 54.15,
        'tea loose': 270.56,
        'salt pack (iodised)': 21.21,
        'potato': 24.59,
        'onion': 36.56,
        'tomato': 21.89
    }
    
    return avgPrices.get(commodity, 0.0)

# ------------------- Commodity-specific Decay Rates -------------------
def get_decay_rate(commodity):
    decay_rates = {
        # Non-perishable goods (very low decay)
        'rice': 0.001,
        'wheat': 0.001,
        'atta (wheat)': 0.001,
        'gram dal': 0.001,
        'tur/arhar dal': 0.001,
        'urad dal': 0.001,
        'moong dal': 0.001,
        'masoor dal': 0.001,
        'sugar': 0.001,
        'groundnut oil (packed)': 0.0005,
        'mustard oil (packed)': 0.0005,
        'vanaspati (packed)': 0.0005,
        'soya oil (packed)': 0.0005,
        'sunflower oil (packed)': 0.0005,
        'palm oil (packed)': 0.0005,
        'gur': 0.001,
        'tea loose': 0.001,
        'salt pack (iodised)': 0.0001,

        # Semi-perishable goods (moderate decay)
        'milk @': 0.01,  # higher decay due to spoilage risk

        # Highly perishable goods (fast decay)
        'potato': 0.01,
        'onion': 0.015,
        'tomato': 0.02
    }
    return decay_rates.get(commodity.lower(), 0.005)

# ------------------- Stock Optimization Logic -------------------
def calculate_stock_adjustment(prices, stock_buffer, seasonality_factor, commodity):
    """
    Determines stock actions with seasonality, average price checks, and buffer limits.
    
    Args:
        prices (list): Predicted prices from LSTM.
        stock_buffer (float): Stock buffer value in KG.
        seasonality_factor (float): Seasonality multiplier for stock adjustment.
        avg_prices (dict): Dictionary of average prices for each commodity.
        commodity (str): The commodity for which stock adjustment is calculated.
    
    Returns:
        tuple: (action, quantity, duration, adjusted_stock)
    """
    # Price thresholds — 10% rise/drop for triggering stock actions
    threshold_rise = 0.1  
    threshold_fall = -0.1  

    # Get the historical average price of the commodity
    avg_price = get_average_price(commodity) or sum(prices) / len(prices)  # Fallback to moving avg if not found

    # Calculate price change compared to average price
    latest_price = prices[-1]
    price_change = (latest_price - avg_price) / avg_price

    # Max release adjusted for seasonality (up to 25% of stock buffer)
    max_release = int(stock_buffer * 0.25 * seasonality_factor)

    # Ensure a minimum of 20% stock buffer is maintained
    min_buffer = int(stock_buffer * 0.2)

    max_procure = int(stock_buffer * 0.3)

    # Dynamically adjust thresholds for stable vs volatile commodities
    if avg_price <= 50:  # Consider low-cost items like vegetables
        threshold_rise *= 1.2  # Allow slightly more flexibility
        threshold_fall *= 1.2
    elif avg_price >= 150:  # High-cost items like oils or grains
        threshold_rise *= 0.8  # Be stricter on price spikes
        threshold_fall *= 0.8

    # Decision logic
    if price_change > threshold_rise:  # Prices rising — release stock
        action = "releasing"
        quantity = min(max_release, stock_buffer - min_buffer)
        duration = min(len(prices), 30)
        adjusted_stock = max(stock_buffer - (quantity * duration), min_buffer)
    elif price_change < threshold_fall:  # Prices falling — procure stock
        action = "procuring"
        quantity = max(int(stock_buffer * 0.15), 100)  # Procure at least 100kg
        duration = min(len(prices), 30)
        adjusted_stock = stock_buffer + (quantity * duration)
    else:  # Prices stable — hold stock
        action = "holding"
        quantity = 0
        duration = 0
        # Natural stock decay (0.5% per day)
        decay_rate = get_decay_rate(commodity)
        adjusted_stock = max(int(stock_buffer * (1 - (decay_rate * len(prices)))), min_buffer)


    return action, quantity, duration, adjusted_stock

# ------------------- AI-generated Suggestion (Gemini) -------------------

def generate_suggestion(state, commodity, action, quantity, duration):
    """
    Use Gemini AI to generate dynamic, human-like suggestions for stock optimization.
    """
    if action == "holding":
        prompt = f""" 
        Provide a concise, confident recommendation to hold the stock buffer steady while advising continuous monitoring.
        give me a intellectual advice using the following context while keeping the information as it is and use basic level english,
        do not change any variables you can only change text and you can not hallucinate any non existing information out of the context I have provided.
        talk like you are part of it instead of third person and be professional, be sure to mention the state and commodity for sure
        Context:
        The latest prediction results shows no significant price fluctuations for {commodity} in {state}. 
        The current market appears stable, and no immediate stock intervention is necessary. 
        Suggest maintaining the existing stock levels without procurement or release for the time being. 
        
        """
    else:
        prompt = f"""
        Provide a direct and simple recommendation for the next steps in basic level english.
        give me a intellectual advice using the following information while keeping the information as it is and use basic level english,
        do not change any variables you can only change text and you can not hallucinate any non existing information out of the context I have provided.
        talk like you are part of it instead of third person and be professional, be sure to mention the state and commodity for sure
        
        Context:
        Predictive models suggest a possible price {action} for {commodity} in {state}. 
        Based on current stock levels and seasonal trends, we recommend {action} around {quantity} KGs per day for the next {duration} days. 
        This will help keep prices stable and ensure the stock buffer remains at a safe level. 
        Please monitor the situation daily and adjust the plan if needed. 
        
        """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error generating suggestion: {e}"

import time

def generate_suggestion(state, commodity, action, quantity, duration):
    """
    Use Gemini AI to generate stock optimization suggestions with retries.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        if action == "holding":
            prompt = f""" 
            Provide a concise, confident recommendation to hold the stock buffer steady while advising continuous monitoring.
            give me a intellectual advice using the following context while keeping the information as it is and use basic level english,
            do not change any variables you can only change text and you can not hallucinate any non existing information out of the context I have provided.
            talk like you are part of it instead of third person and be professional, be sure to mention the state and commodity for sure
            Context:
            The latest prediction results shows no significant price fluctuations for {commodity} in {state}. 
            The current market appears stable, and no immediate stock intervention is necessary. 
            Suggest maintaining the existing stock levels without procurement or release for the time being. 
            
            """
        else:
            prompt = f"""
            Provide a direct and simple recommendation for the next steps in basic level english.
            give me a intellectual advice using the following information while keeping the information as it is and use basic level english,
            do not change any variables you can only change text and you can not hallucinate any non existing information out of the context I have provided.
            talk like you are part of it instead of third person and be professional, be sure to mention the state and commodity for sure
            
            Context:
            Predictive models suggest a possible price {action} for {commodity} in {state}. 
            Based on current stock levels and seasonal trends, we recommend {action} around {quantity} KGs per day for the next {duration} days. 
            This will help keep prices stable and ensure the stock buffer remains at a safe level. 
            Please monitor the situation daily and adjust the plan if needed. 
            
            """
        # Retry logic — try 3 times with exponential backoff
        retries = 3
        for i in range(retries):
            try:
                response = model.generate_content(prompt)
                print("Gemini API Response:", response.text.strip())
                return response.text.strip()
            except Exception as e:
                print(f"[Retry {i+1}/{retries}] Error: {e}")
                time.sleep(2 ** i)  # Exponential backoff (2, 4, 8 seconds)

        return "Error generating suggestion after multiple attempts."
        
    except Exception as e:
        print(f"Error generating suggestion: {e}")
        return f"Error generating suggestion: {e}"

# ------------------- Stock Optimization Flow -------------------
def optimize_stock(input_json):
    """
    Main function to optimize stock based on LSTM predictions and seasonality.
    """
    data = json.loads(input_json)
    state = data['state']
    commodity = data['commodity']
    prices = data['predictions']

    # Fetch stock buffer and seasonality factor
    stock_buffer, _ = fetch_stock_data(state, commodity)
    if stock_buffer is None:
        return f"No stock data found for {commodity} in {state}."

    seasonality_factor = get_seasonality_factor(commodity)

    # Calculate stock adjustment strategy
    action, quantity, duration, adjusted_stock = calculate_stock_adjustment(prices, stock_buffer, seasonality_factor,commodity)

    # Update stock buffer in database
    update_stock_buffer(state, commodity, adjusted_stock)

    # Generate AI-driven suggestion
    suggestion = generate_suggestion(state, commodity, action, quantity, duration)

    return suggestion

