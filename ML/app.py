from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    labour = data['labour']
    materials = data['materials']
    days = data['days']

    prediction = model.predict([[labour, materials, days]])

    return jsonify({
        "predictedCost": float(prediction[0])
    })

if __name__ == '__main__':
    app.run(port=6000)