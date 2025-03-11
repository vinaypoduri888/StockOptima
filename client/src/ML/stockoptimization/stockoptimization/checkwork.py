import json
from stockmanagement import optimize_stock

state = "Punjab"
commodity = "Sugar"
predicted_prices_list = [43.24, 53, 43, 34.5, 23.5, 44, 45, 34.3]

input_json = json.dumps({
    "state": state,
    "commodity": commodity.lower(),
    "predictions": predicted_prices_list
})

result = optimize_stock(input_json)
print(result)
