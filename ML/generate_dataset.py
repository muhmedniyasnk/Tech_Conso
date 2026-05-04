import pandas as pd
import numpy as np

N = 50000
rng = np.random.default_rng(42)

# Kerala/India realistic multipliers
LOCATION_TIER = [0.80, 1.0, 1.30]        # 0=rural, 1=town, 2=city (Kozhikode/Thrissur/Kochi)
SEASON        = [1.0, 1.10, 0.92, 1.15]  # 0=normal, 1=peak, 2=offseason, 3=monsoon
QUALITY       = [0.85, 1.0, 1.28]        # 0=basic, 1=standard, 2=premium

def noise(n, pct=0.05):
    return rng.normal(1.0, pct, n)

# ── Plastering ─────────────────────────────────────────────────────────────
# Kerala rate: Rs 35–65 per sqft depending on quality
def make_plastering(n=N):
    area      = rng.uniform(50, 5000, n)       # sqft
    thickness = rng.choice([10, 12, 15, 20], n) # mm
    loc       = rng.choice([0, 1, 2], n)
    qual      = rng.choice([0, 1, 2], n)
    base_rate = np.array([35, 48, 65])[qual]    # Rs/sqft
    cost = area * base_rate * (thickness / 12)
    cost *= np.array([LOCATION_TIER[l] for l in loc])
    cost *= noise(n, 0.07)
    return pd.DataFrame({
        "area_sqft": area, "thickness_mm": thickness,
        "location": loc, "quality": qual,
        "cost": np.round(np.maximum(cost, 500), 2)
    })

# ── Brickwork ──────────────────────────────────────────────────────────────
# Kerala rate: Rs 55–80 per sqft
def make_brickwork(n=N):
    area   = rng.uniform(30, 3000, n)
    brick  = rng.choice([0, 1], n)             # 0=standard, 1=large
    loc    = rng.choice([0, 1, 2], n)
    floors = rng.integers(1, 8, n).astype(float)
    rate   = np.where(brick == 0, 55, 48)       # standard brick costs more per sqft
    cost   = area * rate * (1 + floors * 0.05)
    cost  *= np.array([LOCATION_TIER[l] for l in loc])
    cost  *= noise(n, 0.07)
    return pd.DataFrame({
        "area_sqft": area, "brick_size": brick,
        "location": loc, "floors": floors,
        "cost": np.round(np.maximum(cost, 1000), 2)
    })

# ── Foundation ─────────────────────────────────────────────────────────────
# Kerala rate: Rs 4500–7000 per cubic ft depending on soil
def make_foundation(n=N):
    volume = rng.uniform(10, 800, n)            # cubic ft
    soil   = rng.choice([0, 1, 2], n)           # 0=clay, 1=sand, 2=rock
    depth  = rng.uniform(1.5, 7.0, n)           # meters
    loc    = rng.choice([0, 1, 2], n)
    rate   = np.array([5200, 4500, 7000])[soil]  # rock needs blasting = expensive
    cost   = volume * rate * (1 + (depth - 1.5) * 0.10)
    cost  *= np.array([LOCATION_TIER[l] for l in loc])
    cost  *= noise(n, 0.08)
    return pd.DataFrame({
        "volume_cuft": volume, "soil_type": soil,
        "depth_m": depth, "location": loc,
        "cost": np.round(np.maximum(cost, 5000), 2)
    })

# ── Concrete ───────────────────────────────────────────────────────────────
# Kerala rate: M20=Rs 5500, M25=Rs 6200, M30=Rs 7200 per cubic ft
def make_concrete(n=N):
    volume = rng.uniform(5, 500, n)
    grade  = rng.choice([0, 1, 2], n)           # 0=M20, 1=M25, 2=M30
    loc    = rng.choice([0, 1, 2], n)
    season = rng.choice([0, 1, 2, 3], n)
    rate   = np.array([5500, 6200, 7200])[grade]
    cost   = volume * rate
    cost  *= np.array([LOCATION_TIER[l] for l in loc])
    cost  *= np.array([SEASON[s] for s in season])
    cost  *= noise(n, 0.06)
    return pd.DataFrame({
        "volume_cuft": volume, "grade": grade,
        "location": loc, "season": season,
        "cost": np.round(np.maximum(cost, 2000), 2)
    })

# ── Roofing ────────────────────────────────────────────────────────────────
# Kerala: sheets=Rs 1200/sqm, tiles=Rs 2200/sqm, concrete=Rs 4500/sqm
def make_roofing(n=N):
    roof_type = rng.choice([0, 1, 2], n)        # 0=sheets, 1=tile, 2=concrete
    area      = rng.uniform(20, 700, n)          # sqm
    pitch     = np.where(roof_type < 2, rng.uniform(5, 45, n), 0.0)
    loc       = rng.choice([0, 1, 2], n)
    qual      = rng.choice([0, 1, 2], n)
    base_rate = np.array([1200, 2200, 4500])[roof_type]
    pitch_fac = np.where(roof_type < 2, 1 + pitch / 90, 1.0)
    cost      = area * base_rate * pitch_fac
    cost     *= np.array([LOCATION_TIER[l] for l in loc])
    cost     *= np.array([QUALITY[q] for q in qual])
    cost     *= noise(n, 0.07)
    return pd.DataFrame({
        "roof_type": roof_type, "area_sqm": area,
        "pitch_angle": pitch, "location": loc, "quality": qual,
        "cost": np.round(np.maximum(cost, 5000), 2)
    })

