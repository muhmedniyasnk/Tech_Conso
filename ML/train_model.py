import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor

# Load dataset
df = pd.read_csv("construction_dataset_1000.csv")

# Store models
models = {}

# -------------------------------
# 1. PLASTERING MODEL
# -------------------------------
df_plaster = df[df["stage"] == "plastering"].copy()

X_plaster = df_plaster[["area_sqft", "thickness_mm"]]
y_plaster = df_plaster[["cement_bags", "sand_cuft", "labor_count"]]

model_plaster = RandomForestRegressor()
model_plaster.fit(X_plaster, y_plaster)

joblib.dump({
    "model": model_plaster,
    "features": ["area_sqft", "thickness_mm"]
}, "plastering_model.pkl")

print("✅ Plastering model trained")


# -------------------------------
# 2. BRICKWORK MODEL
# -------------------------------
df_brick = df[df["stage"] == "brickwork"].copy()

X_brick = df_brick[["area_sqft", "brick_size"]]
X_brick = pd.get_dummies(X_brick)

y_brick = df_brick[["cement_bags", "sand_cuft", "labor_count"]]

model_brick = RandomForestRegressor()
model_brick.fit(X_brick, y_brick)

joblib.dump({
    "model": model_brick,
    "features": X_brick.columns.tolist()
}, "brickwork_model.pkl")

print("✅ Brickwork model trained")


# -------------------------------
# 3. FOUNDATION MODEL
# -------------------------------
df_found = df[df["stage"] == "foundation"].copy()

X_found = df_found[["volume_cuft", "soil_type"]]
X_found = pd.get_dummies(X_found)

y_found = df_found[["cement_bags", "sand_cuft", "labor_count"]]

model_found = RandomForestRegressor()
model_found.fit(X_found, y_found)

joblib.dump({
    "model": model_found,
    "features": X_found.columns.tolist()
}, "foundation_model.pkl")

print("✅ Foundation model trained")


# -------------------------------
# 4. CONCRETE MODEL
# -------------------------------
df_conc = df[df["stage"] == "concrete"].copy()

X_conc = df_conc[["volume_cuft", "grade"]]
X_conc = pd.get_dummies(X_conc)

y_conc = df_conc[["cement_bags", "sand_cuft", "labor_count"]]

model_conc = RandomForestRegressor()
model_conc.fit(X_conc, y_conc)

joblib.dump({
    "model": model_conc,
    "features": X_conc.columns.tolist()
}, "concrete_model.pkl")

print("✅ Concrete model trained")


print("\n🎯 All models trained and saved successfully!")