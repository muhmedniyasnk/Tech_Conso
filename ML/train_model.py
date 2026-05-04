import pandas as pd
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_percentage_error

stages = {
    "plastering":    ("dataset_plastering.csv",    ["area_sqft", "thickness_mm", "location", "quality"]),
    "brickwork":     ("dataset_brickwork.csv",     ["area_sqft", "brick_size", "location", "floors"]),
    "foundation":    ("dataset_foundation.csv",    ["volume_cuft", "soil_type", "depth_m", "location"]),
    "concrete":      ("dataset_concrete.csv",      ["volume_cuft", "grade", "location", "season"]),
    "roofing":       ("dataset_roofing.csv",       ["roof_type", "area_sqm", "pitch_angle", "location", "quality"]),
    "walls":         ("dataset_walls.csv",         ["length_m", "height_m", "thickness_m", "location", "quality"]),
    "plumbing":      ("dataset_plumbing.csv",      ["floors", "bathrooms", "kitchens", "location", "quality"]),
    "electrical":    ("dataset_electrical.csv",    ["floors", "rooms_per_floor", "location", "quality"]),
    "painting":      ("dataset_painting.csv",      ["area_sqft", "coats", "location", "quality"]),
    "tiling":        ("dataset_tiling.csv",        ["area_sqm", "tile_size", "location", "quality"]),
    "waterproofing": ("dataset_waterproofing.csv", ["area_sqm", "method", "location"]),
}

for stage, (csv, features) in stages.items():
    df = pd.read_csv(csv)
    X, y = df[features], df["cost"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

    model = GradientBoostingRegressor(
        n_estimators=500,
        learning_rate=0.03,
        max_depth=6,
        min_samples_split=10,
        subsample=0.85,
        random_state=42
    )
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    r2   = r2_score(y_test, preds)
    mape = mean_absolute_percentage_error(y_test, preds) * 100
    joblib.dump(model, f"model_{stage}.pkl")
    print(f"[{stage:15s}]  R²={r2:.4f}  MAPE={mape:.2f}%  saved model_{stage}.pkl")

print("\nAll models trained successfully.")
