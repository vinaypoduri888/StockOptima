from flask import Flask, request, jsonify
from prediction_model import train_and_predict
from flask_cors import CORS
import json
from stockoptimization.stockoptimization.stockmanagement import optimize_stock

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend communication

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("Received data:", data)  # Debug log
        
        state = data['state']
        commodity = data['commodity']
        num_days = int(data['days'])

        print(f"Running prediction for {state}, {commodity} for {num_days} days.")  # Debug log
        
        # Call the prediction function
        predicted_prices = train_and_predict(state, commodity, num_days)
        predicted_prices_list = predicted_prices.flatten().tolist()
        
        print("Predicted prices:", predicted_prices_list)  # Debug log

        input_data = json.dumps({
            "state": state,
            "commodity": commodity.lower(),
            "predictions": predicted_prices_list
        })
        
        print("Sending input to optimize_stock:", input_data)  # Debug log
        
        recommendation = optimize_stock(input_data)

        print("Generated recommendation:", recommendation)  # Debug log

        return jsonify({
            "predicted_prices": predicted_prices_list,
            "recommendation": recommendation,
            "success": True
        })
    except Exception as e:
        print("Error in /predict:", str(e))  # Print the error to console
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
