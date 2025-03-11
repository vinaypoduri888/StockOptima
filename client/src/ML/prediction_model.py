import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

def create_sequences(data, seq_length):
    xs, ys = [], []
    if len(data) <= seq_length:
        raise ValueError(f"Not enough data to create sequences. Required: {seq_length}, but only {len(data)} available.")
    
    for i in range(len(data) - seq_length):
        x = data[i:i + seq_length]
        y = data[i + seq_length]
        xs.append(x)
        ys.append(y)
    
    return np.array(xs), np.array(ys)

def train_and_predict(state, commodity, num):
    df = pd.read_excel('agri_data.xlsx', sheet_name=state)
    
    # Fixing the typo, using `df` instead of `data`
    if commodity not in df.columns:
        raise ValueError(f"Commodity {commodity} has No Market in {state}")

    # Select the commodity column and ensure no missing values
    prices = df[commodity].dropna().values.reshape(-1, 1)

    # Check if there are enough data points (at least 60 days)
    seq_length = 60
    if len(prices) < seq_length:
        raise ValueError(f"Not enough data points for {commodity} in {state}. Minimum required: 60, Available: {len(prices)}")

    # Normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(prices)

    # Prepare data for LSTM model (create sequences)
    X, y = create_sequences(scaled_data, seq_length)

    # Reshape X for LSTM input
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))

    # Build the LSTM model
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(X.shape[1], 1)))
    model.add(LSTM(50, return_sequences=False))
    model.add(Dense(25))
    model.add(Dense(1))

    # Compile and train the model
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, y, batch_size=1, epochs=10)  # Increasing epochs for better prediction

    # Predict future prices (next 7 days)
    last_60_days = scaled_data[-60:]
    future_predictions = []
    for _ in range(num):
        X_pred = np.reshape(last_60_days, (1, last_60_days.shape[0], 1))
        predicted_price = model.predict(X_pred)
        future_predictions.append(predicted_price)
        last_60_days = np.append(last_60_days[1:], predicted_price)

    future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

    return future_predictions
