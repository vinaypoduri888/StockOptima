import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import LSTM, Dense # type: ignore
from sklearn.preprocessing import MinMaxScaler

def train_and_predict(state, commodity_name,num):
    # Load data from the Excel file
    data = pd.read_excel('agri_data.xlsx')
    df = data.parse(state)
    
    if commodity_name not in df.columns:
        return np.zeros(num)  # If commodity is not cultivated
    
    # Preprocessing steps
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
    prices = df[[commodity_name]].values

    # Scaling the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(prices)

    # Prepare training data
    train_size = int(len(scaled_data) * 0.8)
    train_data = scaled_data[:train_size]
    X_train, y_train = [], []
    
    for i in range(60, len(train_data)):
        X_train.append(train_data[i-60:i, 0])
        y_train.append(train_data[i, 0])
    
    X_train, y_train = np.array(X_train), np.array(y_train)
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

    # Build LSTM model
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
    model.add(LSTM(units=50))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    
    # Train the model
    model.fit(X_train, y_train, epochs=5, batch_size=32)

    # Predict the next 7 days
    test_input = scaled_data[-60:]
    test_input = np.reshape(test_input, (1, test_input.shape[0], 1))
    predicted_prices = model.predict(test_input)
    predicted_prices = scaler.inverse_transform(predicted_prices).flatten()

    return predicted_prices[:num]