# ── Walls ──────────────────────────────────────────────────────────────────
# Kerala: Rs 700–1100 per sqm depending on quality
def make_walls(n=N):
    length    = rng.uniform(5, 250, n)
    height    = rng.uniform(2.8, 5.5, n)
    thickness = rng.uniform(0.1, 0.35, n)
    loc       = rng.choice([0, 1, 2], n)
    qual      = rng.choice([0, 1, 2], n)
    base_rate = np.array([700, 900, 1100])[qual]
    cost      = length * height * thickness * base_rate
    cost     *= np.array([LOCATION_TIER[l] for l in loc])
    cost     *= noise(n, 0.07)
    return pd.DataFrame({
        "length_m": length, "height_m": height,
        "thickness_m": thickness, "location": loc, "quality": qual,
        "cost": np.round(np.maximum(cost, 2000), 2)
    })

# ── Plumbing ───────────────────────────────────────────────────────────────
# Kerala: Rs 25,000–45,000 per bathroom, Rs 18,000–30,000 per kitchen
def make_plumbing(n=N):
    floors    = rng.integers(1, 10, n).astype(float)
    bathrooms = rng.integers(1, 8, n).astype(float)
    kitchens  = rng.integers(1, 5, n).astype(float)
    loc       = rng.choice([0, 1, 2], n)
    qual      = rng.choice([0, 1, 2], n)
    bath_rate = np.array([25000, 35000, 45000])[qual]
    kit_rate  = np.array([18000, 24000, 30000])[qual]
    cost      = (floors * bathrooms * bath_rate) + (kitchens * kit_rate)
    cost     *= np.array([LOCATION_TIER[l] for l in loc])
    cost     *= noise(n, 0.08)
    return pd.DataFrame({
        "floors": floors, "bathrooms": bathrooms,
        "kitchens": kitchens, "location": loc, "quality": qual,
        "cost": np.round(np.maximum(cost, 10000), 2)
    })

# ── Electrical ─────────────────────────────────────────────────────────────
# Kerala: Rs 8,000–15,000 per room for wiring + fixtures
def make_electrical(n=N):
    floors = rng.integers(1, 10, n).astype(float)
    rooms  = rng.integers(2, 15, n).astype(float)
    loc    = rng.choice([0, 1, 2], n)
    qual   = rng.choice([0, 1, 2], n)
    rate   = np.array([8000, 11000, 15000])[qual]
    cost   = floors * rooms * rate
    cost  *= np.array([LOCATION_TIER[l] for l in loc])
    cost  *= noise(n, 0.07)
    return pd.DataFrame({
        "floors": floors, "rooms_per_floor": rooms,
        "location": loc, "quality": qual,
        "cost": np.round(np.maximum(cost, 5000), 2)
    })

# ── Painting ───────────────────────────────────────────────────────────────
# Kerala: Rs 18–40 per sqft depending on quality and coats
def make_painting(n=N):
    area  = rng.uniform(100, 10000, n)
    coats = rng.choice([1, 2, 3], n)
    loc   = rng.choice([0, 1, 2], n)
    qual  = rng.choice([0, 1, 2], n)
    rate  = np.array([18, 26, 40])[qual]
    cost  = area * coats * rate
    cost *= np.array([LOCATION_TIER[l] for l in loc])
    cost *= noise(n, 0.06)
    return pd.DataFrame({
        "area_sqft": area, "coats": coats,
        "location": loc, "quality": qual,
        "cost": np.round(np.maximum(cost, 1000), 2)
    })

# ── Tiling ─────────────────────────────────────────────────────────────────
# Kerala: small=Rs 450/sqm, medium=Rs 650/sqm, large=Rs 950/sqm
def make_tiling(n=N):
    area      = rng.uniform(20, 1200, n)
    tile_size = rng.choice([0, 1, 2], n)        # 0=small(30x30), 1=medium(60x60), 2=large(80x80)
    loc       = rng.choice([0, 1, 2], n)
    qual      = rng.choice([0, 1, 2], n)
    rate      = np.array([450, 650, 950])[tile_size]
    cost      = area * rate
    cost     *= np.array([LOCATION_TIER[l] for l in loc])
    cost     *= np.array([QUALITY[q] for q in qual])
    cost     *= noise(n, 0.07)
    return pd.DataFrame({
        "area_sqm": area, "tile_size": tile_size,
        "location": loc, "quality": qual,
        "cost": np.round(np.maximum(cost, 2000), 2)
    })

# ── Waterproofing ──────────────────────────────────────────────────────────
# Kerala: membrane=Rs 220/sqm, chemical=Rs 320/sqm, crystalline=Rs 520/sqm
def make_waterproofing(n=N):
    area   = rng.uniform(10, 1000, n)
    method = rng.choice([0, 1, 2], n)           # 0=membrane, 1=chemical, 2=crystalline
    loc    = rng.choice([0, 1, 2], n)
    rate   = np.array([220, 320, 520])[method]
    cost   = area * rate
    cost  *= np.array([LOCATION_TIER[l] for l in loc])
    cost  *= noise(n, 0.06)
    return pd.DataFrame({
        "area_sqm": area, "method": method,
        "location": loc,
        "cost": np.round(np.maximum(cost, 1000), 2)
    })

# ── Generate all ───────────────────────────────────────────────────────────
datasets = {
    "plastering":    make_plastering,
    "brickwork":     make_brickwork,
    "foundation":    make_foundation,
    "concrete":      make_concrete,
    "roofing":       make_roofing,
    "walls":         make_walls,
    "plumbing":      make_plumbing,
    "electrical":    make_electrical,
    "painting":      make_painting,
    "tiling":        make_tiling,
    "waterproofing": make_waterproofing,
}

for name, fn in datasets.items():
    df = fn()
    df.to_csv(f"dataset_{name}.csv", index=False)
    print(f"Generated dataset_{name}.csv  ({len(df)} rows, features: {list(df.columns[:-1])})")

print(f"\nAll datasets generated. Total samples: {len(datasets) * N:,}")
