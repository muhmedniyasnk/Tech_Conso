from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

STAGE_FEATURES = {
    "plastering":    ["area_sqft", "thickness_mm", "location", "quality"],
    "brickwork":     ["area_sqft", "brick_size", "location", "floors"],
    "foundation":    ["volume_cuft", "soil_type", "depth_m", "location"],
    "concrete":      ["volume_cuft", "grade", "location", "season"],
    "roofing":       ["roof_type", "area_sqm", "pitch_angle", "location", "quality"],
    "walls":         ["length_m", "height_m", "thickness_m", "location", "quality"],
    "plumbing":      ["floors", "bathrooms", "kitchens", "location", "quality"],
    "electrical":    ["floors", "rooms_per_floor", "location", "quality"],
    "painting":      ["area_sqft", "coats", "location", "quality"],
    "tiling":        ["area_sqm", "tile_size", "location", "quality"],
    "waterproofing": ["area_sqm", "method", "location"],
}

ENCODINGS = {
    "soil_type":  {"clay": 0, "sand": 1, "rock": 2},
    "grade":      {"m20": 0, "m25": 1, "m30": 2},
    "brick_size": {"standard": 0, "large": 1},
    "roof_type":  {"sheets": 0, "tile": 1, "concrete": 2},
    "location":   {"rural": 0, "town": 1, "city": 2},
    "quality":    {"basic": 0, "standard": 1, "premium": 2},
    "season":     {"normal": 0, "peak": 1, "offseason": 2, "monsoon": 3},
    "method":     {"membrane": 0, "chemical": 1, "crystalline": 2},
    "tile_size":  {"small": 0, "medium": 1, "large": 2},
}

models = {}
for stage in STAGE_FEATURES:
    path = f"model_{stage}.pkl"
    if os.path.exists(path):
        models[stage] = joblib.load(path)

print(f"Loaded models: {list(models.keys())}")

@app.route('/predict', methods=['POST'])
def predict():
    data  = request.json
    stage = (data.get("stage") or "").lower()

    if stage not in STAGE_FEATURES:
        return jsonify({"error": f"No model for stage '{stage}'"}), 400
    if stage not in models:
        return jsonify({"error": f"Model for '{stage}' not found. Run train_model.py."}), 500

    row = []
    for f in STAGE_FEATURES[stage]:
        val = data.get(f)
        if val is None:
            return jsonify({"error": f"Missing field: {f}"}), 400
        if f in ENCODINGS:
            # Accept both string labels and pre-encoded integers
            str_val = str(val).lower()
            if str_val in ENCODINGS[f]:
                val = ENCODINGS[f][str_val]
            else:
                try:
                    val = int(float(val))  # already numeric
                except:
                    val = 0
        row.append(float(val))

    pred = float(models[stage].predict([row])[0])
    return jsonify({"predicted_cost": round(pred, 2)})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "models": list(models.keys())})

if __name__ == '__main__':
    app.run(port=6001, debug=True)
