import pandas as pd
import numpy as np
import random

rows = []

stages = ["plastering", "brickwork", "foundation", "concrete"]

for _ in range(1000):

    stage = random.choice(stages)

    area = None
    thickness = None
    volume = None
    soil = None
    brick_size = None
    grade = None

    cement = 0
    sand = 0
    labor = 0

    if stage == "plastering":
        area = random.randint(80, 400)
        thickness = random.choice([10, 12, 15])

        cement = area * thickness * 0.002 + np.random.uniform(-0.5, 0.5)
        sand = cement * 3.2 + np.random.uniform(-1, 1)
        labor = area / random.uniform(80, 120)

    elif stage == "brickwork":
        area = random.randint(150, 500)
        brick_size = random.choice(["standard", "large"])

        factor = 1.0 if brick_size == "standard" else 1.2
        cement = area * 0.025 * factor + np.random.uniform(-1, 1)
        sand = cement * 3.5 + np.random.uniform(-2, 2)
        labor = area / random.uniform(60, 100)

    elif stage == "foundation":
        volume = random.randint(200, 1000)
        soil = random.choice(["clay", "sand", "rock"])

        soil_factor = {"clay": 1.0, "sand": 0.9, "rock": 1.3}
        cement = volume * 0.03 * soil_factor[soil] + np.random.uniform(-2, 2)
        sand = cement * 3.0 + np.random.uniform(-3, 3)
        labor = volume / random.uniform(50, 80)

    elif stage == "concrete":
        volume = random.randint(300, 1000)
        grade = random.choice(["M20", "M25", "M30"])

        grade_factor = {"M20": 1.0, "M25": 1.2, "M30": 1.4}
        cement = volume * 0.025 * grade_factor[grade] + np.random.uniform(-2, 2)
        sand = cement * 2.8 + np.random.uniform(-3, 3)
        labor = volume / random.uniform(60, 90)

    rows.append([
        stage,
        area,
        thickness,
        volume,
        soil,
        brick_size,
        grade,
        round(max(cement, 0), 2),
        round(max(sand, 0), 2),
        round(max(labor, 1))
    ])

df = pd.DataFrame(rows, columns=[
    "stage",
    "area_sqft",
    "thickness_mm",
    "volume_cuft",
    "soil_type",
    "brick_size",
    "grade",
    "cement_bags",
    "sand_cuft",
    "labor_count"
])

df.to_csv("construction_dataset_1000.csv", index=False)

print("Dataset generated successfully!")